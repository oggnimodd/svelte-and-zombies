<script lang="ts">
  import ZombieAlmanacCard from "$lib/components/almanac/ZombieAlmanacCard.svelte";
  import { zombieTypes } from "$lib/models/game/ZombieManager.svelte";

  const zombies = zombieTypes.map((ZombieType) => {
    return new ZombieType({});
  });
</script>

<div
  class="relative min-h-screen w-full bg-gradient-to-br from-red-900 to-red-700"
>
  <!-- Game Header -->
  <div
    class="sticky top-0 z-20 border-b-2 border-red-600 bg-red-900/90 shadow-xl backdrop-blur-md"
  >
    <div class="flex items-center justify-between px-6 py-2 md:py-4">
      <h1
        class="text-2xl font-extrabold text-red-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] sm:text-4xl"
      >
        Zombies Almanac
      </h1>
      <a
        href="/"
        class="transform rounded-lg border-2 border-red-400 bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-400/20 active:translate-y-0.5 active:shadow-md md:px-6 md:py-3"
      >
        Menu
      </a>
    </div>
  </div>

  <!-- Zombie Grid -->
  <div
    class="container mx-auto grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  >
    {#each zombies as zombie}
      <ZombieAlmanacCard {zombie} />
    {/each}
  </div>
</div>
