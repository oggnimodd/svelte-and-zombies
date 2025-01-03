<script lang="ts">
  import IconVolume from "@tabler/icons-svelte/icons/volume";
  import IconVolumeOff from "@tabler/icons-svelte/icons/volume-off";
  import IconPlayerPause from "@tabler/icons-svelte/icons/player-pause";
  import IconPlayerPlay from "@tabler/icons-svelte/icons/player-play";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";

  const toggleMute = () => {
    soundManager.toggleMute();
  };

  const togglePause = () => {
    if (gameLoop.isPaused) {
      gameLoop.resume();
    } else {
      gameLoop.pause();
    }
  };
</script>

<div class="flex gap-2">
  <!-- Mute Button -->
  <button
    onclick={toggleMute}
    class="rounded-full border border-white/20 bg-white/10 p-0.5 transition-all duration-200 ease-in-out hover:border-white/40 hover:bg-white/20 md:p-2"
    aria-label={soundManager.isMuted ? "Unmute" : "Mute"}
  >
    {#if soundManager.isMuted}
      <IconVolumeOff class="h-2 w-2 text-white md:h-4 md:w-4" />
    {:else}
      <IconVolume class="h-2 w-2 text-white md:h-4 md:w-4" />
    {/if}
  </button>

  <!-- Pause Button -->
  <button
    onclick={togglePause}
    class="rounded-full border border-white/20 bg-white/10 p-0.5 transition-all duration-200 ease-in-out hover:border-white/40 hover:bg-white/20 md:p-2"
    aria-label={gameLoop.isPaused ? "Resume" : "Pause"}
  >
    {#if gameLoop.isPaused}
      <IconPlayerPlay class="h-2 w-2 text-white md:h-4 md:w-4" />
    {:else}
      <IconPlayerPause class="h-2 w-2 text-white md:h-4 md:w-4" />
    {/if}
  </button>
</div>
