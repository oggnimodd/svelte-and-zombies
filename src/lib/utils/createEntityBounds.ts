import type { PlantedPlant } from "../models/game/PlantManager.svelte";
import type Zombie from "../models/zombies/Zombie.svelte";
import { CELL_WIDTH } from "../constants/sizes";

export function createPlantBounds(plant: PlantedPlant) {
  return {
    id: plant.plantedId,
    x: plant.coordinates.x,
    y: plant.coordinates.y,
    width: CELL_WIDTH,
    height: CELL_WIDTH,
  };
}

export function createZombieBounds(zombie: Zombie) {
  return {
    id: zombie.name + "_" + zombie.row + "_" + zombie.x,
    x: zombie.x,
    y: zombie.y,
    width: zombie.width,
    height: zombie.height,
  };
}
