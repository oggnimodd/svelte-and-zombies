import Projectile from "./Projectile.svelte";
import {
  CELL_WIDTH,
  YARD_BOUNDARY_OFFSET,
  YARD_WIDTH,
} from "../../constants/sizes";
import type { ProjectileStats } from "./ProjectileTypes";
import type BasePlant from "../plants/Plant.svelte";
import type Zombie from "../zombies/Zombie.svelte";

interface BoomerangProjectileProps {
  id: string;
  stats: ProjectileStats;
  x: number;
  y: number;
  row: number;
  sourcePlant: BasePlant;
  sourceX: number;
}

export default class BoomerangProjectile extends Projectile {
  private isReturning: boolean = false;
  private sourceX: number;
  private hitZombies: Set<string> = new Set();

  constructor({
    id,
    stats,
    x,
    y,
    row,
    sourcePlant,
    sourceX,
  }: BoomerangProjectileProps) {
    super({ id, stats, x, y, row, sourcePlant });
    this.sourceX = sourceX;
  }

  move(deltaTime: number) {
    const moveSpeed = this.speed * (deltaTime / 1000) * CELL_WIDTH;

    if (!this.isReturning) {
      // Move right
      this.x += moveSpeed;
      if (
        this.x >=
        YARD_WIDTH + YARD_BOUNDARY_OFFSET - YARD_BOUNDARY_OFFSET / 2
      ) {
        this.isReturning = true;
        this.hitZombies.clear(); // Reset hit zombies for the return phase
      }
    } else {
      // Move left, return to source
      this.x -= moveSpeed;
    }
  }

  hasReturnedToSource(): boolean {
    return this.isReturning && this.x <= this.sourceX;
  }

  shouldApplyDamage(zombie: Zombie): boolean {
    const zombieKey = zombie.id;
    if (!this.hitZombies.has(zombieKey)) {
      this.hitZombies.add(zombieKey);
      return true;
    }
    return false; // No need to apply damage to this zombie, because we already hit it
  }
}
