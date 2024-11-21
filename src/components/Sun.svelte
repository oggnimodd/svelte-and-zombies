<script lang="ts">
  import { CELL_WIDTH } from "../constants/sizes";
  import { onDestroy } from "svelte";
  import { gameLoop } from "../reactivity/gameLoop.svelte";

  interface SunProps {
    x: number;
    y: number;
    id: string;
    onCollect: (id: string) => void;
  }

  const { x, y, id, onCollect }: SunProps = $props();
  let element: HTMLButtonElement;
  let collected = $state(false);
  let timeOut: number = $state(0);
  let autoCollectTimer: number;

  function collect() {
    if (collected || gameLoop.isPaused) return;
    collected = true;
    timeOut = setTimeout(() => onCollect(id), 600);
  }

  $effect(() => {
    // Start auto-collect timer
    autoCollectTimer = setTimeout(() => {
      collect();
    }, 5000); // Auto-collect after 5 seconds
  });

  onDestroy(() => {
    clearTimeout(timeOut);
    clearTimeout(autoCollectTimer); // Clear the auto-collect timer
  });
</script>

<button
  bind:this={element}
  onmouseenter={collect}
  class="sun z-[8000]"
  class:collected
  style="width: {CELL_WIDTH}px; height: {CELL_WIDTH}px; transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,{x},{y},0,1);"
>
  <div class="w-full h-full flex items-center justify-center sun-image">
    <img class="w-[4rem]" src="/sun.png" alt="sun" />
  </div>
</button>

<style>
  .sun {
    position: absolute;
    cursor: pointer;
    contain: layout size;
    will-change: transform;
    backface-visibility: hidden;
  }
  .collected .sun-image {
    animation: collect 0.6s ease-out forwards;
    pointer-events: none;
  }
  @keyframes collect {
    to {
      transform: translate(-450px, -250px);
      opacity: 0;
    }
  }
</style>
