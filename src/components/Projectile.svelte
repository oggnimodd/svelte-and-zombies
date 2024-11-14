<script lang="ts">
  import type Projectile from "../lib/models/projectiles/Projectile.svelte";
  import { getProjectileZIndex } from "../utils/getZIndex";

  const { projectile }: { projectile: Projectile } = $props();

  let element: HTMLDivElement;

  $effect(() => {
    if (!element) return;
    element.style.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,${projectile.x},${projectile.y},0,1)`;
  });
</script>

<div
  bind:this={element}
  class="projectile z-50 {projectile.type === 'watermelon' ? 'rotating' : ''}"
  style="z-index: {getProjectileZIndex(
    projectile.row
  )};width: {projectile.width}px; height: {projectile.height}px;"
>
  <img
    src={projectile.image}
    alt={projectile.type}
    width={projectile.width}
    height={projectile.height}
  />
</div>

<style>
  .projectile {
    position: absolute;
    contain: layout size;
    will-change: transform;
    backface-visibility: hidden;
  }

  /* Add rotation animation */
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Only apply rotation if 'rotating' class is active */
  .rotating img {
    animation: rotate 1s linear infinite;
  }
</style>
