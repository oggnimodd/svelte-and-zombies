<script lang="ts">
  interface RowProps {
    id: string;
    children:any;
  }

  const { id , children}: RowProps = $props();
</script>

<div class="flex" {id}>
  {@render children()} 
</div>
