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

  onMount(() => {
    gameLoop.start();
    return () => gameLoop.stop();
  });

  onDestroy(() => {
    plantSelector.destroy();
  });

  console.log(gameLoop.sunManager.suns);
</script>

<!-- For debugging -->
<div class="fixed top-2 right-2 text-white bg-black/50 p-2 rounded">
  FPS: {gameLoop.fps.toFixed(1)}
</div>

<!-- Total sun:  -->
<div class="fixed bottom-2 right-2 text-white bg-black/50 p-2 rounded">
  Total Sun: {gameLoop.sunManager.total}
</div>

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

  <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
    {#each gameLoop.projectileManager.projectiles as projectile (projectile.id)}
      <Projectile {projectile} />
    {/each}
  </div>

  <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
    {#each gameLoop.zombieManager.zombies as zombie (zombie.name + zombie.row + zombie.x)}
      <Zombie {zombie} />
    {/each}
  </div>

  <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
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
