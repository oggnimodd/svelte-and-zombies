<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import preloadList from "$lib/preload-list.json";
  import { delay } from "$lib/utils/delay";
  import isMobile from "is-mobile";

  interface LoadingScreenProps {
    startGame: () => void;
  }

  const { startGame }: LoadingScreenProps = $props();

  let loadingProgress = $state(0);
  let isLoadingComplete = $state(false);

  onMount(() => {
    if (browser) {
      preloadAssets();
    }
  });

  async function preloadAssets() {
    const { images, sounds } = preloadList;
    const totalAssets = images.length + sounds.length;
    let loadedAssets = 0;

    // Preload images
    const imagePromises = images.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedAssets++;
          updateProgress(loadedAssets, totalAssets);
          resolve();
        };
        img.onerror = () => {
          loadedAssets++;
          updateProgress(loadedAssets, totalAssets);
          resolve();
        };
      });
    });

    // Preload sounds
    const soundPromises = sounds.map((src) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = () => {
          loadedAssets++;
          updateProgress(loadedAssets, totalAssets);
          resolve();
        };
        audio.onerror = () => {
          loadedAssets++;
          updateProgress(loadedAssets, totalAssets);
          resolve();
        };
      });
    });

    // Wait for all assets to load
    await Promise.all([...imagePromises, ...soundPromises]);

    await delay(2000); // Delay for 2 seconds after loading is complete
    isLoadingComplete = true;
  }

  function updateProgress(loadedAssets: number, totalAssets: number) {
    loadingProgress = Math.floor((loadedAssets / totalAssets) * 100);
  }

  $effect(() => {
    if (isLoadingComplete) {
      startGame();
    }
  });
</script>

<div
  class="fixed inset-0 mx-auto flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-green-700"
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

  <!-- Loading Content -->
  <div
    class="container relative z-10 mx-auto flex flex-col items-center space-y-8 px-4"
  >
    <!-- Title -->
    <h1
      class="text-center text-2xl font-extrabold text-lime-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] sm:text-4xl"
    >
      Preparing Your Garden...
    </h1>

    <!-- Progress Bar Container -->
    <div class="relative w-full px-4 sm:w-80">
      <div class="absolute inset-0 rounded-xl bg-lime-400/10 blur-md"></div>
      <div
        class="relative h-6 w-full overflow-hidden rounded-xl border-2 border-lime-400/30 bg-green-900/50 backdrop-blur-sm"
      >
        <div
          class="h-full transform bg-gradient-to-r from-green-600 to-lime-400 transition-all duration-300 ease-out"
          style="width: {loadingProgress}%"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]"
          ></div>
        </div>
      </div>
    </div>

    <!-- Loading Percentage -->
    <p class="font-bold text-lime-400">
      {loadingProgress}% Complete
    </p>

    <!-- Tips Section -->
    <div
      class="mt-8 rounded-xl border-2 border-lime-400/30 bg-green-900/50 p-6 backdrop-blur-sm"
    >
      {#if isMobile()}
        <p class="text-center text-lg text-lime-200">
          <span class="block font-bold text-lime-400">🌱 Planting Tip:</span>
          Turn your device sideways for the best view of your garden
        </p>
      {:else}
        <p class="text-center text-lg text-lime-200">
          <span class="block font-bold text-lime-400">🌱 Gardening Tip:</span>
          Use your browser's zoom (+ or -) to perfect your garden view
        </p>
      {/if}
    </div>
  </div>
</div>
