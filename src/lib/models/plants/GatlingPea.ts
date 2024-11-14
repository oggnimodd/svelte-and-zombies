import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import Projectile from "../projectiles/Projectile.svelte";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import EventEmitter from "../EventEmitter";

export default class GatlingPea extends BasePlant {
  private lastShotTime: { [key: string]: number } = {};
  private shotCount: { [key: string]: number } = {};

  constructor() {
    super({
      id: "gatling-pea",
      name: "Gatling Pea",
      price: 300,
      health: 100,
      damage: 20,
      cooldown: 2000, // Similar cooldown to Repeater
      range: Infinity,
    });

    EventEmitter.on("plantRemoved", (plantedId: string) => {
      this.cleanupLastShotTime(plantedId);
    });
  }

  canShoot(plantedId: string, currentTime: number): boolean {
    if (!this.lastShotTime[plantedId]) {
      this.lastShotTime[plantedId] = 0;
    }
    return currentTime - this.lastShotTime[plantedId] >= this.cooldown;
  }

  private cleanupLastShotTime(plantedId: string) {
    delete this.lastShotTime[plantedId];
    delete this.shotCount[plantedId];
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
      const projectile = new Projectile(
        generate(),
        this.getProjectileStats(),
        plantedPlant.coordinates.x + projectileXOffset + offset,
        rowYPosition + projectileYOffset,
        plantedPlant.cell.row,
        this
      );
      projectiles.push(projectile);
    }

    this.lastShotTime[plantedPlant.plantedId] = gameTime;
    return projectiles;
  }
}
