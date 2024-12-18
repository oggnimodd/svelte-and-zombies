import Projectile from "./Projectile.svelte";
import {
  CELL_WIDTH,
  YARD_BOUNDARY_OFFSET,
  YARD_WIDTH,
} from "../../constants/sizes";
import type { ProjectileStats } from "./ProjectileTypes";
import type BasePlant from "../plants/Plant.svelte";
import { soundManager } from "../game/SoundManager.svelte";

interface CabbageProjectileProps {
  id: string;
  stats: ProjectileStats;
  startX: number;
  startY: number;
  targetX: number;
  row: number;
  sourcePlant: BasePlant;
  splashRadius: number;
}

export default class CabbageProjectile extends Projectile {
  private startX: number;
  private startY: number;
  private targetX: number;
  private arcHeight: number = CELL_WIDTH * 1.1;
  private progress: number = 0;
  private readonly IMPACT_THRESHOLD = 0.9;
  private splashRadius: number;
  private canCollide: boolean = false;
  private hasLanded: boolean = false;

  constructor({
    id,
    stats,
    startX,
    startY,
    targetX,
    row,
    sourcePlant,
    splashRadius,
  }: CabbageProjectileProps) {
    super({ id, stats, x: startX, y: startY, row, sourcePlant });
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.splashRadius = splashRadius;
  }

  move(deltaTime: number) {
    // If already landed, remove the projectile
    if (this.hasLanded) {
      this.x = YARD_WIDTH + YARD_BOUNDARY_OFFSET; // Force removal by moving outside bounds
      return;
    }

    // Calculate the total horizontal distance the projectile needs to cover
    const totalDistance = this.targetX - this.startX;

    // Calculate the desired distance the projectile should cover for this update
    // Use a speed relative to CELL_WIDTH so we're independent of screen size
    const speedDistance = this.speed * (deltaTime / 1000) * CELL_WIDTH;

    // Accumulate progress based on speed distance and total distance
    this.progress += speedDistance / totalDistance;

    // Clamp the progress to ensure it does not exceed 1. This is equivalent to our normalized time
    const normalizedProgress = Math.min(this.progress, 1);

    // Update X based on the normalized progress
    this.x = this.startX + totalDistance * normalizedProgress;

    // Use the normalized progress to calculate our arc
    // We'll use a parabola of the form y = -4 * h * x * (x - 1) to achieve a nice arc
    // where x is the normalized progress, and h is the arcHeight
    const arcY =
      -4 * this.arcHeight * normalizedProgress * (normalizedProgress - 1);
    this.y = this.startY - arcY;

    // If we've reached the end, mark as landed
    if (normalizedProgress >= 1) {
      this.hasLanded = true;
      soundManager.playSound("splat");
    }

    // Enable collisions near the ground
    this.canCollide = normalizedProgress > this.IMPACT_THRESHOLD;
  }

  isReadyForCollision(): boolean {
    return this.canCollide;
  }

  getSplashDamage(distance: number): number {
    if (distance > this.splashRadius) return 0;
    // More linear damage falloff
    const damageMultiplier = 0.8 * (1 - distance / this.splashRadius);
    return this.damage * damageMultiplier;
  }
}
