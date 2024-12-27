<script lang="ts">
  interface MainMenuProps {
    startGame: () => void;
  }

  const { startGame }: MainMenuProps = $props();
</script>

<div
  class="flex min-h-screen w-full flex-col items-center justify-center gap-y-2 bg-gradient-to-br from-green-900 to-green-700 text-white"
>
  <!-- Decorative Background Elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div
      class="absolute -left-16 -top-16 h-32 w-32 rotate-45 rounded-full bg-lime-400/10 blur-3xl"
    ></div>
    <div
      class="absolute -bottom-16 -right-16 h-32 w-32 rotate-45 rounded-full bg-lime-400/10 blur-3xl"
    ></div>
  </div>

  <!-- Main Menu Content -->
  <div class="relative z-10 flex flex-col items-center space-y-8">
    <!-- Title -->
    <h1
      class="text-center text-4xl font-extrabold text-lime-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] sm:text-6xl"
    >
      Svelte vs Zombies
    </h1>

    <!-- Buttons -->
    <div class="flex flex-col gap-4">
      <!-- Start Game Button -->
      <button
        class="transform rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
        onclick={() => {
          startGame();
        }}
      >
        Start Game
      </button>

      <!-- Almanac Links -->
      <a
        href="/almanac/plants"
        class="transform rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
      >
        Plants Almanac
      </a>

      <a
        href="/almanac/zombies"
        class="transform rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
      >
        Zombies Almanac
      </a>
    </div>
  </div>
</div>
