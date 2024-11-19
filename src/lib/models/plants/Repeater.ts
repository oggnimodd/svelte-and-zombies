import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import Projectile from "../projectiles/Projectile.svelte";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import EventEmitter from "../EventEmitter";

export default class Repeater extends BasePlant {
  private lastShotTime: { [key: string]: number } = {};

  constructor() {
    super({
      id: "repeater",
      name: "Repeater",
      price: 200,
      health: 100,
      damage: 20,
      cooldown: 2000, // Reduced cooldown compared to Peashooter
      range: Infinity,
    });

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
    return ProjectileTypes.PEA;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile[] | null {
    if (plantedPlant.currentHealth <= 0) return null;

    const projectiles: Projectile[] = [];
    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    // Shoot the first pea
    const firstProjectile = new Projectile({
      id: generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset - 30, // Slightly offset
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
    });
    projectiles.push(firstProjectile);

    // Shoot the second pea
    const secondProjectile = new Projectile({
      id: generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset + 5, // Slightly offset
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
    });
    projectiles.push(secondProjectile);

    this.lastShotTime[plantedPlant.plantedId] = gameTime;
    return projectiles;
  }
}
