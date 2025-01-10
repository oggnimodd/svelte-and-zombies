<script lang="ts">
  import {
    CELL_WIDTH,
    YARD_BOUNDARY_OFFSET,
    YARD_WIDTH,
  } from "$lib/constants/sizes";
  interface ExplosionProps {
    type: "circular" | "row" | "charred";
    x: number;
    y: number;
    duration: number;
  }
  const { type, x, y, duration }: ExplosionProps = $props();

  // Just for row explosions
  const explosionHeight = (CELL_WIDTH * 4) / 5;

  const explosionWidth = YARD_WIDTH + YARD_BOUNDARY_OFFSET;
</script>

<!-- Circular explosion -->
{#if type === "circular"}
  <div
    class="circular-explosion"
    style="
      left: {x - CELL_WIDTH / 2}px;
      top: {y - CELL_WIDTH / 2}px;
      width: {CELL_WIDTH}px;
      height: {CELL_WIDTH}px;
      z-index: 5000;
      animation-duration: {duration}ms;
    "
  >
    <div class="relative h-full w-full items-center justify-center">
      <img
        src="/effects/circular-explosion.png"
        alt="explosion"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
        style="max-width: none; width: {CELL_WIDTH * 4}px;"
      />
    </div>
  </div>
{/if}

<!-- Row explosion -->
{#if type === "row"}
  <div
    class="row-explosion"
    style="
      left: 0;
      top: {y - explosionHeight / 2}px;
      width: {explosionWidth}px;
      height: {explosionHeight}px;
      z-index: 5000;
      animation-duration: {duration}ms;
    "
  >
    <div
      class="row-explosion-image"
      style="
        background-image: url('/effects/row-explosion.png');
        background-size: auto {explosionHeight}px;
        background-repeat: repeat-x;
        width: 100%;
        height: 100%;
      "
    ></div>
  </div>
{/if}

<!-- Charred zombie effect -->
{#if type === "charred"}
  <div
    class="charred-effect"
    style="
    transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,{x},{y},0,1);
    z-index: 5000;
    animation-duration: {duration}ms;
    width: {CELL_WIDTH / 0.9}px;
    height: {CELL_WIDTH / 0.9}px;
  "
  >
    <div class="relative w-auto" style="width: {CELL_WIDTH / 1.3}px;">
      <img
        src="/effects/charred-zombie.png"
        alt="charred"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
      />
    </div>
  </div>
{/if}

<style>
  .circular-explosion {
    position: absolute;
    animation: explode forwards ease-out;
    transform-origin: center center;
  }

  @keyframes explode {
    0% {
      transform: scale(0);
      animation-timing-function: cubic-bezier(0.1, -0.5, 0.5, 1.5);
    }
    100% {
      transform: scale(1.5);
    }
  }

  .row-explosion {
    position: absolute;
    overflow: hidden;
  }

  .row-explosion-image {
    background-repeat: repeat-x;
    background-position: 0 0;
  }

  .charred-effect {
    position: absolute;
  }
</style>
