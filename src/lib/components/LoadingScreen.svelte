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
  class="fixed inset-0 flex flex-col items-center justify-center bg-black text-white"
>
  <h1 class="mb-4 text-2xl font-bold">Loading...</h1>
  <div class="h-4 w-64 overflow-hidden rounded-full bg-gray-700">
    <div
      class="h-full bg-green-500 transition-all duration-300 ease-in-out"
      style="width: {loadingProgress}%"
    ></div>
  </div>

  <div class="mt-4 text-center">
    {#if isMobile()}
      <p class="text-lg">
        <b>For the best gaming experience:</b>
        <br />
        Please turn your phone sideways (landscape mode) 📱
      </p>
    {:else}
      <p class="text-lg">
        <b>Tip</b>: Use your browser's zoom (+ or -) to find your perfect view
        🔍
      </p>
    {/if}
  </div>
</div>
