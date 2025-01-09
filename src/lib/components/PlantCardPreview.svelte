<script lang="ts">
  import type { PlantStats } from "$lib/models/plants/Plant.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { getPlantImage } from "../utils/getPlantImage";
  import cn from "../utils/cn";
  import IconTrash from "@tabler/icons-svelte/icons/trash";

  type PlantCardPreviewProps = PlantStats & {
    onDelete?: () => void;
  };

  const { name, id, price, onDelete }: PlantCardPreviewProps = $props();
  const isSelected = $derived.by(() =>
    gameLoop.gameOptions.options.usablePlants.some((p) => p.id === id)
  );

  const handleClick = () => {
    gameLoop.gameOptions.togglePlantSelection(id);
  };

  let imageLoaded = $state(false);
  const handleImageLoad = () => {
    imageLoaded = true;
  };
</script>

<div class="group relative">
  {#if onDelete}
    <button
      class="absolute -right-2 -top-2 z-10 rounded-full bg-red-500 p-1 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 hover:bg-red-600"
      onclick={onDelete}
    >
      <IconTrash class="h-4 w-4 text-white" />
    </button>
  {/if}
  <button
    title={`${name}`}
    onmousedown={handleClick}
    class={cn(
      "group relative flex w-full select-none flex-col items-center justify-center overflow-hidden rounded-lg border border-black/80 bg-gradient-to-b from-[#D0F9E8] to-[#C2E2A7] py-1 text-black transition-all duration-200 ease-in-out hover:scale-105 hover:border-lime-400 hover:bg-gradient-to-b hover:from-lime-200 hover:to-lime-400 hover:shadow-lg",
      isSelected && !onDelete && "opacity-50 grayscale hover:scale-100"
    )}
  >
    <div class="relative h-10 w-10">
      {#if !imageLoaded}
        <div
          class="absolute inset-0 animate-pulse rounded-full bg-lime-200 blur-sm"
        ></div>
      {/if}
      <img
        src={getPlantImage(id)}
        alt={name}
        onload={handleImageLoad}
        class={cn(
          "pointer-events-none h-10 w-10 select-none object-contain transition-transform group-hover:scale-105",
          !imageLoaded && "opacity-0",
          imageLoaded && "opacity-100 transition-opacity duration-300"
        )}
      />
    </div>
    <div class="relative flex w-10 items-center justify-center gap-0.5 sm:w-12">
      {#if !imageLoaded}
        <div class="absolute inset-0 animate-pulse bg-lime-200 blur-sm"></div>
      {/if}
      <p
        class={cn(
          "text-xs font-bold",
          !imageLoaded && "opacity-0",
          imageLoaded && "opacity-100 transition-opacity duration-300"
        )}
      >
        {price}
      </p>
    </div>
  </button>
</div>
