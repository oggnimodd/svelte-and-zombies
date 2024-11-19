import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import WatermelonProjectile from "../projectiles/WatermelonProjectile";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import EventEmitter from "../EventEmitter";

export default class WinterMelon extends BasePlant {
  private lastShotTime: { [key: string]: number } = {};
  private readonly SPLASH_RADIUS = CELL_WIDTH * 1.5;

  constructor() {
    super({
      id: "wintermelon",
      name: "Winter Melon",
      price: 400,
      health: 100,
      damage: 80,
      cooldown: 2000,
      range: Infinity,
    });

    EventEmitter.on("plantRemoved", (plantedId: string) => {
      delete this.lastShotTime[plantedId];
    });
  }

  canShoot(plantedId: string, gameTime: number): boolean {
    if (!this.lastShotTime[plantedId]) {
      this.lastShotTime[plantedId] = 0;
    }
    return gameTime - this.lastShotTime[plantedId] >= this.cooldown;
  }

  private findTarget(
    plantedPlant: PlantedPlant,
    zombies: Zombie[]
  ): Zombie | null {
    const rowZombies = zombies.filter(
      (zombie) =>
        zombie.row === plantedPlant.cell.row &&
        zombie.x > plantedPlant.coordinates.x
    );

    if (rowZombies.length === 0) return null;

    // Return closest zombie in row
    return rowZombies.reduce((closest, current) =>
      current.x < closest.x ? current : closest
    );
  }

  getProjectileStats() {
    return ProjectileTypes.ICE_WATERMELON;
  }

  shoot(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): WatermelonProjectile | null {
    if (plantedPlant.currentHealth <= 0) return null;

    // Find target zombie
    const targetZombie = this.findTarget(plantedPlant, zombies);
    if (!targetZombie) return null; // Don't shoot if no zombies in row

    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    // Target slightly ahead of the zombie
    const targetX = targetZombie.x + targetZombie.width / 2;

    const projectile = new WatermelonProjectile({
      id: generate(),
      stats: this.getProjectileStats(),
      startX: plantedPlant.coordinates.x + projectileXOffset,
      startY: rowYPosition + projectileYOffset,
      targetX,
      row: plantedPlant.cell.row,
      sourcePlant: this,
      splashRadius: this.SPLASH_RADIUS,
    });

    this.lastShotTime[plantedPlant.plantedId] = gameTime;
    return projectile;
  }
}
