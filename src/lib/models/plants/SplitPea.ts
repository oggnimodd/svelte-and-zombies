import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import Projectile from "../projectiles/Projectile.svelte";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import PeaProjectile from "../projectiles/PeaProjectile";

export const SplitPeaStats: PlantStats = {
  id: "splitpea",
  name: "Split Pea",
  price: 200,
  health: 100,
  damage: 20,
  cooldown: 3000,
  range: Infinity,
};

export default class SplitPea extends BasePlant {
  constructor() {
    super(SplitPeaStats);
  }

  getProjectileStats(): ProjectileStats {
    return ProjectileTypes.PEA;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile[] | null {
    if (plantedPlant.currentHealth <= 0) return null;

    const projectiles: Projectile[] = [];
    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    // Shoot the first pea to the right
    const rightProjectile = new PeaProjectile({
      id: generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset,
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
    });
    projectiles.push(rightProjectile);

    // Shoot the second pea to the left
    const leftProjectile = new PeaProjectile({
      id: generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset,
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
      direction: -1, // Negative direction for left movement
    });
    projectiles.push(leftProjectile);

    this.resetLastShotTime(gameTime);
    return projectiles;
  }
}
