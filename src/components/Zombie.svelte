<script lang="ts">
  import { CELL_WIDTH } from "../constants/sizes";
  import type Zombie from "../lib/models/zombies/Zombie.svelte";
  import { getZombieZIndex } from "../utils/getZIndex";

  interface ZombieProps {
    zombie: Zombie;
  }
  const { zombie }: ZombieProps = $props();

  let element: HTMLDivElement;

  // Use a matrix3d transform for better performance
  $effect(() => {
    if (!element) return;
    element.style.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,${zombie.x},${zombie.y},0,1)`;
  });
</script>

<div
  bind:this={element}
  class="zombie"
  class:frozen={zombie.isFrozen}
  style="width: {CELL_WIDTH / 1.5}px; height: {CELL_WIDTH /
    1.5}px; z-index: {getZombieZIndex(zombie.row)}"
>
  <div class="w-full h-full flex items-center justify-center text-6xl">🧛🏻‍♀️</div>
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
