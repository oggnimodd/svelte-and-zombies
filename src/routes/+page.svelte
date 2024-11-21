<script lang="ts">
  import PlantCard from "$lib/components/PlantCard.svelte";
  import PlantList from "$lib/components/PlantList.svelte";
  import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
  import Yard from "$lib/components/Yard.svelte";
  import PauseModal from "$lib/components/PauseModal.svelte";
</script>

<PauseModal />

<div
  class="flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white"
>
  <div class="flex gap-x-2">
    <PlantList>
      <button onclick={() => plantSelector.toggleShovel()}>Shovel</button>
      {#each plantSelector.plants as plant}
        <PlantCard {...plant} />
      {/each}
    </PlantList>

    <Yard />
  </div>
</div>
