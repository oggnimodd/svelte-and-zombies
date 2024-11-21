<script lang="ts">
  import { CELL_WIDTH } from "../constants/sizes";
  import type Zombie from "$lib/models/zombies/Zombie.svelte";
  import { getZombieZIndex } from "../utils/getZIndex";

  interface ZombieProps {
    zombie: Zombie;
  }
  const { zombie }: ZombieProps = $props();

  let element: HTMLDivElement;
</script>

<div
  bind:this={element}
  class="zombie"
  class:frozen={zombie.isFrozen}
  style="width: {CELL_WIDTH / 1.5}px; height: {CELL_WIDTH /
    1.5}px; z-index: {getZombieZIndex(
    zombie.row
  )}; transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,{zombie.x},{zombie.y},0,1);"
>
  <div class="relative flex h-full w-full items-center justify-center text-6xl">
    {#if zombie.isStunned}
      <div class="absolute left-0 top-0 h-full w-full">😴</div>
    {/if}

    <span> 🧛🏻‍♀️ </span>
  </div>
</div>

<style>
  .zombie {
    position: absolute;
    contain: layout size;
    will-change: transform;
    backface-visibility: hidden;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .frozen {
    filter: brightness(150%) saturate(50%) hue-rotate(180deg);
  }
</style>
