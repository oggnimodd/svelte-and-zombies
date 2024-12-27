<script lang="ts">
  import type { PlantStats } from "$lib/models/plants/Plant.svelte";
  import { getPlantImage } from "$lib/utils/getPlantImage";

  interface AlmanacCardProps {
    plant: PlantStats;
  }

  const { plant }: AlmanacCardProps = $props();
</script>

<div
  class="group relative transform rounded-xl border-2 border-lime-400/30 bg-gradient-to-br from-green-800/90 to-green-700/90 p-6
backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-lime-400/20"
>
  <!-- Image Container -->
  <div class="relative mb-4 flex justify-center">
    <div class="absolute inset-0 rounded-full bg-lime-400/10 blur-xl"></div>
    <img
      src={getPlantImage(plant.id)}
      alt={plant.name}
      class="relative h-32 w-32 object-contain"
    />
  </div>

  <!-- Plant Info -->
  <h2 class="mb-4 text-center text-2xl font-bold text-lime-400 drop-shadow-lg">
    {plant.name}
  </h2>

  <!-- Stats -->
  <div class="space-y-4">
    <!-- Health Bar -->
    <div class="rounded-lg border border-lime-400/20 bg-black/20 p-3">
      <span class="mb-1 block text-sm text-lime-400">Health</span>
      <div class="flex items-center gap-2 font-bold text-yellow-400">
        {plant.health}
      </div>
    </div>

    <!-- Sun Cost -->
    <div class="rounded-lg border border-lime-400/20 bg-black/20 p-3">
      <span class="mb-1 block text-sm text-lime-400">Sun Cost</span>
      <div class="flex items-center gap-2 font-bold text-yellow-400">
        {plant.price}
        <img
          src="/sun.png"
          alt="Sun"
          class="h-6 w-6 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
        />
      </div>
    </div>

    <!-- Damage (if the plant can shoot) -->
    {#if plant.damage}
      <div class="rounded-lg border border-lime-400/20 bg-black/20 p-3">
        <span class="mb-1 block text-sm text-lime-400">Damage</span>
        <div class="flex items-center gap-2 font-bold text-yellow-400">
          {plant.damage}
        </div>
      </div>
    {/if}
  </div>
</div>
