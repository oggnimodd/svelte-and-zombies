<script lang="ts">
  interface LawnMowerProps {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  const { x, y, width, height }: LawnMowerProps = $props();
</script>

<div
  class="absolute flex items-center justify-center"
  style="
        top: {y}px; 
        left: {x}px; 
        width: {width}px; 
        height: {height}px; 
        z-index: 10;
    "
>
  <img
    src="/lawnmower.png"
    alt="Lawn Mower"
    class="h-auto w-3/4 object-cover"
  />
</div>
