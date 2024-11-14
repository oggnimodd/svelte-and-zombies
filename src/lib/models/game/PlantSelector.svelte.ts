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
    // Add event listener for escape key
    window.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.cancelAll();
    }
  }

  private cancelAll() {
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

  destroy() {
    window.removeEventListener("keydown", this.handleKeyPress.bind(this));
  }
}
