<script lang="ts">
  import Cell from "../components/Cell.svelte";
  import Row from "../components/Row.svelte";
  import { onDestroy, onMount } from "svelte";
  import {
    CELL_WIDTH,
    YARD_HEIGHT,
    YARD_WIDTH,
    NUM_COLS,
    NUM_ROWS,
  } from "../constants/sizes";
  import Zombie from "./Zombie.svelte";
  import Projectile from "./Projectile.svelte";
  import { gameLoop } from "../reactivity/gameLoop.svelte";
  import { plantSelector } from "../reactivity/plantSelector.svelte";
  import Sun from "./Sun.svelte";
  import { browser } from "$app/environment";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";
  import PlantCursor from "./ImageCursor.svelte";
  import isMobile from "is-mobile";
  import LawnMower from "./LawnMower.svelte";
  import Explosion from "./Explosion.svelte";

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      plantSelector.cancelAll();
    }
  };

  onMount(() => {
    if (browser) {
      window.addEventListener("keydown", handleEscape);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("keydown", handleEscape);
      gameLoop.stop();
    }
  });
</script>

<!-- For debugging -->
<div class="fixed bottom-2 left-2 rounded text-white">
  {gameLoop.fps.toFixed(1)}
</div>

<!-- Total sun:  -->
<div class="fixed bottom-2 right-2 rounded text-white">
  <!-- Button for muting/unmuting sound -->
  <button
    class="bg-red-500 p-2 text-white"
    on:click={() => soundManager.toggleMute()}
  >
    {#if soundManager.isMuted}
      Unmute
    {:else}
      Mute
    {/if}
  </button>

  <!-- Wave progress bar -->
  <div class="h-2 w-full">
    <span
      >{gameLoop.zombieManager.currentWave + 1} / {gameLoop.zombieManager.getTotalWave()}</span
    >
  </div>
</div>

<!-- If not mobile -->
{#if !isMobile()}
  <PlantCursor />
{/if}

<div
  id="yard"
  style="width: {YARD_WIDTH}px; height: {YARD_HEIGHT}px;"
  class="relative"
>
  {#each Array(NUM_ROWS) as _, i}
    <Row id="row-{i}">
      {#each Array(NUM_COLS) as _, j}
        <Cell width={CELL_WIDTH} height={CELL_WIDTH} x={j} y={i} />
      {/each}
    </Row>
  {/each}

  <div class="pointer-events-none absolute left-0 top-0 h-full w-full">
    {#each gameLoop.explosionManager.getExplosions() as explosion (explosion.id)}
      <Explosion
        x={explosion.x}
        y={explosion.y}
        duration={explosion.duration}
        type={explosion.type}
      />
    {/each}
  </div>

  <div class="pointer-events-none absolute left-0 top-0 h-full w-full">
    {#each gameLoop.lawnMowerManager.getLawnMowers() as lawnMower (lawnMower.row)}
      <LawnMower
        x={lawnMower.x}
        y={lawnMower.y}
        width={lawnMower.width}
        height={lawnMower.height}
      />
    {/each}
  </div>

  <div class="pointer-events-none absolute left-0 top-0 h-full w-full">
    {#each gameLoop.projectileManager.projectiles.values() as projectile (projectile.id)}
      <Projectile {projectile} />
    {/each}
  </div>

  <div class="pointer-events-none absolute left-0 top-0 h-full w-full">
    {#each gameLoop.zombieManager.zombies as zombie (zombie.name + zombie.row + zombie.x)}
      <Zombie {zombie} />
    {/each}
  </div>

  <div class="pointer-events-none absolute left-0 top-0 h-full w-full">
    <div class="pointer-events-auto">
      {#each gameLoop.sunManager.suns as sun (sun.id)}
        <Sun
          x={sun.x}
          y={sun.y}
          id={sun.id}
          onCollect={(id) => gameLoop.sunManager.collectSun(id)}
        />
      {/each}
    </div>
  </div>
</div>
