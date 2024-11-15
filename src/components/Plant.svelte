<script lang="ts">
  import type { PlantedPlant } from "../lib/models/game/PlantManager.svelte";
  import { getPlantImage } from "../utils/getPlantImage";
  import { getPlantZIndex } from "../utils/getZIndex";

  interface PlantProps {
    plantedPlant: PlantedPlant;
  }

  const { plantedPlant }: PlantProps = $props();

  const healthPercentage = $derived(
    (plantedPlant.currentHealth / plantedPlant.plant.health) * 100
  );
  const isUnderAttack = $derived(healthPercentage < 100);

  const plantImage = $derived.by(() => {
    return getPlantImage(plantedPlant.plant.id);
  });
</script>

<div
  class="w-full h-full relative flex items-center justify-center"
  style="z-index: {getPlantZIndex(plantedPlant.cell.row)}"
>
  {#if plantedPlant.plant.id === "chilli"}
    <img
      src={getPlantImage(plantedPlant.plant.id)}
      alt={plantedPlant.plant.name}
      class="inflating w-full pointer-events-none cursor-none absolute bottom-0"
    />
  {:else}
    <img
      src={plantImage}
      alt={plantedPlant.plant.id}
      class="subtle-animation w-full pointer-events-none cursor-none absolute bottom-0"
    />
  {/if}
</div>

<style>
  /* Smooth, subtle bounce effect */
  @keyframes subtleBounce {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-2px) scale(1.02); /* small upward movement and slight scale */
    }
  }

  .subtle-animation {
    animation: subtleBounce 2s ease-in-out infinite;
  }

  .inflating {
    animation: inflate 1s ease-in-out infinite;
  }

  @keyframes inflate {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(2);
    }
  }
</style>
