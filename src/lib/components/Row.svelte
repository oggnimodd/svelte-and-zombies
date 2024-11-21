<script lang="ts">
  import type { Snippet } from "svelte";

  interface RowProps {
    id: string;
    children: Snippet<[]>;
  }

  const { id, children }: RowProps = $props();
</script>

<div class="flex" {id}>
  {@render children()}
</div>
