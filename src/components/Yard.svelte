<script lang="ts">
  import Cell from "../components/Cell.svelte";
  import Row from "../components/Row.svelte";
  import { onMount } from "svelte";
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

  onMount(() => {
    gameLoop.start();
    return () => gameLoop.stop();
  });
</script>

<!-- For debugging -->
<div class="fixed top-2 right-2 text-white bg-black/50 p-2 rounded">
  FPS: {gameLoop.fps.toFixed(1)}
</div>

<div style="width: {YARD_WIDTH}px; height: {YARD_HEIGHT}px;" class="relative">
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
</div>
