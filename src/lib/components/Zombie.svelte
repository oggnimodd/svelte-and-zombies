<script lang="ts">
  import { CELL_WIDTH } from "../constants/sizes";
  import type Zombie from "$lib/models/zombies/Zombie.svelte";
  import { getZombieZIndex } from "../utils/getZIndex";
  interface ZombieProps {
    zombie: Zombie;
  }
  const { zombie }: ZombieProps = $props();
</script>

<div
  class="zombie"
  class:frozen={zombie.isFrozen}
  style="width: {CELL_WIDTH / 1.5}px; height: {CELL_WIDTH /
    1.5}px; z-index: {getZombieZIndex(
    zombie.row
  )}; transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,{zombie.x},{zombie.y},0,1);"
>
  <div class="relative flex h-full w-full items-center justify-center">
    {#if zombie.isStunned}
      <img
        class="absolute bottom-full left-0 z-10 object-contain"
        src="/effects/butter.png"
        alt="Butter"
        width={CELL_WIDTH * 0.5}
        height="auto"
      />
    {/if}
    <img
      class="absolute object-contain"
      src={`/zombies/${zombie.image}`}
      alt={zombie.name}
      width={zombie.imageWidth}
      height="auto"
      style="max-width: none; bottom: -{(CELL_WIDTH - CELL_WIDTH / 1.5) /
        2}px;filter: {zombie.getStatus().isHit ? 'brightness(120%)' : 'none'};"
    />
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
