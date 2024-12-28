import uuid from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import PeaProjectile from "../projectiles/PeaProjectile";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant.svelte";
import { CELL_WIDTH } from "../../constants/sizes";
import type Projectile from "../projectiles/Projectile.svelte";

export const RepeaterStats: PlantStats = {
  id: "repeater",
  name: "Repeater",
  price: 200,
  health: 100,
  damage: 20,
  shootCooldown: 2000, // Reduced cooldown compared to Peashooter
  range: Infinity,
  buyCooldown: 5000,
  description:
    "Shoots two peas in a straight line. Double the firepower of a regular peashooter.",
};

export default class Repeater extends BasePlant {
  constructor() {
    super(RepeaterStats);
  }

  getProjectileStats(): ProjectileStats {
    return ProjectileTypes.PEA;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile[] | null {
    if (plantedPlant.plant.health <= 0) return null;

    const projectiles: Projectile[] = [];
    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    // Shoot the first pea
    const firstProjectile = new PeaProjectile({
      id: uuid.generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset - CELL_WIDTH * 0.25, // Slightly offset
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
    });
    projectiles.push(firstProjectile);

    // Shoot the second pea
    const secondProjectile = new PeaProjectile({
      id: uuid.generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset + 5, // Slightly offset
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
    });
    projectiles.push(secondProjectile);

    this.resetLastShotTime(gameTime);
    return projectiles;
  }
}
