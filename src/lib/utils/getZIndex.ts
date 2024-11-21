const BASE_Z_INDEX = 100; // Base z-index value
const ROW_MULTIPLIER = 10; // Amount to increase z-index per row
const PLANT_OFFSET = 0; // Plants will be at the base level
const ZOMBIE_OFFSET = 3; // Zombies will be 3 levels above plants
const PROJECTILE_OFFSET = 6; // Projectiles will be 6 levels above plants

export function getPlantZIndex(row: number) {
  return BASE_Z_INDEX + row * ROW_MULTIPLIER + PLANT_OFFSET;
}

export function getZombieZIndex(row: number) {
  return BASE_Z_INDEX + row * ROW_MULTIPLIER + ZOMBIE_OFFSET;
}

export function getProjectileZIndex(row: number) {
  return BASE_Z_INDEX + row * ROW_MULTIPLIER + PROJECTILE_OFFSET;
}
