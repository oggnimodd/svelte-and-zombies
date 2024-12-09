<script lang="ts">
  import isMobile from "is-mobile";
</script>

<div
  class="mr-20 grid h-full grid-cols-3"
  style="font-size: 0.5rem; width: {isMobile() ? '20vw' : '12vw'}"
>
  <slot />
</div>
