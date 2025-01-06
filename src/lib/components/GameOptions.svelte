<script lang="ts">
  import PlantList from "$lib/components/PlantList.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";
  import { GameOptionsManager } from "$lib/models/game/GameOptions.svelte";
  import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
  import PlantCardPreview from "./PlantCardPreview.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import { onMount } from "svelte";
  import IconBook from "@tabler/icons-svelte/icons/book-2";

  export interface GameOptionsProps {
    startGame: () => void;
    cancelGame: () => void;
  }

  const { startGame, cancelGame }: GameOptionsProps = $props();

  let sunAmountInput = $state(gameLoop.gameOptions.options.initialSunAmount);
  let errorMessage = $state("");

  function handleSunAmountChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    if (gameLoop.gameOptions.validateSunAmount(value)) {
      // For the ui
      gameLoop.gameOptions.setInitialSunAmount(value);

      // For the actual game
      gameLoop.sunManager.setTotalSun(value);

      errorMessage = "";
    } else {
      errorMessage = `Sun amount must be between ${GameOptionsManager.MIN_SUN} and ${GameOptionsManager.MAX_SUN}`;
    }
  }

  function handleStart() {
    if (!gameLoop.gameOptions.validatePlantSelection()) {
      errorMessage = `Please select at least ${GameOptionsManager.MIN_PLANTS} plants`;
      return;
    }
    // Start game logic here
    startGame();
  }

  const handleLawnMowersChange = (useLawnMowers: boolean) => {
    // For the ui
    gameLoop.gameOptions.toggleLawnMowers();

    // For the actual game logic
    if (useLawnMowers) {
      // If user wants to use lawnmowers, initialize the lawn mowers
      gameLoop.lawnMowerManager.reset();
    } else {
      // If user doesn't want to use lawnmowers, clear the lawn mowers
      gameLoop.lawnMowerManager.clearLawnMowers();
    }
  };

  onMount(() => {
    // Auto sync game options with the sun manager
    gameLoop.sunManager.setTotalSun(
      gameLoop.gameOptions.options.initialSunAmount
    );

    // Auto clear the options on the very first render to clean up previous state
    gameLoop.gameOptions.reset();
  });
</script>

<div
  class="flex w-full flex-col items-center justify-center bg-gradient-to-br from-green-900 to-green-700 px-4 py-10"
>
  <div
    class="w-full max-w-3xl rounded-lg bg-[#94451C]/90 p-6 shadow-2xl backdrop-blur-sm"
  >
    <!-- Header with Almanac and Back to Menu buttons -->
    <div class="mb-6 flex items-center justify-between">
      <h1
        class="text-center text-3xl font-bold text-lime-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
      >
        Game Options
      </h1>
      <button
        onclick={() => cancelGame()}
        class="group flex transform items-center gap-2 rounded-lg border-2 border-lime-400/30 bg-lime-400/10 px-4 py-2 text-lime-400 transition-all hover:border-lime-400/50 hover:bg-lime-400/20 hover:shadow-lg hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
      >
        <IconBook class="h-6 w-6" />
        <span class="font-bold">Main Menu</span>
      </button>
    </div>

    <!-- Selected Plants Preview -->
    <div class="mb-6">
      <h2 class="mb-2 text-xl font-semibold text-white">
        Selected Plants ({gameLoop.gameOptions.options.usablePlants.length})
      </h2>
      <div
        class="w-full overflow-x-auto rounded-lg border-2 border-black/60 bg-[#94451C] px-3 py-2 scrollbar-thin scrollbar-track-[#94451C] scrollbar-thumb-white/60"
      >
        <PlantList mode="preview">
          {#each gameLoop.gameOptions.options.usablePlants as plant}
            <PlantCardPreview
              {...plant}
              onDelete={() =>
                gameLoop.gameOptions.togglePlantSelection(plant.id)}
            />
          {/each}
        </PlantList>
      </div>
      <div class="mt-2 flex justify-end">
        <button
          onclick={() => gameLoop.gameOptions.deselectAllPlants()}
          class="rounded-lg bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-600"
        >
          Deselect All
        </button>
      </div>
    </div>

    <!-- Available Plants -->
    <div class="mb-6">
      <h2 class="mb-2 text-xl font-semibold text-white">
        All Plants ({plantSelector.plants.length})
      </h2>
      <div
        class="w-full overflow-x-auto rounded-lg border-2 border-black/60 bg-[#94451C] py-2"
      >
        <PlantList mode="options">
          {#each plantSelector.plants as plant}
            <PlantCardPreview {...plant} />
          {/each}
        </PlantList>
      </div>
      <div class="mt-2 flex justify-end">
        <button
          onclick={() => gameLoop.gameOptions.selectAllPlants()}
          class="rounded-lg bg-lime-500 px-4 py-2 text-white transition-all hover:bg-lime-600"
        >
          Select All
        </button>
      </div>
    </div>

    <!-- Sun Amount Input -->
    <div class="mb-6">
      <label class="block text-white">
        <span class="mb-1 block text-lg font-medium">Initial Sun Amount:</span>
        <input
          type="number"
          bind:value={sunAmountInput}
          oninput={handleSunAmountChange}
          min={GameOptionsManager.MIN_SUN}
          max={GameOptionsManager.MAX_SUN}
          class="w-full rounded-lg border-2 border-black/60 bg-[#94451C]/80 px-4 py-2 text-white placeholder-white/60 focus:border-lime-400 focus:outline-none"
        />
      </label>
    </div>

    <!-- Lawnmower Toggle -->
    <div class="mb-2">
      <Checkbox
        label="Use Lawnmowers"
        checked={gameLoop.gameOptions.options.useLawnMowers}
        onChange={handleLawnMowersChange}
      />
    </div>

    {#if errorMessage}
      <div
        class="mb-4 rounded-lg border border-red-600 bg-red-500/20 p-3 text-center text-red-200"
      >
        {errorMessage}
      </div>
    {/if}

    <button
      onclick={handleStart}
      disabled={!gameLoop.gameOptions.validatePlantSelection()}
      class="w-full rounded-lg bg-lime-500 py-3 text-lg font-bold text-white transition-all hover:bg-lime-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Start Game
    </button>
  </div>
</div>
