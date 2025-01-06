<script lang="ts">
  import type { Snippet } from "svelte";

  interface PlantListProps {
    children: Snippet<[]>;
    mode?: "in-game" | "options" | "preview";
  }

  let { children, mode = "in-game" }: PlantListProps = $props();
</script>

{#if mode === "options"}
  <div
    class="sm:max-h-auto grid max-h-[16rem] grid-cols-4 justify-center gap-2 px-2 sm:flex sm:flex-wrap sm:px-0"
  >
    {@render children()}
  </div>
{:else if mode === "in-game" || mode === "preview"}
  <div class="flex gap-x-1">
    {@render children()}
  </div>
{/if}
