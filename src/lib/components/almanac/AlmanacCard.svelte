<script lang="ts">
  import type { PlantStats } from "$lib/models/plants/Plant.svelte";
  import { getPlantImage } from "$lib/utils/getPlantImage";

  interface AlmanacCardProps {
    plant: PlantStats;
  }

  const { plant }: AlmanacCardProps = $props();
</script>

<div class="flex flex-col items-center rounded-lg bg-gray-700 p-4 shadow-lg">
  <img
    src={getPlantImage(plant.id)}
    alt={plant.name}
    class="mb-4 h-32 w-32 object-contain"
  />
  <h2 class="mb-2 text-xl font-bold">{plant.name}</h2>
  <p class="mb-2 text-sm text-gray-300">Health: {plant.health}</p>
  <p class="mb-2 flex items-center gap-x-2 text-sm text-gray-300">
    Price: {plant.price} <img src="/sun.png" alt="Sun" class="h-6 w-6" />
  </p>

  <!-- TODO: add description -->
</div>
