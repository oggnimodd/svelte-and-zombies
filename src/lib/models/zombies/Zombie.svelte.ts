import { CELL_WIDTH } from "../../constants/sizes";
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
  health: number;
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
      performance.now() + duration,
      this.freezeEndTime
    );
    this.isFrozen = true;
    this.speed = this.baseSpeed * 0.5;
  }

  stun(duration: number) {
    this.stunEndTime = Math.max(performance.now() + duration, this.stunEndTime);
    this.isStunned = true;
  }

  move(deltaTime: number) {
    const currentTime = performance.now();
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

  attack(plant: PlantedPlant, currentTime: number): boolean {
    if (this.isStunned) {
      return false;
    }
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      plant.currentHealth -= this.damage;
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
    };
  }
}
