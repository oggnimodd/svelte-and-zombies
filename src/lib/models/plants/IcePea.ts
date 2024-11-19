import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import Projectile from "../projectiles/Projectile.svelte";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import EventEmitter from "../EventEmitter";

export default class IcePea extends BasePlant {
  private lastShotTime: { [key: string]: number } = {}; // Track lastShotTime per planted instance

  constructor() {
    super({
      id: "ice-pea",
      name: "Ice Pea",
      price: 100,
      health: 100,
      damage: 20,
      cooldown: 3000,
      range: Infinity,
    });

    // Subscribe to plant removal events to clean up lastShotTime
    EventEmitter.on("plantRemoved", (plantedId: string) => {
      this.cleanupLastShotTime(plantedId);
    });
  }

  canShoot(plantedId: string, gameTime: number): boolean {
    if (!this.lastShotTime[plantedId]) {
      this.lastShotTime[plantedId] = 0;
    }
    return gameTime - this.lastShotTime[plantedId] >= this.cooldown;
  }

  private cleanupLastShotTime(plantedId: string) {
    delete this.lastShotTime[plantedId];
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
      id: generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset,
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
    });

    this.lastShotTime[plantedPlant.plantedId] = gameTime;
    return projectile;
  }
}
