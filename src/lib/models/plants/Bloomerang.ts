import BasePlant, { type PlantStats } from "./Plant.svelte";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import BoomerangProjectile from "../projectiles/BoomerangProjectile";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";
import uuid from "short-uuid";
import { CELL_WIDTH } from "../../constants/sizes";

export const BloomerangStats: PlantStats = {
  id: "bloomerang",
  name: "Bloomerang",
  price: 175,
  health: 300,
  damage: 20,
  shootCooldown: 3000,
  range: Infinity,
  buyCooldown: 5000,
};

export default class Bloomerang extends BasePlant {
  private activeBoomerang: string | null = null;

  constructor() {
    super(BloomerangStats);
  }

  // This plant can only shoot if it has no active boomerang
  canShoot(gameTime: number) {
    return (
      this.activeBoomerang === null &&
      gameTime - this.lastShotTime >= this.shootCooldown
    );
  }

  shoot(plantedPlant: PlantedPlant, gameTime: number): BoomerangProjectile {
    const projectile = new BoomerangProjectile({
      id: uuid.generate(),
      stats: ProjectileTypes.BOOMERANG,
      x: plantedPlant.coordinates.x + CELL_WIDTH / 2,
      y:
        plantedPlant.coordinates.y +
        CELL_WIDTH / 2 -
        ProjectileTypes.BOOMERANG.height / 2,
      row: plantedPlant.cell.row,
      sourcePlant: this,
      sourceX: plantedPlant.coordinates.x + CELL_WIDTH / 2,
    });

    this.setActiveBoomerang(projectile.id);
    this.resetLastShotTime(gameTime);
    return projectile;
  }

  setActiveBoomerang(projectileId: string | null) {
    this.activeBoomerang = projectileId;
  }
}
