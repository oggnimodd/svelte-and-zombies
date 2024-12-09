import Projectile from "./Projectile.svelte";
import { CELL_WIDTH, NUM_COLS, YARD_WIDTH } from "../../constants/sizes";
import type BasePlant from "../plants/Plant";
import type { ProjectileStats } from "./ProjectileTypes";

interface WatermelonProjectileProps {
  id: string;
  stats: ProjectileStats;
  startX: number;
  startY: number;
  targetX: number;
  row: number;
  sourcePlant: BasePlant;
  splashRadius: number;
}
export default class WatermelonProjectile extends Projectile {
  private startX: number;
  private startY: number;
  private targetX: number;
  private arcHeight: number = 150;
  private progress: number = 0;
  private readonly IMPACT_THRESHOLD = 0.95;
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
  }: WatermelonProjectileProps) {
    super({ id, stats, x: startX, y: startY, row, sourcePlant });
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.splashRadius = splashRadius;
  }

  move(deltaTime: number) {
    // If already landed, remove the projectile
    if (this.hasLanded) {
      this.x = YARD_WIDTH + 300; // Force removal by moving outside bounds
      return;
    }

    const totalDistance = this.targetX - this.startX;
    // Find a better normalization factor
    this.progress += (this.speed * (deltaTime / 1000) * CELL_WIDTH) / NUM_COLS;
    const normalizedProgress = Math.min(this.progress, 1);

    // Update X position based on progress to target
    this.x = this.startX + totalDistance * normalizedProgress;

    // Calculate arc height
    const arcY =
      -4 *
      this.arcHeight *
      (normalizedProgress * normalizedProgress - normalizedProgress);

    // Update Y position with arc
    this.y = this.startY - arcY;

    // Mark as landed when reaching target
    if (normalizedProgress >= 1) {
      this.hasLanded = true;
    }

    // Only allow collisions near the ground
    this.canCollide = normalizedProgress > this.IMPACT_THRESHOLD;
  }

  isReadyForCollision(): boolean {
    return this.canCollide;
  }

  getSplashDamage(distance: number): number {
    if (distance > this.splashRadius) return 0;
    const damageMultiplier = 1 - distance / this.splashRadius;
    return this.damage * damageMultiplier * 0.5;
  }
}
