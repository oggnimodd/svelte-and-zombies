<script lang="ts">
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";

  interface SunCounterProps {
    totalSun: number;
  }
  const { totalSun }: SunCounterProps = $props();
</script>

<div
  bind:this={gameLoop.sunManager.sunCounterDivRef}
  class="flex h-[5rem] w-[5rem] select-none flex-col items-center justify-center rounded-lg border-2 border-black/60 bg-[#94451C] px-3"
>
  <img src="/sun.png" alt="sun" class="h-8 w-8" />
  <p class="text-sm font-bold">{totalSun}</p>
</div>
