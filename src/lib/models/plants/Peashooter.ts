import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import Projectile from "../projectiles/Projectile.svelte";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant";
import { CELL_WIDTH } from "../../constants/sizes";
import PeaProjectile from "../projectiles/PeaProjectile";

export const PeashooterStats: PlantStats = {
  id: "peashooter",
  name: "Peashooter",
  price: 100,
  health: 100,
  damage: 20,
  shootCooldown: 3000,
  range: Infinity,
  buyCooldown: 5000,
};

export default class Peashooter extends BasePlant {
  constructor() {
    super(PeashooterStats);
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile | null {
    if (plantedPlant.currentHealth <= 0) return null;

    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    const projectile = new PeaProjectile({
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

  getProjectileStats() {
    return ProjectileTypes.PEA;
  }
}
