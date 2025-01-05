<script lang="ts">
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import Slider from "$lib/components/ui/Slider.svelte";
  import { soundManager } from "$lib/models/game/SoundManager.svelte";
  import LocalStorageManager from "$lib/utils/localStorage";

  let sound = $state(!soundManager.isMuted);
  // Convert the 0-1 volume range to 0-100 for the slider
  let volume = $state(LocalStorageManager.get("sound-volume") * 100);

  function handleVolumeChange(value: number) {
    volume = value;
    soundManager.setVolume(value / 100);
  }

  function handleSoundToggle(checked: boolean) {
    sound = checked;
    soundManager.toggleMute();
  }
</script>

<div
  class="relative min-h-screen w-full bg-gradient-to-br from-green-900 to-green-700"
>
  <!-- Game Header -->
  <div
    class="sticky top-0 z-20 border-b-2 border-green-600 bg-green-900/90 shadow-xl backdrop-blur-md"
  >
    <div class="flex items-center justify-between px-6 py-2 md:py-4">
      <h1
        class="text-2xl font-extrabold text-lime-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] sm:text-4xl"
      >
        Settings
      </h1>
      <a
        href="/"
        class="transform rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-4 py-2 font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md md:px-6 md:py-3"
      >
        Menu
      </a>
    </div>
  </div>

  <!-- Settings Content -->
  <div class="container mx-auto max-w-4xl p-6">
    <div class="space-y-6">
      <!-- Sound -->
      <Checkbox label="Sound" checked={sound} onChange={handleSoundToggle} />
      <!-- Master Volume Setting -->
      <Slider
        label="Volume"
        min={0}
        max={100}
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  </div>
</div>
