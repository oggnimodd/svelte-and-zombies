<script lang="ts">
  import type { PlantStats } from "$lib/models/plants/Plant.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { getPlantImage } from "../utils/getPlantImage";
  import cn from "../utils/cn";

  const { name, id, price, buyCooldown }: PlantStats = $props();

  const isSunEnough = $derived.by(() => {
    return plantSelector.canBuyPlant({
      totalSun: gameLoop.sunManager.total,
      plantId: id,
    });
  });

  const remainingCooldown = $derived.by(() => {
    return plantSelector.getRemainingCooldown(id);
  });

  const cooldownPercentage = $derived.by(() => {
    if (!buyCooldown) return 0;
    return 100 - (remainingCooldown / buyCooldown) * 100;
  });

  const isOnCooldown = $derived.by(() => remainingCooldown > 0);

  const isSelected = $derived.by(() => plantSelector.selectedPlant === id);

  const onSelectPlant = (plantId: string) => {
    if (!isSunEnough || isOnCooldown) {
      return;
    }
    plantSelector.selectPlant(plantId);
  };

  const handleClick = () => {
    onSelectPlant(id);
  };
</script>

<button
  onmousedown={handleClick}
  class={cn(
    "group relative flex w-full select-none flex-col items-center justify-center overflow-hidden rounded-lg border border-black/80 bg-gradient-to-b from-[#D0F9E8] to-[#C2E2A7] py-1 text-black transition-all duration-200 ease-in-out",
    !isSunEnough && "opacity-50",
    isOnCooldown && "grayscale",
    isSelected &&
      "scale-105 border-lime-400 bg-gradient-to-b from-lime-200 to-lime-400 shadow-lg"
  )}
>
  {#if isOnCooldown}
    <div
      class="absolute inset-0 z-10 flex items-center justify-center rounded-lg"
    >
      <div class="absolute inset-0 bg-black/60"></div>
      <div
        class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transition-all duration-300 ease-linear"
        style="width: {cooldownPercentage}%"
      ></div>
      <span class="absolute z-20 text-lg font-bold text-white">
        {Math.ceil(remainingCooldown / 1000)}
      </span>
    </div>
  {/if}
  <img
    src={getPlantImage(id)}
    alt={name}
    class="pointer-events-none h-10 w-10 select-none object-contain transition-transform group-hover:scale-105"
  />
  <div class="flex w-10 items-center justify-center gap-0.5 sm:w-12">
    <p class="text-xs font-bold">{price}</p>
  </div>
</button>
