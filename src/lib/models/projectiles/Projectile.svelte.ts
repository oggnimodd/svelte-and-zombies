import { type ProjectileStats } from "./ProjectileTypes";
import type BasePlant from "../plants/Plant";

export interface ProjectileProps {
  id: string;
  stats: ProjectileStats;
  x: number;
  y: number;
  row: number;
  sourcePlant: BasePlant;
  direction?: number;
}

export default class Projectile {
  id: string;
  type: string;
  damage: number;
  speed: number;
  x: number;
  y: number;
  row: number;
  width: number;
  height: number;
  image: string;
  sourcePlant: BasePlant;
  stats: ProjectileStats;
  direction: number;

  constructor({
    id,
    stats,
    x,
    y,
    row,
    sourcePlant,
    direction = 1,
  }: ProjectileProps) {
    this.id = id;
    this.stats = stats;
    this.type = stats.type;
    this.damage = sourcePlant.damage;
    this.speed = stats.speed;
    this.width = stats.width;
    this.height = stats.height;
    this.image = stats.image;
    this.x = x;
    this.y = y;
    this.row = row;
    this.sourcePlant = sourcePlant;
    this.direction = direction;
  }

  move(deltaTime: number) {
    const speedAdjustment = this.speed * (deltaTime / 16);
    this.x += this.direction * speedAdjustment;
  }

  // Override this method in subclasses if needed
  isReadyForCollision(): boolean {
    return true;
  }

  // Override this method in subclasses if needed
  getSplashDamage(distance: number): number {
    return 0;
  }
}
