import Projectile from "./Projectile.svelte";
import type BasePlant from "../plants/Plant";
import type { ProjectileStats } from "./ProjectileTypes";

export default class StarProjectile extends Projectile {
  private angle: number;
  private readonly baseSpeed: number;

  constructor(
    id: string,
    stats: ProjectileStats,
    x: number,
    y: number,
    row: number,
    sourcePlant: BasePlant,
    angle: number,
    direction: number
  ) {
    super(id, stats, x, y, row, sourcePlant, direction);
    this.angle = angle;
    this.baseSpeed = stats.speed;
  }

  move(deltaTime: number) {
    const speedAdjustment = this.baseSpeed * (deltaTime / 16);

    // Calculate x and y components based on angle
    this.x += Math.cos(this.angle) * speedAdjustment;
    this.y += Math.sin(this.angle) * speedAdjustment;
  }
}
