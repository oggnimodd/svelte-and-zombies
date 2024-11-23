<script lang="ts">
  import type { PlantStats } from "$lib/models/plants/Plant";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import { getPlantImage } from "../utils/getPlantImage";

  const { name, id, price }: PlantStats = $props();

  const isSunEnough = $derived.by(() => {
    return plantSelector.canBuyPlant({
      totalSun: gameLoop.sunManager.total,
      plantId: id,
    });
  });

  const onSelectPlant = (plantId: string) => {
    // Check if we have enough sun
    if (!isSunEnough) {
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
  class={"flex aspect-square w-16 flex-col items-center justify-center p-4 text-white" +
    (isSunEnough ? "opacity-100" : " opacity-50")}
>
  <img
    src={getPlantImage(id)}
    alt={name}
    class="pointer-events-none w-full select-none"
  />
  <p>{price}</p>
</button>
