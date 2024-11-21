// Track the selected plant from the plant list
// Track which cell is being hovered over

import { type PlantStats } from "../plants/Plant";

export interface HoverCell {
  x: number;
  y: number;
}

export default class PlantSelector {
  plants: PlantStats[] = $state([]);
  selectedPlant: string | null = $state(null);
  hoveredCell: HoverCell | null = $state(null);
  isShoveling: boolean = $state(false);

  constructor(plants: PlantStats[]) {
    this.plants = plants;
  }

  cancelAll() {
    this.selectedPlant = null;
    this.isShoveling = false;
  }

  toggleShovel() {
    this.cancelSelection();
    this.isShoveling = !this.isShoveling;
  }

  selectPlant(plantId: string) {
    if (this.isShoveling) {
      this.toggleShovel();
    }

    if (this.selectedPlant !== plantId) {
      this.selectedPlant = plantId;
    } else {
      this.cancelSelection();
    }
  }

  hoverCell(cell: HoverCell) {
    this.hoveredCell = cell;
  }

  cancelSelection() {
    this.selectedPlant = null;
  }
}
