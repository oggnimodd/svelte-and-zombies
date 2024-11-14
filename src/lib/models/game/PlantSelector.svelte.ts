// Track the selected plant from the plant list
// Track which cell is being hovered over

import Plant from "../plants/Plant";

export interface HoverCell {
  x: number;
  y: number;
}

export default class PlantSelector {
  plants: Plant[] = $state([]);
  selectedPlant: string | null = $state(null);
  hoveredCell: HoverCell | null = $state(null);
  isShoveling: boolean = $state(false);

  constructor(plants: Plant[]) {
    this.plants = plants;
  }

  toggleShovel() {
    // Cancel selection if any
    this.cancelSelection();

    this.isShoveling = !this.isShoveling;
  }

  selectPlant(plantId: string) {
    // Cancel shoveling if any
    if (this.isShoveling) {
      this.toggleShovel();
    }

    // If we're selecting a different plant than the currently selected one,
    // switch to the new plant instead of canceling
    if (this.selectedPlant !== plantId) {
      this.selectedPlant = plantId;
    } else {
      // Only cancel if clicking the same plant again
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
