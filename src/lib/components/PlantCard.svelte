<script lang="ts">
  import type { PlantStats } from "$lib/models/plants/Plant.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { getPlantImage } from "../utils/getPlantImage";

  const { name, id, price, buyCooldown }: PlantStats = $props();

  const isSunEnough = $derived.by(() => {
    return plantSelector.canBuyPlant({
      totalSun: gameLoop.sunManager.total,
      plantId: id,
    });
  });

  // Add cooldown state
  const remainingCooldown = $derived.by(() => {
    return plantSelector.getRemainingCooldown(id);
  });

  const cooldownPercentage = $derived.by(() => {
    if (!buyCooldown) return 0;

    return 100 - (remainingCooldown / buyCooldown) * 100;
  });

  const isOnCooldown = $derived.by(() => remainingCooldown > 0);

  const onSelectPlant = (plantId: string) => {
    // Check if we have enough sun and plant is not on cooldown
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
  class="group relative flex w-full select-none flex-col items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 p-1 text-white"
  class:opacity-50={!isSunEnough}
  class:grayscale={isOnCooldown}
>
  {#if isOnCooldown}
    <div
      class="absolute inset-0 z-10 flex items-center justify-center rounded-lg"
    >
      <div class="absolute inset-0 rounded-lg bg-black bg-opacity-50"></div>
      <div
        class="absolute bottom-0 left-0 right-0 h-1 rounded-b bg-green-500 transition-all duration-300 ease-linear"
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
  <div class="flex items-center">
    <img src="/sun.png" alt="sun" class="h-2 w-2" />
    <p class="text-xs font-bold">{price}</p>
  </div>
</button>
