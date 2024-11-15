import { CELL_WIDTH } from "../../../constants/sizes";
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
  lastAttackTime: number = $state(0);
  attackCooldown: number = 1000;
  width: number = CELL_WIDTH / 1.5;
  height: number = CELL_WIDTH / 1.5;
  attackingPlantId: string | null = $state(null);

  private baseSpeed: number;
  private freezeEndTime: number = 0;

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
    this.freezeEndTime = performance.now() + duration;
    this.speed = this.baseSpeed * 0.5;
    this.isFrozen = true;
  }

  move(deltaTime: number) {
    if (this.freezeEndTime > 0 && performance.now() > this.freezeEndTime) {
      this.speed = this.baseSpeed;
      this.freezeEndTime = 0;
      this.isFrozen = false;
    }

    if (!this.isAttacking) {
      this.x -= this.speed * (deltaTime / 16) * 0.5;
    }
  }

  attack(plant: PlantedPlant, currentTime: number): boolean {
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      plant.currentHealth -= this.damage;
      this.lastAttackTime = currentTime;
      return true;
    }
    return false;
  }
}
