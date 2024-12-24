<script lang="ts">
  import AlmanacCard from "$lib/components/almanac/AlmanacCard.svelte";
  import { plantSelector } from "$lib/reactivity/plantSelector.svelte";

  const plants = plantSelector.plants;
</script>

<div
  class="flex min-h-screen w-full flex-col items-center justify-center bg-gray-800 text-white"
>
  <div class="container py-10">
    <!-- Sticky Header with Back Button -->
    <div
      class="sticky top-0 z-10 flex w-full items-center justify-between bg-gray-900 px-5 py-4 shadow-md"
    >
      <h1 class="text-center text-4xl font-bold">Almanac</h1>

      <a
        href="/"
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Back to Main Menu
      </a>
    </div>
    <div
      class="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {#each plants as plant}
        <AlmanacCard {plant} />
      {/each}
    </div>
  </div>
</div>
