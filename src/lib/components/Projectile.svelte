<script lang="ts">
  import type Projectile from "$lib/models/projectiles/Projectile.svelte";
  import { ProjectileTypes } from "$lib/models/projectiles/ProjectileTypes";
  import { getProjectileZIndex } from "../utils/getZIndex";

  const { projectile }: { projectile: Projectile } = $props();

  let element: HTMLDivElement;

  // Helper to determine if projectile should rotate
  const shouldRotate = (type: string) =>
    type === ProjectileTypes.WATERMELON.type ||
    type === ProjectileTypes.ICE_WATERMELON.type ||
    type === ProjectileTypes.CABBAGE.type ||
    type === ProjectileTypes.KERNEL.type;
</script>

<div
  bind:this={element}
  class="projectile pointer-events-none z-50 {shouldRotate(projectile.type)
    ? 'rotating'
    : ''}"
  style="z-index: {getProjectileZIndex(projectile.row)}; 
         width: {projectile.width}px; 
         height: {projectile.height}px; 
         transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,{projectile.x},{projectile.y},0,1);"
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
    transform-style: preserve-3d;
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
