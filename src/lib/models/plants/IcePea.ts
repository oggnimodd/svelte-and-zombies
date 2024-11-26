import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import Projectile from "../projectiles/Projectile.svelte";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant";
import { CELL_WIDTH } from "../../constants/sizes";

export const IcePeaStats: PlantStats = {
  id: "ice-pea",
  name: "Ice Pea",
  price: 100,
  health: 100,
  damage: 20,
  shootCooldown: 3000,
  range: Infinity,
  buyCooldown: 5000,
};

export default class IcePea extends BasePlant {
  constructor() {
    super(IcePeaStats);
  }

  getProjectileStats(): ProjectileStats {
    return ProjectileTypes.ICE_PEA;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile | null {
    if (plantedPlant.currentHealth <= 0) return null;
    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;
    const projectile = new Projectile({
      id: uuid.generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset,
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
    });

    this.resetLastShotTime(gameTime);
    return projectile;
  }
}
