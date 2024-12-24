<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount, onDestroy } from "svelte";
  import { gameLoop } from "../reactivity/gameLoop.svelte";
  let isVisible = $state(false);
  let isBlurred = $state(false); // Track blur state

  const handleVisibilityChange = () => {
    if (document.hidden && gameLoop.isRunning) {
      isVisible = true;
      isBlurred = true; // Mark as blurred when becoming hidden
      gameLoop.pause();
    } else if (!document.hidden && isBlurred) {
      // If visibility is restored and we were previously blurred, treat it as a focus
      isBlurred = false; // Reset blurred state
    }
  };

  const handleBlur = () => {
    if (gameLoop.isRunning) {
      isVisible = true;
      isBlurred = true;
      gameLoop.pause();
    }
  };

  const handleFocus = () => {
    // When regaining focus, check if the pause overlay is visible
    if (isVisible) {
      isBlurred = false;
    }
  };

  const handlePageHide = () => {
    if (gameLoop.isRunning) {
      isVisible = true;
      isBlurred = true; // Page is hiding, consider it blurred
      gameLoop.pause();
    }
  };

  const resumeGame = () => {
    isVisible = false;
    isBlurred = false;
    gameLoop.resume();
  };

  const exitGame = () => {
    gameLoop.stop();
  };

  onMount(() => {
    if (browser) {
      window.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);
      window.addEventListener("focus", handleFocus);
      window.addEventListener("pagehide", handlePageHide);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pagehide", handlePageHide);
    }
  });
</script>

{#if isVisible && gameLoop.isRunning}
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="relative max-w-lg transform rounded-lg border-2 border-lime-400/30 bg-gradient-to-br from-green-900/90 to-green-700/90 p-8 shadow-xl backdrop-blur-sm transition-all"
    >
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <!-- Decorative Background Elements -->
        <div
          class="absolute -left-16 -top-16 h-32 w-32 rotate-45 rounded-full bg-lime-400/10 blur-3xl"
        ></div>
        <div
          class="absolute -bottom-16 -right-16 h-32 w-32 rotate-45 rounded-full bg-lime-400/10 blur-3xl"
        ></div>
      </div>
      <h2 class="mb-6 text-center text-3xl font-bold text-lime-400">
        🌱 Game Paused 🌱
      </h2>
      <div class="flex flex-col gap-4">
        <button
          onclick={resumeGame}
          class="transform rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-8 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0 active:shadow-md"
        >
          Resume Game
        </button>
        <button
          onclick={exitGame}
          class="transform rounded-lg border-2 border-red-600 bg-gradient-to-r from-red-700 to-red-500 px-8 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/20 active:translate-y-0 active:shadow-md"
        >
          Exit to Main Menu
        </button>
      </div>
    </div>
  </div>
{/if}
