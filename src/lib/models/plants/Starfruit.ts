import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import EventEmitter from "../EventEmitter";
import StarProjectile from "../projectiles/StarProjectile";
import type Projectile from "../projectiles/Projectile.svelte";

// TODO: Improve performance
export default class Starfruit extends BasePlant {
  private lastShotTime: { [key: string]: number } = {};
  private readonly DIRECTIONS = [
    { angle: Math.PI, direction: -1 }, // Left
    { angle: -Math.PI / 2, direction: 0 }, // Up
    { angle: Math.PI / 2, direction: 0 }, // Down
    { angle: -Math.PI / 4, direction: 1 }, // Diagonal up-right
    { angle: Math.PI / 4, direction: 1 }, // Diagonal down-right
  ] as const;

  constructor() {
    super({
      id: "starfruit",
      name: "Starfruit",
      price: 175,
      health: 100,
      damage: 20,
      cooldown: 2000,
      range: Infinity,
    });

    EventEmitter.on("plantRemoved", this.cleanupPlant.bind(this));
  }

  private cleanupPlant(plantedId: string) {
    delete this.lastShotTime[plantedId];
  }

  canShoot(plantedId: string, gameTime: number): boolean {
    if (!this.lastShotTime[plantedId]) {
      this.lastShotTime[plantedId] = 0;
    }
    return gameTime - this.lastShotTime[plantedId] >= this.cooldown;
  }

  getProjectileStats() {
    return ProjectileTypes.STAR;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile[] {
    if (plantedPlant.currentHealth <= 0) return [];

    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const startX = plantedPlant.coordinates.x + projectileXOffset;
    const startY = plantedPlant.cell.row * CELL_WIDTH + projectileYOffset;

    const projectiles = this.DIRECTIONS.map(
      ({ angle, direction }) =>
        new StarProjectile(
          generate(),
          this.getProjectileStats(),
          startX,
          startY,
          plantedPlant.cell.row,
          this,
          angle,
          direction
        )
    );

    this.lastShotTime[plantedPlant.plantedId] = gameTime;
    return projectiles;
  }
}
