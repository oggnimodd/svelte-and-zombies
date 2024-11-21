<script lang="ts">
  import type { PlantStats } from "$lib/models/plants/Plant";
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { getPlantImage } from "../utils/getPlantImage";

  const onSelectPlant = (plantId: string) => {
    plantSelector.selectPlant(plantId);
  };

  const { name, id, price }: PlantStats = $props();

  const handleClick = () => {
    onSelectPlant(id);
  };
</script>

<button
  onclick={handleClick}
  class="flex aspect-square w-16 flex-col items-center justify-center p-4 text-white"
>
  <img src={getPlantImage(id)} alt={name} class="w-full" />
  <p>{price}</p>
</button>
