<script lang="ts">
  import PlantCard from "$lib/components/PlantCard.svelte";
  import PlantList from "$lib/components/PlantList.svelte";
  import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
  import Yard from "$lib/components/Yard.svelte";
  import PauseModal from "$lib/components/PauseModal.svelte";
  import LoadingScreen from "$lib/components/LoadingScreen.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";
  import VictoryModal from "$lib/components/VictoryModal.svelte";

  let isPreloading = $state(false);

  const startGame = () => {
    isPreloading = false;
    soundManager.playBackgroundMusic();
    gameLoop.start();
  };
</script>

<VictoryModal />

{#if isPreloading}
  <LoadingScreen {startGame} />
{:else}
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
          isPreloading = true;
        }}
      >
        Start Game
      </button>
    {/if}
  </div>
{/if}
