import { ProjectileTypes, type ProjectileStats } from "./ProjectileTypes";
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

  transformToFirePea() {
    const originalWidth = this.width;
    const originalHeight = this.height;

    this.type = ProjectileTypes.FIRE_PEA.type;
    this.damage *= 2;
    this.image = ProjectileTypes.FIRE_PEA.image;
    this.width = ProjectileTypes.FIRE_PEA.width;
    this.height = ProjectileTypes.FIRE_PEA.height;

    // Calculate the center offset and adjust the position
    const widthOffset = (this.width - originalWidth) / 2;
    const heightOffset = (this.height - originalHeight) / 2;

    this.x -= widthOffset;
    this.y -= heightOffset;
  }
}
