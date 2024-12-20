<script lang="ts">
  import { CELL_WIDTH } from "../constants/sizes";
  import { onDestroy } from "svelte";
  import { gameLoop } from "../reactivity/gameLoop.svelte";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";

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
  let deltaX = $state("0px");
  let deltaY = $state("0px");

  function collect() {
    soundManager.playSound("pop");
    if (collected || gameLoop.isPaused) return;
    collected = true;

    if (element && gameLoop.sunManager.sunCounterDivRef) {
      const counterRect =
        gameLoop.sunManager.sunCounterDivRef.getBoundingClientRect();
      const sunRect = element.getBoundingClientRect();
      const sunData = gameLoop.sunManager.suns.find((s) => s.id === id);
      if (!sunData) return;

      const sunCenterX = sunRect.left + sunRect.width / 2;
      const counterCenterX = counterRect.left + counterRect.width / 2;
      const counterCenterY = counterRect.top + counterRect.height / 2;

      if (sunData.isFallingFromSky && sunData.y < sunData.targetY) {
        // For moving sky suns, move to 0,0
        const sunCenterY = sunRect.top + sunRect.height / 2;
        deltaX = `${counterCenterX - sunCenterX}px`;
        // Compensate the movement of the sun
        deltaY = `${-sunCenterY - sunRect.height / 4}px`;
      } else {
        // For flower suns and landed sky suns, use previous logic
        const yAdjustment = sunData.targetY - sunData.y;
        const sunCenterY = sunRect.top + sunRect.height / 2 + yAdjustment;
        deltaX = `${counterCenterX - sunCenterX}px`;
        deltaY = `${counterCenterY - sunCenterY}px`;
      }
    }

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
  style={`--delta-x: ${deltaX}; --delta-y: ${deltaY}; width: ${CELL_WIDTH}px; height: ${CELL_WIDTH}px; transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,${x},${y},0,1);`}
>
  <div class="sun-image flex h-full w-full items-center justify-center">
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
      transform: translate(var(--delta-x), var(--delta-y));
      opacity: 0.2;
    }
  }
</style>
