<script lang="ts">
  import PlantCard from "$lib/components/PlantCard.svelte";
  import PlantList from "$lib/components/PlantList.svelte";
  import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
  import Yard from "$lib/components/Yard.svelte";
  import LoadingScreen from "$lib/components/LoadingScreen.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";
  import VictoryModal from "$lib/components/VictoryModal.svelte";
  import LoseModal from "$lib/components/LoseModal.svelte";
  import SunCounter from "$lib/components/SunCounter.svelte";

  let isPreloading = $state(false);

  const startGame = () => {
    isPreloading = false;
    soundManager.playBackgroundMusic();
    gameLoop.start();
  };
</script>

<VictoryModal />
<LoseModal />

{#if isPreloading}
  <LoadingScreen {startGame} />
{:else if gameLoop.isRunning}
  <div class="background h-screen w-full overflow-hidden text-white">
    <PauseModal />
    <div
      style="height:5rem;"
      class="relative z-50 flex w-full items-center gap-x-2"
    >
      <SunCounter totalSun={gameLoop.sunManager.totalSun} />
      <div
        class="w-fit max-w-[90%] overflow-x-auto rounded-lg border-2 border-black/60 bg-[#94451C] py-2"
      >
        <PlantList>
          {#each plantSelector.plants as plant}
            <div class="first:pl-2 last:pr-2">
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
      style="height: calc(100% - 5rem);"
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

<style>
  .background {
    background-color: #141d0a;
  }
</style>
