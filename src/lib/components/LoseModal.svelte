<script lang="ts">
  import { onMount } from "svelte";
  import { gameLoop } from "../reactivity/gameLoop.svelte";
  import EventEmitter from "$lib/models/EventEmitter";

  let isVisible = $state(false);

  onMount(() => {
    EventEmitter.on("gameLost", () => {
      isVisible = true;
    });
  });

  const hideModal = () => {
    isVisible = false;
  };

  const exitGame = () => {
    hideModal();
    gameLoop.stop();
  };
</script>

{#if isVisible}
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="relative max-w-lg transform rounded-lg border-2 border-red-600 bg-gradient-to-br from-red-800 to-red-900 p-8 shadow-xl transition-all"
    >
      <h2 class="mb-6 text-center text-4xl font-bold text-red-100">
        🧠 Game Over! 🧠
      </h2>
      <p class="mb-4 text-center text-lg text-red-200">
        Oh no! The zombies have munched their way through your defenses and
        feasted on your delicious brains. Better luck next time!
      </p>
      <div class="flex flex-col gap-4">
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
