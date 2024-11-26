import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant";
import { CELL_WIDTH } from "../../constants/sizes";
import StarProjectile from "../projectiles/StarProjectile";
import type Projectile from "../projectiles/Projectile.svelte";

export const StarfruitStats: PlantStats = {
  id: "starfruit",
  name: "Starfruit",
  price: 175,
  health: 100,
  damage: 20,
  shootCooldown: 2000,
  range: Infinity,
  buyCooldown: 8000,
};

// TODO: Improve performance
export default class Starfruit extends BasePlant {
  private readonly DIRECTIONS = [
    { angle: Math.PI, direction: -1 }, // Left
    { angle: -Math.PI / 2, direction: 0 }, // Up
    { angle: Math.PI / 2, direction: 0 }, // Down
    { angle: -Math.PI / 4, direction: 1 }, // Diagonal up-right
    { angle: Math.PI / 4, direction: 1 }, // Diagonal down-right
  ] as const;

  constructor() {
    super(StarfruitStats);
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
        new StarProjectile({
          id: uuid.generate(),
          stats: this.getProjectileStats(),
          x: startX,
          y: startY,
          row: plantedPlant.cell.row,
          sourcePlant: this,
          angle,
          direction,
        })
    );

    this.resetLastShotTime(gameTime);
    return projectiles;
  }
}
