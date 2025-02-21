<script lang="ts">
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { plantManager } from "../reactivity/plantManager.svelte";
  import type { PlantedPlant } from "$lib/models/game/PlantManager.svelte";
  import Plant from "./Plant.svelte";
  import GhostPlant from "./GhostPlant.svelte";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";

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

  const onLeave = () => {
    plantSelector.hoverCell(null);
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
      // Add the sun back
      gameLoop.sunManager.addSun(plantedPlantAtThisCell.plant.price);

      plantManager.remove(plantedPlantAtThisCell.plantedId);
      plantedPlantAtThisCell = null;

      soundManager.playSound("shovel");
      plantSelector.cancelAll();

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

      // Cancel the plant selector after planting
      plantSelector.cancelAll();

      plantedPlantAtThisCell = plantedPlant;

      // Reduce the sun
      gameLoop.sunManager.subtractSun(plant.price);

      // Update the plant cooldown
      plantSelector.updatePlantCooldown(plant.id);
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
  onmouseleave={onLeave}
  id="cell-{y}-{x}"
  style="width: {width}px; height: {height}px;"
  tabindex="-1"
  class={"flex select-none flex-col items-center justify-center bg-green-500" +
    (isDarkBackground ? " dark-bg" : " light-bg")}
>
  <!-- If shoveling and there is a plant planted -->
  {#if plantSelector.isShoveling && plantedPlantAtThisCell && isHoveredOver}
    <div
      class="relative z-[2000] flex h-full w-full items-center justify-center"
    >
      <img src="/shovel.png" alt="Shovel" class="w-full opacity-50" />
    </div>
  {/if}

  <!-- If hovered and there is no plant planted -->
  {#if isHoveredOver && !plantedPlantAtThisCell && plantSelector.selectedPlant}
    <div
      class="flex h-full w-full items-center justify-center text-sm text-white"
    >
      <GhostPlant />
    </div>
  {/if}

  <!-- If planted -->
  {#if plantedPlantAtThisCell}
    <div
      class="flex h-full w-full items-center justify-center text-sm text-white"
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
    @apply bg-[#479042];
  }

  .light-bg {
    @apply bg-[#7ABD52];
  }
</style>
