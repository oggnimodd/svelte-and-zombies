<script lang="ts">
  import type BasePlant from "../lib/models/plants/Plant";
  import { plantSelector } from "../reactivity/plantSelector.svelte";

  const onSelectPlant = (plantId: string) => {
    plantSelector.selectPlant(plantId);
  };

  const { name, id, price }: BasePlant = $props();

  const handleClick = () => {
    onSelectPlant(id);
  };
</script>

<button
  onclick={handleClick}
  class="flex w-12 flex-col gap-y-2 bg-blue-500 p-4 text-white aspect-square items-center justify-center"
>
  <p>{name}</p>
  <p>{price}</p>
</button>
