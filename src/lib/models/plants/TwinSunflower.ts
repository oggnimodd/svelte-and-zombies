import BasePlant, { type PlantStats } from "./Plant.svelte";
import EventEmitter from "../EventEmitter";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import { gameTime } from "../game/GameTime.svelte";
import { CELL_WIDTH } from "$lib/constants/sizes";

export const TwinSunflowerStats: PlantStats = {
  id: "twin-sunflower",
  name: "Twin Sunflower",
  price: 150,
  health: 100,
  buyCooldown: 8000,
};

export default class TwinSunflower extends BasePlant {
  private lastSunProduction = 0;
  private readonly productionInterval = 8000;

  constructor() {
    super(TwinSunflowerStats);
    this.lastSunProduction = gameTime.get();
  }

  update(plantedPlant: PlantedPlant, gameTime: number) {
    if (gameTime - this.lastSunProduction >= this.productionInterval) {
      // Produce two suns instead of one
      EventEmitter.emit("produceSun", {
        x: plantedPlant.coordinates.x,
        y: plantedPlant.coordinates.y,
      });
      EventEmitter.emit("produceSun", {
        x: plantedPlant.coordinates.x + CELL_WIDTH / 4,
        y: plantedPlant.coordinates.y,
      });
      this.lastSunProduction = gameTime;
    }
  }
}
