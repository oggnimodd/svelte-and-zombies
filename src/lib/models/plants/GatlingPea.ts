import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import PeaProjectile from "../projectiles/PeaProjectile";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import type Projectile from "../projectiles/Projectile.svelte";

export const GatlingPeaStats: PlantStats = {
  id: "gatling-pea",
  name: "Gatling Pea",
  price: 300,
  health: 100,
  damage: 20,
  cooldown: 2000, // Similar cooldown to Repeater
  range: Infinity,
};

export default class GatlingPea extends BasePlant {
  constructor() {
    super(GatlingPeaStats);
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

    // Define a consistent offset for each pea
    const offsets = [-30, -10, 10, 30]; // Adjust these values to control the spread

    // Shoot four peas
    for (let i = 0; i < 4; i++) {
      const offset = offsets[i];
      const projectile = new PeaProjectile({
        id: generate(),
        stats: this.getProjectileStats(),
        x: plantedPlant.coordinates.x + projectileXOffset + offset,
        y: rowYPosition + projectileYOffset,
        row: plantedPlant.cell.row,
        sourcePlant: this,
      });
      projectiles.push(projectile);
    }

    this.resetLastShotTime(gameTime);
    return projectiles;
  }
}
