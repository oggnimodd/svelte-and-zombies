import BasePlant from "./Plant";
import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import KernelProjectile from "../projectiles/KernelProjectile";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import { CELL_WIDTH } from "../../../constants/sizes";
import EventEmitter from "../EventEmitter";

export default class Kernelpult extends BasePlant {
  private lastShotTime: { [key: string]: number } = {};

  constructor() {
    super({
      id: "kernelpult",
      name: "Kernel-pult",
      price: 100,
      health: 100,
      damage: 20,
      cooldown: 3000,
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
    return ProjectileTypes.KERNEL;
  }

  shoot(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): KernelProjectile | null {
    if (plantedPlant.currentHealth <= 0) return null;

    const targetZombie = this.findTarget(plantedPlant, zombies);
    if (!targetZombie) return null;

    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    const targetX = targetZombie.x + targetZombie.width / 2;

    const projectile = new KernelProjectile(
      generate(),
      this.getProjectileStats(),
      plantedPlant.coordinates.x + projectileXOffset,
      rowYPosition + projectileYOffset,
      targetX,
      plantedPlant.cell.row,
      this
    );

    this.lastShotTime[plantedPlant.plantedId] = gameTime;
    return projectile;
  }
}
