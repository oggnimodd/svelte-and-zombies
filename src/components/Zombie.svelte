<script lang="ts">
  import { CELL_WIDTH } from "../constants/sizes";
  import type Zombie from "../lib/models/zombies/Zombie.svelte";
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
  <div class="w-full h-full flex items-center justify-center text-6xl relative">
    {#if zombie.isStunned}
      <div class="absolute top-0 left-0 w-full h-full">😴</div>
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
