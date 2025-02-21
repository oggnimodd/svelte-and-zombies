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
  import PauseModal from "$lib/components/PauseModal.svelte";
  import {
    enterFullscreen,
    lockOrientationToLandscape,
  } from "$lib/utils/screen";
  import isMobile from "is-mobile";
  import MainMenu from "$lib/components/MainMenu.svelte";
  import cn from "$lib/utils/cn";
  import GameOptions from "$lib/components/GameOptions.svelte";
  import WaveStartedModal from "$lib/components/WaveStartedModal.svelte";

  let isPreloading = $state(false);
  let showOptions = $state(false);

  // Order of operations: click start game on the main menu -> show preloading screen -> show options screen -> start game
  const onStartGameButtonClick = () => {
    if (!soundManager.bgMusic.playing()) {
      soundManager.playBackgroundMusic();
    }
    showOptions = false;
    isPreloading = true;
  };

  const onPreloadComplete = () => {
    isPreloading = false;
    showOptions = true;
  };

  const cancelOptions = () => {
    showOptions = false;
  };

  // The actual game start trigger
  const startGame = async () => {
    if (isMobile()) {
      await enterFullscreen();
      await lockOrientationToLandscape();
    }

    showOptions = false;
    isPreloading = false;
    gameLoop.start();
  };
</script>

<VictoryModal />
<LoseModal />
<WaveStartedModal />

{#if isPreloading}
  <LoadingScreen next={onPreloadComplete} />
{:else if showOptions}
  <GameOptions cancel={cancelOptions} next={startGame} />
{:else if gameLoop.isRunning}
  <div
    class="h-screen w-full overflow-hidden bg-gradient-to-br from-green-900 to-green-700 text-white"
  >
    <PauseModal />
    <div
      style="height:5rem;"
      class="relative z-50 flex w-full items-center gap-x-2"
    >
      <SunCounter totalSun={gameLoop.sunManager.totalSun} />
      <div
        class="w-fit max-w-[90%] overflow-x-auto rounded-lg border-2 border-black/60 bg-[#94451C] py-2 scrollbar-thin scrollbar-track-[#94451C] scrollbar-thumb-white/60"
      >
        <PlantList>
          {#each gameLoop.gameOptions.options.usablePlants as plant}
            <div class="first:pl-2 last:pr-2">
              <PlantCard {...plant} />
            </div>
          {/each}
        </PlantList>
      </div>
      <!-- Shovel button -->
      <div style="height:5rem;" class="flex h-full w-[10%] items-center">
        <button
          class={cn(
            "flex aspect-square h-[80%] items-center justify-center rounded-lg border-2 border-transparent bg-lime-300/10 p-2 shadow-lg transition-all duration-200 ease-in-out",
            plantSelector.isShoveling &&
              "scale-105 border-lime-400 bg-lime-300/60"
          )}
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
  <MainMenu next={onStartGameButtonClick} />
{/if}
