<script lang="ts">
  import type { ZombieConfig } from "$lib/models/zombies/Zombie.svelte";

  interface ZombieAlmanacCardProps {
    zombie: ZombieConfig;
  }

  const { zombie }: ZombieAlmanacCardProps = $props();
</script>

<div
  class="group relative transform rounded-xl border-2 border-red-600/30 bg-gradient-to-br from-red-800/90 to-red-700/90 p-6 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-red-400/20"
>
  <!-- Image Container -->
  <div class="relative mb-4 flex justify-center">
    <div class="absolute inset-0 rounded-full bg-red-400/10 blur-xl"></div>
    <img
      src={`/zombies/${zombie.image}`}
      alt={zombie.name}
      class="relative h-40 w-40 object-contain"
    />
  </div>

  <!-- Zombie Info -->
  <h2 class="mb-4 text-center text-xl font-bold text-red-400 drop-shadow-lg">
    {zombie.name}
  </h2>

  <!-- Stats -->
  <div class="space-y-2">
    <!-- Health Bar -->
    <div class="rounded-lg border border-red-400/20 bg-black/20 p-2.5">
      <span class="mb-1 block text-sm text-red-400">Health</span>
      <div class="flex items-center gap-2 font-bold text-yellow-400">
        {zombie.health}
      </div>
    </div>

    <!-- Damage -->
    <div class="rounded-lg border border-red-400/20 bg-black/20 p-2.5">
      <span class="mb-1 block text-sm text-red-400">Damage</span>
      <div class="flex items-center gap-2 font-bold text-yellow-400">
        {zombie.damage}
      </div>
    </div>

    <!-- Speed -->
    <div class="rounded-lg border border-red-400/20 bg-black/20 p-2.5">
      <span class="mb-1 block text-sm text-red-400">Speed</span>
      <div class="flex items-center gap-2 font-bold text-yellow-400">
        {zombie.speed}
      </div>
    </div>

    <!-- Description -->
    {#if zombie.description}
      <div class="mt-4 rounded-lg border border-red-400/20 bg-black/20 p-2.5">
        <span class="mb-1 block text-sm text-red-400">Description</span>
        <div class="flex items-center gap-2 font-bold text-yellow-400">
          {zombie.description}
        </div>
      </div>
    {/if}
  </div>
</div>
