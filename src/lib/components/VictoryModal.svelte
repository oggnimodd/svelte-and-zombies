<script lang="ts">
  import { onMount } from "svelte";
  import { Confetti } from "svelte-confetti";
  import EventEmitter from "$lib/models/EventEmitter";

  let isVisible = $state(false);
  let showConfetti = $state(false);

  onMount(() => {
    EventEmitter.on("gameWon", () => {
      isVisible = true;
      showConfetti = true;
    });
  });

  const hideModal = () => {
    isVisible = false;
    showConfetti = false;
  };

  const exitGame = () => {
    hideModal();
  };
</script>

{#if isVisible}
  {#if showConfetti}
    <div
      class="pointer-events-none fixed left-0 top-[-50px] z-[9998] flex h-screen w-screen justify-center overflow-hidden"
    >
      <Confetti
        x={[-5, 5]}
        y={[0, 0.1]}
        delay={[500, 2000]}
        infinite
        duration={5000}
        amount={200}
        fallDistance="100vh"
      />
    </div>
  {/if}

  <div class="fixed inset-0 z-[9999] flex items-center justify-center">
    <div
      class="relative max-w-lg transform rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 shadow-xl transition-all"
    >
      <h2 class="mb-6 text-center text-4xl font-bold text-yellow-100">
        🌻 You're Plantastic 🌻
      </h2>
      <p class="mb-4 text-center text-lg text-yellow-200">
        You've successfully defended your yard from those brain-hungry zombies!
        Give yourself a pat on the back (and maybe plant some more sunflowers to
        celebrate).
      </p>
      <div class="flex flex-col gap-4">
        <button
          onclick={exitGame}
          class="rounded-lg bg-yellow-400 px-8 py-3 font-semibold text-yellow-800 shadow-md transition-colors duration-200 hover:bg-yellow-300 hover:shadow-lg"
        >
          Exit to Main Menu
        </button>
      </div>
    </div>
  </div>
{/if}
