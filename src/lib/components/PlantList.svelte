<script lang="ts">
  let { children } = $props();
</script>

<div class="flex w-full gap-x-1">
  {@render children()}
</div>
