import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import WatermelonProjectile from "../projectiles/WatermelonProjectile";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant.svelte";
import { CELL_WIDTH } from "../../constants/sizes";
import { soundManager } from "../game/SoundManager.svelte";

export const WatermelonStats: PlantStats = {
  id: "watermelon",
  name: "Melon-pult",
  price: 300,
  health: 100,
  damage: 80,
  shootCooldown: 2000,
  range: Infinity,
  buyCooldown: 6000,
  description: "Throws heavy melons that deal splash damage to nearby zombies.",
};

export default class Watermelon extends BasePlant {
  private readonly SPLASH_RADIUS = CELL_WIDTH * 1.5;
  private ice: boolean = false;

  // Constructor with optional stats to make it easier to create variations of the plant
  constructor(
    stats?: PlantStats & {
      ice?: boolean;
    }
  ) {
    super(stats ?? WatermelonStats);

    this.ice = stats?.ice ?? false;
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
    return this.ice
      ? ProjectileTypes.ICE_WATERMELON
      : ProjectileTypes.WATERMELON;
  }

  shoot(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): WatermelonProjectile | null {
    if (plantedPlant.plant.health <= 0) return null;

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
    soundManager.playSound("swing");

    return projectile;
  }
}
