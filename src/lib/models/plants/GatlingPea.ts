import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import PeaProjectile from "../projectiles/PeaProjectile";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant.svelte";
import { CELL_WIDTH } from "../../constants/sizes";
import type Projectile from "../projectiles/Projectile.svelte";

export const GatlingPeaStats: PlantStats = {
  id: "gatling-pea",
  name: "Gatling Pea",
  price: 300,
  health: 100,
  damage: 20,
  shootCooldown: 2000, // Similar cooldown to Repeater
  range: Infinity,
  buyCooldown: 10000,
  description:
    "Rapidly fires four peas in a straight line. High damage output but costs more sun.",
};

export default class GatlingPea extends BasePlant {
  constructor() {
    super(GatlingPeaStats);
  }

  getProjectileStats(): ProjectileStats {
    return ProjectileTypes.PEA;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile[] | null {
    if (plantedPlant.plant.health <= 0) return null;

    const projectiles: Projectile[] = [];
    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    // Define a consistent offset for each pea
    const offsets = [
      -0.5 * CELL_WIDTH,
      -0.25 * CELL_WIDTH,
      0,
      0.25 * CELL_WIDTH,
    ]; // Adjust these values to control the spread

    // Shoot four peas
    for (let i = 0; i < 4; i++) {
      const offset = offsets[i];
      const projectile = new PeaProjectile({
        id: uuid.generate(),
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
