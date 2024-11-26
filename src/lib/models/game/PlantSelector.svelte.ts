import { SvelteMap } from "svelte/reactivity";
import { type PlantStats } from "../plants/Plant";
import { gameTime } from "./GameTime.svelte";

export interface HoverCell {
  x: number;
  y: number;
}

export default class PlantSelector {
  plants: PlantStats[] = $state([]);
  selectedPlant: string | null = $state(null);
  hoveredCell: HoverCell | null = $state(null);
  isShoveling: boolean = $state(false);
  cooldowns: Map<string, number> = $state(new SvelteMap());

  constructor(plants: PlantStats[]) {
    this.plants = plants;
    this.plants.forEach((plant) => {
      this.cooldowns.set(plant.id, 0);
    });
  }

  cancelAll() {
    this.selectedPlant = null;
    this.isShoveling = false;
  }

  toggleShovel() {
    this.cancelSelection();
    this.isShoveling = !this.isShoveling;
  }

  canSelectPlant(plantId: string, gameTime: number) {
    const cooldownEnd = this.cooldowns.get(plantId) || 0;
    return gameTime >= cooldownEnd;
  }

  updatePlantCooldown(plantId: string) {
    const plant = this.plants.find((p) => p.id === plantId);
    if (plant) {
      this.cooldowns.set(plantId, gameTime.get() + (plant.buyCooldown || 0));
    }
  }

  selectPlant(plantId: string) {
    if (!this.canSelectPlant(plantId, gameTime.get())) {
      return; // Plant is on cooldown
    }
    if (this.isShoveling) {
      this.toggleShovel();
    }
    if (this.selectedPlant !== plantId) {
      this.selectedPlant = plantId;
    } else {
      this.cancelSelection();
    }
  }

  hoverCell(cell: HoverCell | null) {
    this.hoveredCell = cell;
  }

  cancelSelection() {
    this.selectedPlant = null;
  }

  // Check if plant can be bought
  canBuyPlant({ totalSun, plantId }: { totalSun: number; plantId: string }) {
    const plant = this.plants.find((p) => p.id === plantId);
    if (!plant) return false;
    return plant.price <= totalSun;
  }

  // Get remaining cooldown time
  getRemainingCooldown(plantId: string) {
    const cooldownEnd = this.cooldowns.get(plantId) || 0;
    return Math.max(0, cooldownEnd - gameTime.get());
  }

  reset() {
    this.selectedPlant = null;
    this.hoveredCell = null;
    this.isShoveling = false;
    this.cooldowns = new SvelteMap();
    this.plants.forEach((plant) => {
      this.cooldowns.set(plant.id, 0);
    });
  }
}
