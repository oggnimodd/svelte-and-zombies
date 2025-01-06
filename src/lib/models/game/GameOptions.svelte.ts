import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
import type { PlantStats } from "../plants/Plant.svelte";
import { soundManager } from "./SoundManager.svelte";

export interface GameOptions {
  usablePlants: PlantStats[];
  initialSunAmount: number;
  useLawnMowers: boolean;
}

const initialGameOptions: GameOptions = {
  usablePlants: [],
  initialSunAmount: 500,
  useLawnMowers: true,
};

export class GameOptionsManager {
  public static readonly MIN_PLANTS = 2;
  public static readonly MIN_SUN = 50;
  public static readonly MAX_SUN = 99999;

  options: GameOptions = $state(initialGameOptions);

  validatePlantSelection(): boolean {
    return (
      this.options.usablePlants.length >= GameOptionsManager.MIN_PLANTS &&
      this.options.usablePlants.length <= plantSelector.plants.length
    );
  }

  validateSunAmount(amount: number) {
    return (
      amount >= GameOptionsManager.MIN_SUN &&
      amount <= GameOptionsManager.MAX_SUN &&
      Number.isInteger(amount)
    );
  }

  togglePlantSelection(id: string) {
    const plant = plantSelector.plants.find((p) => p.id === id);

    if (!plant) return;

    const index = this.options.usablePlants.findIndex((p) => p.id === plant.id);
    if (index === -1) {
      this.options.usablePlants = [...this.options.usablePlants, plant];
      soundManager.playSound("dig");
    } else {
      this.options.usablePlants = this.options.usablePlants.filter(
        (p) => p.id !== plant.id
      );
      soundManager.playSound("shovel");
    }
  }

  selectAllPlants() {
    this.options = {
      ...this.options,
      usablePlants: plantSelector.plants,
    };
  }

  deselectAllPlants() {
    this.options = {
      ...this.options,
      usablePlants: [],
    };
  }

  setInitialSunAmount(amount: number) {
    if (this.validateSunAmount(amount)) {
      this.options.initialSunAmount = amount;
    }
  }

  toggleLawnMowers() {
    this.options.useLawnMowers = !this.options.useLawnMowers;
  }

  isPlantSelected(plantId: string): boolean {
    return this.options.usablePlants.some((p) => p.id === plantId);
  }

  reset() {
    this.options = initialGameOptions;
  }
}
