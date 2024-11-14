<script lang="ts">
  import PlantCard from "./components/PlantCard.svelte";
  import PlantList from "./components/PlantList.svelte";
  import { plantSelector } from "./reactivity/plantSelector.svelte";
  import Yard from "./components/Yard.svelte";
  import PauseModal from "./components/PauseModal.svelte";
</script>

<PauseModal />

<div
  class="min-h-screen w-full flex items-center justify-center bg-black text-white overflow-hidden"
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
