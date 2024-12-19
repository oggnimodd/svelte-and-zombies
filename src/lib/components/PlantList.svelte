<script lang="ts">
  let { children } = $props();
</script>

<div class="flex w-full gap-x-1 py-2" style="font-size: 0.5rem;">
  {@render children()}
</div>
