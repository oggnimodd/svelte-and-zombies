import { CELL_WIDTH } from "../../constants/sizes";
import { gameTime } from "../game/GameTime.svelte";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import { soundManager } from "../game/SoundManager.svelte";

export interface ZombieConfig {
  name: string;
  health: number;
  damage: number;
  speed: number;
  row: number;
  x?: number;
  y?: number;
  // Image size, we only need the width to maintain aspect ratio
  imageWidth?: number;
  // Bounding box
  width?: number;
  height?: number;
  image: string;
}

export default class Zombie {
  name: string;
  health: number = $state(0);
  damage: number;
  speed: number;
  row: number;
  x: number;
  y: number;
  isAttacking: boolean = $state(false);
  isFrozen: boolean = $state(false);
  isStunned: boolean = $state(false);
  lastAttackTime: number = $state(0);
  attackCooldown: number = 1000;
  imageWidth: number = CELL_WIDTH / 1.1;
  width: number = CELL_WIDTH / 1.5;
  height: number = CELL_WIDTH / 1.5;
  attackingPlantId: string | null = $state(null);
  image: string;

  private baseSpeed: number;
  private freezeEndTime: number = 0;
  private stunEndTime: number = 0;
  private eatingSoundId: string | null = null;
  isHit: boolean = $state(false);
  hitEndTime: number = 0;
  private hitEffectDuration: number = 80; // Duration of the hit effect

  constructor(config: ZombieConfig) {
    this.name = config.name;
    this.health = config.health;
    this.damage = config.damage;
    this.speed = config.speed;
    this.row = config.row;
    this.x = config.x ?? 1100;
    this.y = config.y ?? 0;
    this.baseSpeed = config.speed;
    this.image = config.image;
    this.imageWidth = config.imageWidth ?? CELL_WIDTH / 1.1;
  }

  freeze(duration: number) {
    this.freezeEndTime = Math.max(
      gameTime.get() + duration,
      this.freezeEndTime
    );
    this.isFrozen = true;
    this.speed = this.baseSpeed * 0.5;
  }

  stun(duration: number) {
    this.stunEndTime = Math.max(gameTime.get() + duration, this.stunEndTime);
    this.isStunned = true;
  }

  takeHit(damage: number) {
    this.health -= damage;
    this.hitEndTime = Math.max(
      gameTime.get() + this.hitEffectDuration,
      this.hitEndTime
    );
    this.isHit = true;
  }

  move(deltaTime: number) {
    const currentTime = gameTime.get();

    if (this.hitEndTime > 0) {
      if (currentTime > this.hitEndTime) {
        this.hitEndTime = 0;
        this.isHit = false;
      }
    }

    if (this.stunEndTime > 0 && currentTime > this.stunEndTime) {
      this.stunEndTime = 0;
      this.isStunned = false;
    }
    if (this.freezeEndTime > 0 && currentTime > this.freezeEndTime) {
      this.freezeEndTime = 0;
      this.isFrozen = false;
      this.speed = this.baseSpeed;
    }
    if (!this.isAttacking && !this.isStunned) {
      this.x -= this.speed * (deltaTime / 1000) * CELL_WIDTH;
    }
  }

  attack(plantedPlant: PlantedPlant, currentTime: number): boolean {
    if (this.isStunned) {
      return false;
    }
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      plantedPlant.plant.takeHit(this.damage, currentTime);
      this.lastAttackTime = currentTime;
      this.startEatingSound();
      return true;
    }
    return false;
  }

  startEatingSound() {
    if (!this.eatingSoundId) {
      this.eatingSoundId = soundManager.playEatingSound();
    }
  }

  stopEatingSound() {
    if (this.eatingSoundId) {
      soundManager.stopEatingSound(this.eatingSoundId);
      this.eatingSoundId = null;
    }
  }

  getStatus() {
    return {
      isStunned: this.isStunned,
      isFrozen: this.isFrozen,
      speed: this.speed,
      baseSpeed: this.baseSpeed,
      stunEndTime: this.stunEndTime,
      freezeEndTime: this.freezeEndTime,
      isHit: this.isHit,
    };
  }
}
