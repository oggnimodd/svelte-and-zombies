import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import Projectile from "../projectiles/Projectile.svelte";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant";
import { CELL_WIDTH, NUM_ROWS } from "../../constants/sizes";
import ThreepeaterProjectile from "../projectiles/ThreepeaterProjectile";
import PeaProjectile from "../projectiles/PeaProjectile";

export const ThreepeaterStats: PlantStats = {
  id: "threepeater",
  name: "Threepeater",
  price: 325,
  health: 100,
  damage: 20,
  cooldown: 2000,
  range: Infinity,
};

export default class Threepeater extends BasePlant {
  constructor() {
    super(ThreepeaterStats);
  }

  getProjectileStats() {
    return ProjectileTypes.PEA;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile[] | null {
    if (plantedPlant.currentHealth <= 0) return null;

    const projectiles: Projectile[] = [];
    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const sourceRow = plantedPlant.cell.row;
    const startY = sourceRow * CELL_WIDTH + projectileYOffset;

    // Calculate valid target rows
    const targetRows = [-1, 0, 1]
      .map((offset) => sourceRow + offset)
      .filter((row) => row >= 0 && row < NUM_ROWS);

    // Create projectiles for each valid row
    targetRows.forEach((targetRow) => {
      const projectile =
        targetRow === sourceRow
          ? new PeaProjectile({
              // Middle pea uses normal projectile
              id: uuid.generate(),
              stats: this.getProjectileStats(),
              x: plantedPlant.coordinates.x + projectileXOffset,
              y: startY,
              row: sourceRow,
              sourcePlant: this,
            })
          : new ThreepeaterProjectile({
              // Top and bottom peas use special diagonal projectile
              id: uuid.generate(),
              stats: this.getProjectileStats(),
              x: plantedPlant.coordinates.x + projectileXOffset,
              y: startY,
              sourceRow,
              targetRow,
              sourcePlant: this,
            });

      projectiles.push(projectile);
    });

    this.resetLastShotTime(gameTime);
    return projectiles;
  }
}
