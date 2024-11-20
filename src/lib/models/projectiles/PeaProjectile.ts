import type { ProjectileProps } from "./Projectile.svelte";
import Projectile from "./Projectile.svelte";
import { ProjectileTypes } from "./ProjectileTypes";

interface PeaProjectileProps extends ProjectileProps {
  isFirePea?: boolean;
}

export default class PeaProjectile extends Projectile {
  isFirePea: boolean;

  constructor({
    id,
    stats,
    x,
    y,
    row,
    sourcePlant,
    direction = 1,
    isFirePea = false,
  }: PeaProjectileProps) {
    super({ id, stats, x, y, row, sourcePlant, direction });
    this.isFirePea = isFirePea;
    if (isFirePea) {
      this.transformToFirePea();
    }
  }

  transformToFirePea() {
    const originalWidth = this.width;
    const originalHeight = this.height;
    this.type = ProjectileTypes.FIRE_PEA.type;
    this.damage *= 2;
    this.image = ProjectileTypes.FIRE_PEA.image;
    this.width = ProjectileTypes.FIRE_PEA.width;
    this.height = ProjectileTypes.FIRE_PEA.height;
    const widthOffset = (this.width - originalWidth) / 2;
    const heightOffset = (this.height - originalHeight) / 2;
    this.x -= widthOffset;
    this.y -= heightOffset;
    this.isFirePea = true;
  }
}
