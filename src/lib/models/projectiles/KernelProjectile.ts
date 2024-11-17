import Projectile from "./Projectile.svelte";
import type BasePlant from "../plants/Plant";
import type { ProjectileStats } from "./ProjectileTypes";
import { YARD_WIDTH } from "../../../constants/sizes";

export default class KernelProjectile extends Projectile {
  private startX: number;
  private startY: number;
  private targetX: number;
  private arcHeight: number = 120;
  private progress: number = 0;
  private readonly IMPACT_THRESHOLD = 0.95;
  private canCollide: boolean = false;
  private hasLanded: boolean = false;

  constructor(
    id: string,
    stats: ProjectileStats,
    startX: number,
    startY: number,
    targetX: number,
    row: number,
    sourcePlant: BasePlant
  ) {
    super(id, stats, startX, startY, row, sourcePlant);
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
  }

  move(deltaTime: number) {
    if (this.hasLanded) {
      this.x = YARD_WIDTH + 300;
      return;
    }

    const totalDistance = this.targetX - this.startX;
    this.progress += (this.speed * deltaTime) / 1000;
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
