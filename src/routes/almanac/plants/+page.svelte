<script lang="ts">
  import AlmanacCard from "$lib/components/almanac/PlantAlmanacCard.svelte";
  import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
  const plants = plantSelector.plants;
</script>

<div
  class="relative min-h-screen w-full bg-gradient-to-br from-green-900 to-green-700"
>
  <!-- Game Header -->
  <div
    class="sticky top-0 z-20 border-b-2 border-green-600 bg-green-900/90 shadow-xl backdrop-blur-md"
  >
    <div class="flex items-center justify-between px-6 py-2 md:py-4">
      <h1
        class="text-2xl font-extrabold text-lime-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] sm:text-4xl"
      >
        Plants Almanac
      </h1>

      <a
        href="/"
        class="transform rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-4 py-2 font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md md:px-6 md:py-3"
      >
        Menu
      </a>
    </div>
  </div>

  <!-- Plant Grid -->
  <div
    class="container mx-auto grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  >
    {#each plants as plant}
      <AlmanacCard {plant} />
    {/each}
  </div>
</div>
