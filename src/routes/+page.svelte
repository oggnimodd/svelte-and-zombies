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
  import LoseModal from "$lib/components/LoseModal.svelte";
  import { onMount } from "svelte";

  let isPreloading = $state(false);

  const startGame = () => {
    isPreloading = false;
    soundManager.playBackgroundMusic();
    gameLoop.start();
  };

  const numPlants = $derived.by(() => {
    return plantSelector.plants.length;
  });
</script>

<VictoryModal />
<LoseModal />

{#if isPreloading}
  <LoadingScreen {startGame} />
{:else if gameLoop.isRunning}
  <div class="h-screen w-full overflow-hidden bg-black text-white">
    <PauseModal />
    <div
      style="height:4rem;"
      class="relative z-50 flex w-full items-center gap-x-2"
    >
      <div class="mt-2 w-[90%] px-2">
        <PlantList>
          {#each plantSelector.plants as plant}
            <div style="width: {numPlants}%">
              <PlantCard {...plant} />
            </div>
          {/each}
        </PlantList>
      </div>
      <div class="flex h-full w-[10%] items-center">
        <button
          class="flex aspect-square h-10 w-10 items-center justify-center"
          onclick={() => plantSelector.toggleShovel()}
        >
          <img src="/shovel.png" alt="Shovel" class="w-full" />
        </button>
      </div>
    </div>
    <div
      style="height: calc(100% - 4rem);"
      class="flex w-full flex-col items-center justify-center"
    >
      <Yard />
    </div>
  </div>
{:else}
  <!-- TODO: add main menu screen -->
  <div
    class="flex flex min-h-screen w-full flex-col items-center justify-center bg-black text-white"
  >
    <button
      class="rounded bg-green-500 p-2 text-white"
      onclick={() => {
        isPreloading = true;
      }}
    >
      Start Game
    </button>
  </div>
{/if}
