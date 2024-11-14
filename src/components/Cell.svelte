<script lang="ts">
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { plantManager } from "../reactivity/plantManager.svelte";
  import type { PlantedPlant } from "../lib/models/game/PlantManager.svelte";
  import Plant from "./Plant.svelte";
  import GhostPlant from "./GhostPlant.svelte";

  interface CellProps {
    width: number;
    height: number;
    x: number;
    y: number;
  }

  const { width, height, x, y }: CellProps = $props();

  let plantedPlantAtThisCell: PlantedPlant | null = $state(null);

  const onHover = () => {
    plantSelector.hoverCell({
      x,
      y,
    });
  };

  // On focus do nothing
  const onFocus = () => {};

  // Check if the current cell is hovered over
  const isHoveredOver = $derived(
    plantSelector.hoveredCell?.x === x && plantSelector.hoveredCell?.y === y
  );

  // Handle apply plant
  const onClick = () => {
    // Handling removing a plant
    if (plantSelector.isShoveling && plantedPlantAtThisCell) {
      plantManager.remove(plantedPlantAtThisCell.plantedId);
      plantedPlantAtThisCell = null;
      return;
    }

    // Check if hovered over a plant
    if (!isHoveredOver || !plantSelector.selectedPlant) {
      return;
    }

    // First find the plant
    const plant = plantSelector.plants.find(
      (plant) => plant.id === plantSelector.selectedPlant
    );

    // If we can't find the plant, we need to cancel the selection
    if (!plant) {
      return;
    }

    // Only plant if there is no plant in the same cell
    if (!plantedPlantAtThisCell) {
      const plantedPlant = plantManager.plant(plant, {
        row: y,
        col: x,
      });

      plantedPlantAtThisCell = plantedPlant;
    }
  };

  // Watch if the plant has been eaten by zombies, the negation of isPlantStillThere
  const isPlantEaten = $derived(
    plantManager.plantedPlants.find(
      (plantedPlant) =>
        plantedPlant.plantedId === plantedPlantAtThisCell?.plantedId
    ) === undefined
  );

  // Watch isplant eaten and assign plantedPlantAtThisCell to null
  $effect(() => {
    if (isPlantEaten) {
      plantedPlantAtThisCell = null;
    }
  });

  // Generate a random boolean value for background class
  const isDarkBackground = (x + y) % 2 === 0;
</script>

<button
  onfocus={onFocus}
  onclick={onClick}
  onmouseover={onHover}
  id="cell-{y}-{x}"
  style="width: {width}px; height: {height}px;"
  class={"bg-green-500 flex items-center justify-center flex-col select-none" +
    (isDarkBackground ? " dark-bg" : " light-bg")}
>
  <!-- If shoveling and there is a plant planted -->
  {#if plantSelector.isShoveling && plantedPlantAtThisCell && isHoveredOver}
    <div class="bg-red-500 text-white">Remove</div>
  {/if}

  <!-- If hovered and there is no plant planted -->
  {#if isHoveredOver && !plantedPlantAtThisCell && plantSelector.selectedPlant}
    <div
      class="text-white text-sm flex items-center justify-center w-full h-full"
    >
      <GhostPlant />
    </div>
  {/if}

  <!-- If planted -->
  {#if plantedPlantAtThisCell}
    <div
      class="text-white text-sm flex items-center justify-center w-full h-full"
    >
      <Plant plantedPlant={plantedPlantAtThisCell} />

      <!-- Coordinates -->
      <!-- {plantedPlantAtThisCell.coordinates.x.toFixed(
        2
      )},{plantedPlantAtThisCell.coordinates.y.toFixed(2)} -->
    </div>
  {/if}
</button>

<style>
  .dark-bg {
    background-color: #62803b;
  }

  .light-bg {
    background-color: #7b9345;
  }
</style>
