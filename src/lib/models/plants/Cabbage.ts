import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import CabbageProjectile from "../projectiles/CabbageProjectile";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant.svelte";
import { CELL_WIDTH } from "../../constants/sizes";

export const CabbageStats: PlantStats = {
  id: "cabbage",
  name: "Cabbage-pult",
  price: 100,
  health: 100,
  damage: 40,
  shootCooldown: 2000,
  range: Infinity,
  buyCooldown: 5000,
  description:
    "Lobs cabbages in an arc that can pass over obstacles and shields.",
};

export default class Cabbage extends BasePlant {
  private readonly SPLASH_RADIUS = CELL_WIDTH;

  constructor() {
    super(CabbageStats);
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
    if (plantedPlant.plant.health <= 0) return null;

    const targetZombie = this.findTarget(plantedPlant, zombies);
    if (!targetZombie) return null;

    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    const targetX = targetZombie.x + targetZombie.width / 2;

    const projectile = new CabbageProjectile({
      id: uuid.generate(),
      stats: this.getProjectileStats(),
      startX: plantedPlant.coordinates.x + projectileXOffset,
      startY: rowYPosition + projectileYOffset,
      targetX,
      row: plantedPlant.cell.row,
      sourcePlant: this,
      splashRadius: this.SPLASH_RADIUS,
    });

    this.resetLastShotTime(gameTime);
    return projectile;
  }
}
