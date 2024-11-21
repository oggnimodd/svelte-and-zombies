<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount, onDestroy } from "svelte";
  import { gameLoop } from "../reactivity/gameLoop.svelte";

  let isVisible = $state(false);

  const handleVisibilityChange = () => {
    if (document.hidden && gameLoop.isRunning) {
      isVisible = true;
      gameLoop.pause();
    }
  };

  const handleBlur = () => {
    if (document.hasFocus() && gameLoop.isRunning) {
      isVisible = true;
      gameLoop.pause();
    }
  };

  const handlePageHide = () => {
    if (gameLoop.isRunning) {
      isVisible = true;
      gameLoop.pause();
    }
  };

  const resumeGame = () => {
    isVisible = false;
    gameLoop.resume();
  };

  const exitGame = () => {
    console.log(
      "Exit game clicked - would navigate to main menu in the future"
    );
  };

  onMount(() => {
    if (browser) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);
      window.addEventListener("pagehide", handlePageHide);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("pagehide", handlePageHide);
    }
  });
</script>

{#if isVisible && gameLoop.isRunning}
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="transform rounded-lg border-2 border-green-600 bg-gradient-to-br from-green-800 to-green-900 p-8 shadow-xl transition-all"
    >
      <h2 class="mb-6 text-center text-3xl font-bold text-green-100">
        Game Paused
      </h2>
      <div class="flex flex-col gap-4">
        <button
          onclick={resumeGame}
          class="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-green-500 hover:shadow-lg"
        >
          Resume Game
        </button>
        <button
          onclick={exitGame}
          class="rounded-lg bg-red-600 px-8 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-red-500 hover:shadow-lg"
        >
          Exit to Main Menu
        </button>
      </div>
    </div>
  </div>
{/if}
