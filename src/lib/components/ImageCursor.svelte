<!-- Display plant image following the cursor on plant selection -->

<script lang="ts">
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { getPlantImage } from "../utils/getPlantImage";
  import { browser } from "$app/environment";
  import { onMount, onDestroy } from "svelte";
  import { CELL_WIDTH } from "$lib/constants/sizes";

  let plantImage = $derived.by(() => {
    if (!plantSelector.selectedPlant) return "";
    return getPlantImage(plantSelector.selectedPlant);
  });

  let x = $state(0);
  let y = $state(0);

  let isVisible = $derived(
    plantSelector.selectedPlant !== null || plantSelector.isShoveling
  );

  const handleMouseMove = (event: MouseEvent) => {
    x = event.clientX;
    y = event.clientY;
  };

  onMount(() => {
    if (browser) {
      window.addEventListener("mousemove", handleMouseMove);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });
</script>

{#if isVisible}
  <div
    style="left: {x - CELL_WIDTH / 2}px;top: {y -
      CELL_WIDTH / 2}px;width: {CELL_WIDTH}px;"
    class="pointer-events-none fixed z-[1000]"
  >
    {#if plantSelector.isShoveling}
      <img
        src="/shovel.png"
        alt="Shovel"
        class="pointer-events-none w-full cursor-none"
      />
    {:else}
      <img
        src={plantImage}
        alt={plantSelector.selectedPlant + "-ghost"}
        class="pointer-events-none w-full cursor-none"
      />
    {/if}
  </div>
{/if}
