import { CELL_WIDTH } from "../../constants/sizes";
import type { PlantedPlant } from "../game/PlantManager.svelte";

export interface ZombieConfig {
  name: string;
  health: number;
  damage: number;
  speed: number;
  row: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
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
  width: number = CELL_WIDTH / 1.5;
  height: number = CELL_WIDTH / 1.5;
  attackingPlantId: string | null = $state(null);

  private baseSpeed: number;
  private freezeEndTime: number = 0;
  private stunEndTime: number = 0;

  constructor(config: ZombieConfig) {
    this.name = config.name;
    this.health = config.health;
    this.damage = config.damage;
    this.speed = config.speed;
    this.row = config.row;
    this.x = config.x ?? 1100;
    this.y = config.y ?? 0;
    this.baseSpeed = config.speed;
  }

  freeze(duration: number) {
    // Set freeze end time to the latest end time
    this.freezeEndTime = Math.max(
      performance.now() + duration,
      this.freezeEndTime
    );
    this.isFrozen = true;
    this.speed = this.baseSpeed * 0.5;
  }

  stun(duration: number) {
    // Set stun end time to the latest end time
    this.stunEndTime = Math.max(performance.now() + duration, this.stunEndTime);
    this.isStunned = true;
  }

  move(deltaTime: number) {
    const currentTime = performance.now();

    // Handle stun recovery
    if (this.stunEndTime > 0 && currentTime > this.stunEndTime) {
      this.stunEndTime = 0;
      this.isStunned = false;
    }

    // Handle freeze recovery
    if (this.freezeEndTime > 0 && currentTime > this.freezeEndTime) {
      this.freezeEndTime = 0;
      this.isFrozen = false;
      this.speed = this.baseSpeed;
    }

    // Don't move if stunned, regardless of freeze status
    if (this.isStunned) {
      return;
    }

    // If not stunned but frozen, move at reduced speed
    if (!this.isAttacking) {
      this.x -= this.speed * (deltaTime / 16) * 0.5;
    }
  }

  attack(plant: PlantedPlant, currentTime: number): boolean {
    // Don't attack if stunned, regardless of freeze status
    if (this.isStunned) {
      return false;
    }

    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      plant.currentHealth -= this.damage;
      this.lastAttackTime = currentTime;
      return true;
    }
    return false;
  }

  // For debugging
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
