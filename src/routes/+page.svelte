<script lang="ts">
  import PlantCard from "$lib/components/PlantCard.svelte";
  import PlantList from "$lib/components/PlantList.svelte";
  import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
  import Yard from "$lib/components/Yard.svelte";
  import PauseModal from "$lib/components/PauseModal.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";
</script>

<div
  class="flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white"
>
  {#if gameLoop.isRunning}
    <PauseModal />

    <div class="flex gap-x-2">
      <PlantList>
        <button onclick={() => plantSelector.toggleShovel()}>Shovel</button>
        {#each plantSelector.plants as plant}
          <PlantCard {...plant} />
        {/each}
      </PlantList>

      <Yard />
    </div>
  {:else}
    <button
      class="rounded bg-green-500 p-2 text-white"
      onclick={() => {
        // Play background music
        soundManager.playBackgroundMusic();
        gameLoop.start();
      }}
    >
      Start Game
    </button>
  {/if}
</div>
