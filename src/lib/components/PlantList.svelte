<script lang="ts">
  import type { Snippet } from "svelte";

  interface PlantListProps {
    children: Snippet<[]>;
    mode?: "in-game" | "options" | "preview";
  }

  let { children, mode = "in-game" }: PlantListProps = $props();
</script>

{#if mode === "options"}
  <div class="flex flex-wrap justify-center gap-2">
    {@render children()}
  </div>
{:else if mode === "in-game" || mode === "preview"}
  <div class="flex gap-x-1">
    {@render children()}
  </div>
{/if}
