import BasePlant, { type PlantStats } from "./Plant";
import EventEmitter from "../EventEmitter";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import { gameTime } from "../game/GameTime.svelte";

export const SunflowerStats: PlantStats = {
  id: "sunflower",
  name: "Sunflower",
  price: 50,
  health: 50,
};

export default class Sunflower extends BasePlant {
  private lastSunProduction = 0;
  private readonly productionInterval = 8000;

  constructor() {
    super(SunflowerStats);
    this.lastSunProduction = gameTime.get();
  }

  update(plantedPlant: PlantedPlant, gameTime: number) {
    if (gameTime - this.lastSunProduction >= this.productionInterval) {
      EventEmitter.emit("produceSun", {
        x: plantedPlant.coordinates.x,
        y: plantedPlant.coordinates.y,
      });
      this.lastSunProduction = gameTime;
    }
  }
}
