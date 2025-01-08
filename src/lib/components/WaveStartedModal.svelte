<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import EventEmitter from "$lib/models/EventEmitter";
  import { gameLoop } from "$lib/reactivity/gameLoop.svelte";

  let showModal = $state(false);
  let waveMessage = $state("");
  let waveNumber = $state(1);
  let isFinalWave = $state(false);
  let timer = $state(0);

  const calculateWaveMessage = () => {
    isFinalWave =
      gameLoop.zombieManager.currentWave ===
      gameLoop.zombieManager.waveConfigs.length - 1;

    if (isFinalWave) {
      waveMessage = "The Final Wave! Brace Yourself!";
    } else {
      const waveMessages = [
        "A horde is approaching!",
        "More zombies are coming!",
        "Here comes another wave!",
        "They just keep coming!",
        "Get ready, get set, go!",
        "Another onslaught is upon us!",
        "This is a big one!",
        "Defend your brains!",
        "More undead on the way!",
        "Zombies incoming!",
        "Brace for impact!",
        "Don't let them through!",
        "Hold the line!",
        "The horde is growing!",
        "They're relentless!",
      ];
      const randomIndex = Math.floor(Math.random() * waveMessages.length);
      waveMessage = waveMessages[randomIndex];
    }
  };

  onMount(() => {
    const waveStartedListener = (wave: number) => {
      waveNumber = wave + 1;
      calculateWaveMessage();
      showModal = true;
      timer = setTimeout(() => {
        showModal = false;
      }, 3500);
    };

    EventEmitter.on("waveStarted", waveStartedListener);

    return () => {
      EventEmitter.off("waveStarted", waveStartedListener);
    };
  });

  onDestroy(() => {
    clearTimeout(timer);
    showModal = false;
  });
</script>

{#if showModal && gameLoop.isRunning}
  <div
    class="pointer-events-none fixed left-0 top-0 z-[9998] flex h-screen w-screen select-none items-center justify-center"
  >
    <div
      class="animate-zoom-in-out font-creepster pointer-events-none select-none text-center text-3xl font-bold text-[red] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] md:text-6xl"
    >
      {waveMessage}
    </div>
  </div>
{/if}
