<script lang="ts">
  interface WaveProgressProps {
    currentWave: number;
    totalWaves: number;
  }

  const { currentWave, totalWaves }: WaveProgressProps = $props();

  let progress = $derived.by(() => {
    return totalWaves > 0 ? (currentWave / totalWaves) * 100 : 0;
  });

  let flagPositions = $derived.by(() => {
    const positions = [];
    const totalGaps = totalWaves;
    for (let i = 0; i < totalWaves; i++) {
      positions.push(
        totalGaps > 0 ? ((totalGaps - (i + 1)) / totalGaps) * 100 : 0
      );
    }
    return positions;
  });

  let zombiePosition = $derived.by(() => {
    const segmentWidth = 100 / totalWaves;
    const zombiePos = 100 - currentWave * segmentWidth;
    return Math.max(0, zombiePos);
  });
</script>

<div class="w-64">
  <div class="relative h-4 w-full lg:h-5">
    <!-- Main Progress Bar -->
    <div
      class="absolute inset-0 overflow-hidden rounded-xl border-2 border-lime-400/30 bg-green-900/50 backdrop-blur-sm"
    >
      <!-- Decorative Blur -->
      <div class="absolute inset-0 rounded-xl bg-lime-400/10 blur-md"></div>

      <!-- Progress Fill -->
      <div
        class="absolute right-0 h-full bg-gradient-to-r from-green-600 to-lime-400 transition-all duration-500 ease-in-out"
        style={`width: ${progress}%;`}
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]"
        ></div>
      </div>

      <!-- Wave Markers -->
      {#each flagPositions as position}
        <div class="absolute top-0 h-full" style={`left: ${position}%;`}>
          <div
            class="absolute top-1/2 flex h-full w-3 -translate-y-1/2 items-center justify-center rounded-sm border border-red-900/80 bg-red-600/80 shadow-lg"
          >
            <div
              class="h-2 w-2 rounded-full border border-red-900/80 bg-red-400/80"
            ></div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Zombie Head -->
    <div
      class="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
      style={`left: ${zombiePosition}%;`}
    >
      <div class="relative -mt-1 h-8 w-8">
        <div class="absolute inset-0 rounded-full bg-lime-400/20 blur-lg"></div>
        <img
          src="/zombie-head.png"
          alt="Progress"
          class="relative h-8 w-8 transform drop-shadow-[0_0_8px_rgba(134,239,172,0.5)] transition-all duration-300 ease-in-out hover:scale-110"
        />
      </div>
    </div>
  </div>
</div>
