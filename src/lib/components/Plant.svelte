<script lang="ts">
  import type { PlantedPlant } from "$lib/models/game/PlantManager.svelte";
  import type Squash from "$lib/models/plants/Squash";
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

  // TODO: fix animation not working
  const isJumping = $derived(
    plantedPlant.plant.id === "squash" &&
      (plantedPlant.plant as Squash).isJumping
  );

  // TODO: fix animation not working
  const hasLanded = $derived(
    plantedPlant.plant.id === "squash" &&
      (plantedPlant.plant as Squash).isLanded
  );
</script>

<div
  class="relative flex h-full w-full items-center justify-center"
  style="z-index: {getPlantZIndex(plantedPlant.cell.row)}"
>
  {#if plantedPlant.plant.id === "chilli" || plantedPlant.plant.id === "cherry"}
    <img
      src={getPlantImage(plantedPlant.plant.id)}
      alt={plantedPlant.plant.name}
      class="inflating pointer-events-none absolute bottom-0 w-full cursor-none"
    />
  {:else if plantedPlant.plant.id === "squash"}
    <img
      src={plantImage}
      alt={plantedPlant.plant.id}
      class="{isJumping ? 'squash-jumping' : ''} 
               {hasLanded ? 'squash-landed' : ''} 
               subtle-animation pointer-events-none absolute bottom-0 w-full cursor-none"
    />
  {:else}
    <img
      src={plantImage}
      alt={plantedPlant.plant.id}
      class="subtle-animation pointer-events-none absolute bottom-0 w-full cursor-none"
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

  @keyframes squashJump {
    0% {
      transform: scale(1) translateY(0);
    }
    50% {
      transform: scale(0.8) translateY(-40px);
    }
    100% {
      transform: scale(1.2) translateY(0);
    }
  }

  @keyframes squashLand {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(0);
    }
  }

  .squash-jumping {
    animation: squashJump 1s ease-in-out;
  }

  .squash-landed {
    animation: squashLand 0.5s ease-in forwards;
  }
</style>
