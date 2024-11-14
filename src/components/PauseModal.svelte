<script lang="ts">
  import { gameLoop } from "../reactivity/gameLoop.svelte";

  let isVisible = $state(false);

  function handleVisibilityChange() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && gameLoop.isRunning) {
        isVisible = true;
        gameLoop.pause();
      }
    });
  }

  function handleBlur() {
    window.addEventListener("blur", () => {
      if (gameLoop.isRunning) {
        isVisible = true;
        gameLoop.pause();
      }
    });
  }

  function handlePageHide() {
    window.addEventListener("pagehide", () => {
      if (gameLoop.isRunning) {
        isVisible = true;
        gameLoop.pause();
      }
    });
  }

  function resumeGame() {
    isVisible = false;
    gameLoop.resume();
  }

  function exitGame() {
    console.log(
      "Exit game clicked - would navigate to main menu in the future"
    );
  }

  $effect(() => {
    handleVisibilityChange();
    handleBlur();
    handlePageHide();
  });
</script>

{#if isVisible && gameLoop.isRunning}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-[500] flex items-center justify-center"
  >
    <div
      class="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-lg shadow-xl border-2 border-green-600 transform transition-all"
    >
      <h2 class="text-3xl font-bold text-green-100 mb-6 text-center">
        Game Paused
      </h2>

      <div class="flex flex-col gap-4">
        <button
          onclick={resumeGame}
          class="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Resume Game
        </button>

        <button
          onclick={exitGame}
          class="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Exit to Main Menu
        </button>
      </div>
    </div>
  </div>
{/if}
