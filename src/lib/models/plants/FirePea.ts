import { generate } from "short-uuid";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import PeaProjectile from "../projectiles/PeaProjectile";
import type { ProjectileStats } from "../projectiles/ProjectileTypes";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import BasePlant, { type PlantStats } from "./Plant";
import { CELL_WIDTH } from "../../../constants/sizes";
import type Projectile from "../projectiles/Projectile.svelte";

export const FirePeaStats: PlantStats = {
  id: "firepea",
  name: "Firepea",
  price: 200,
  health: 100,
  damage: 40,
  cooldown: 2000, // Reduced cooldown compared to Peashooter
  range: Infinity,
};

export default class FirePea extends BasePlant {
  constructor() {
    super(FirePeaStats);
  }

  getProjectileStats(): ProjectileStats {
    return ProjectileTypes.FIRE_PEA;
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): Projectile[] | null {
    if (plantedPlant.currentHealth <= 0) return null;

    const projectiles: Projectile[] = [];
    const projectileXOffset = CELL_WIDTH / 2;
    const projectileYOffset =
      (CELL_WIDTH - this.getProjectileStats().height) / 2;
    const rowYPosition = plantedPlant.cell.row * CELL_WIDTH;

    // Shoot the first pea
    const firstProjectile = new PeaProjectile({
      id: generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset - 30, // Slightly offset
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
      isFirePea: true,
    });
    projectiles.push(firstProjectile);

    // Shoot the second pea
    const secondProjectile = new PeaProjectile({
      id: generate(),
      stats: this.getProjectileStats(),
      x: plantedPlant.coordinates.x + projectileXOffset + 5, // Slightly offset
      y: rowYPosition + projectileYOffset,
      row: plantedPlant.cell.row,
      sourcePlant: this,
      isFirePea: true,
    });
    projectiles.push(secondProjectile);

    this.resetLastShotTime(gameTime);
    return projectiles;
  }
}
