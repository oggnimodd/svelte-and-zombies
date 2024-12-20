<script lang="ts">
  let { children } = $props();
</script>

<div class="flex gap-x-1">
  {@render children()}
</div>
