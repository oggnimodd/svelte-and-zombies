<script lang="ts">
  import { getPlantImage } from "../utils/getPlantImage";
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { getPlantZIndex } from "../utils/getZIndex";

  const plantImage = $derived.by(() => {
    if (!plantSelector.selectedPlant) return "";

    return getPlantImage(plantSelector.selectedPlant);
  });
</script>

<div
  style="z-index: {plantSelector.hoveredCell
    ? getPlantZIndex(plantSelector.hoveredCell.y)
    : 'auto'}"
  class="relative flex h-full w-full items-center justify-center"
>
  <img
    src={plantImage}
    alt={plantSelector.selectedPlant + "-ghost"}
    class="pointer-events-none absolute bottom-0 w-full cursor-none opacity-30"
  />
</div>
