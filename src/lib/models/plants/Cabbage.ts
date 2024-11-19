import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import CabbageProjectile from "../projectiles/CabbageProjectile";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import EventEmitter from "../EventEmitter";

export default class Cabbage extends BasePlant {
  private lastShotTime: { [key: string]: number } = {};
  private readonly SPLASH_RADIUS = CELL_WIDTH;

  constructor() {
    super({
      id: "cabbage",
      name: "Cabbage-pult",
      price: 100,
      health: 100,
      damage: 40,
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
    return rowZombies.reduce((closest, current) =>
      current.x < closest.x ? current : closest
    );
  }

  getProjectileStats() {
    return ProjectileTypes.CABBAGE;
  }

  shoot(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): CabbageProjectile | null {
    if (plantedPlant.currentHealth <= 0) return null;

    const targetZombie = this.findTarget(plantedPlant, zombies);
    if (!targetZombie) return null;

    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    const targetX = targetZombie.x + targetZombie.width / 2;

    const projectile = new CabbageProjectile({
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
