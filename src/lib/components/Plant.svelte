<script lang="ts">
  import type { PlantedPlant } from "$lib/models/game/PlantManager.svelte";
  import type Chomper from "$lib/models/plants/Chomper.svelte";
  import type Squash from "$lib/models/plants/Squash.svelte";
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

  // Squash-specific variables
  const isJumping = $derived.by(() => {
    return (
      plantedPlant.plant.id === "squash" &&
      (plantedPlant.plant as Squash).isJumping
    );
  });

  const hasLanded = $derived(
    plantedPlant.plant.id === "squash" &&
      (plantedPlant.plant as Squash).isLanded
  );

  // Chomper-specific variables
  const isChomperFull = $derived(
    plantedPlant.plant.id === "chomper" &&
      (plantedPlant.plant as Chomper).isChewing
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
      class="{isJumping &&
      (plantedPlant.plant as Squash).jumpDirection === 'left'
        ? 'squash-jumping-left'
        : ''} 
             {isJumping &&
      (plantedPlant.plant as Squash).jumpDirection === 'right'
        ? 'squash-jumping-right'
        : ''} 
             {hasLanded ? 'squash-landed' : ''} 
             {(!isJumping || !hasLanded) && 'subtle-animation'} 
             pointer-events-none absolute bottom-0 w-full cursor-none"
    />
  {:else if plantedPlant.plant.id === "chomper"}
    <img
      src={isChomperFull
        ? getPlantImage("chomper-full")
        : getPlantImage("chomper")}
      alt={plantedPlant.plant.id}
      class="subtle-animation pointer-events-none absolute bottom-0 w-full cursor-none"
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

  @keyframes squashLand {
    0% {
      transform: scale(1.8, 0.4); /* Start flattened */
    }
    50% {
      transform: scale(
        0.3,
        2
      ); /* Overshoot upwards: stretch vertically, reduce width a lot */
    }
    100% {
      transform: scale(0, 0); /* Disappear */
    }
  }

  .squash-landed {
    animation: squashLand 0.5s ease-in forwards;
  }

  /* New Left and Right Jump Animations */
  @keyframes squashJumpLeft {
    0% {
      transform: scale(1, 1) translateY(0) translateX(0);
    }
    25% {
      transform: scale(1.2, 0.8) translateY(-40%) translateX(-10%);
    }
    50% {
      transform: scale(0.7, 1.3) translateY(-80%) translateX(-25%);
    }
    75% {
      transform: scale(1.5, 0.6) translateY(0) translateX(-40%);
    }
    100% {
      transform: scale(1, 1) translateY(0) translateX(-40%);
    }
  }

  @keyframes squashJumpRight {
    0% {
      transform: scale(1, 1) translateY(0) translateX(0);
    }
    25% {
      transform: scale(1.2, 0.8) translateY(-40%) translateX(10%);
    }
    50% {
      transform: scale(0.7, 1.3) translateY(-80%) translateX(25%);
    }
    75% {
      transform: scale(1.5, 0.6) translateY(0) translateX(40%);
    }
    100% {
      transform: scale(1, 1) translateY(0) translateX(40%);
    }
  }
  .squash-jumping-left {
    animation: squashJumpLeft 1.1s ease-in-out forwards;
  }

  .squash-jumping-right {
    animation: squashJumpRight 1.1s ease-in-out forwards;
  }
</style>
