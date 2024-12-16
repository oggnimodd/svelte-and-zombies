import Projectile from "./Projectile.svelte";
import {
  CELL_WIDTH,
  NUM_COLS,
  YARD_BOUNDARY_OFFSET,
  YARD_WIDTH,
} from "../../constants/sizes";
import type { ProjectileStats } from "./ProjectileTypes";
import type BasePlant from "../plants/Plant";

interface KernelProjectileProps {
  id: string;
  stats: ProjectileStats;
  startX: number;
  startY: number;
  targetX: number;
  row: number;
  sourcePlant: BasePlant;
}
export default class KernelProjectile extends Projectile {
  private startX: number;
  private startY: number;
  private targetX: number;
  private arcHeight: number = 120;
  private progress: number = 0;
  private readonly IMPACT_THRESHOLD = 0.95;
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
  }: KernelProjectileProps) {
    super({ id, stats, x: startX, y: startY, row, sourcePlant });
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
  }

  move(deltaTime: number) {
    if (this.hasLanded) {
      this.x = YARD_WIDTH + YARD_BOUNDARY_OFFSET;
      return;
    }

    const totalDistance = this.targetX - this.startX;
    // Find a better normalization factor
    this.progress += (this.speed * (deltaTime / 1000) * CELL_WIDTH) / NUM_COLS;
    const normalizedProgress = Math.min(this.progress, 1);

    this.x = this.startX + totalDistance * normalizedProgress;

    const arcY =
      -4 *
      this.arcHeight *
      (normalizedProgress * normalizedProgress - normalizedProgress);
    this.y = this.startY - arcY;

    if (normalizedProgress >= 1) {
      this.hasLanded = true;
    }

    this.canCollide = normalizedProgress > this.IMPACT_THRESHOLD;
  }

  isReadyForCollision(): boolean {
    return this.canCollide;
  }
}
