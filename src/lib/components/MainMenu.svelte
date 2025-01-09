<script lang="ts">
  import IconPlant from "@tabler/icons-svelte/icons/plant";
  import IconMan from "@tabler/icons-svelte/icons/man";
  import IconBrandGithub from "@tabler/icons-svelte/icons/brand-github";
  import IconPlayerPlay from "@tabler/icons-svelte/icons/player-play";
  import IconSettings from "@tabler/icons-svelte/icons/settings";

  interface MainMenuProps {
    next: () => void;
  }

  const { next }: MainMenuProps = $props();
</script>

<div
  class="flex min-h-screen w-full flex-col items-center justify-center gap-y-2 bg-gradient-to-br from-green-900 to-green-700 text-white"
>
  <!-- Decorative Background Elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div
      class="absolute -left-16 -top-16 h-32 w-32 rotate-45 rounded-full bg-lime-400/10 blur-3xl"
    ></div>
    <div
      class="absolute -bottom-16 -right-16 h-32 w-32 rotate-45 rounded-full bg-lime-400/10 blur-3xl"
    ></div>
  </div>

  <!-- Main Menu Content -->
  <div class="relative z-10 flex flex-col items-center space-y-8 py-10">
    <!-- Title -->
    <h1
      class="text-center font-creepster text-5xl font-extrabold text-lime-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] md:text-6xl"
    >
      Svelte vs Zombies
    </h1>

    <!-- Buttons -->
    <div
      class="flex flex-col gap-4 [&>a]:font-creepster [&>a]:text-xl md:[&>a]:text-2xl [&>button]:font-creepster [&>button]:text-xl md:[&>button]:text-2xl"
    >
      <!-- Start Game Button -->
      <button
        class="flex transform items-center justify-center gap-2 rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
        onclick={next}
      >
        <IconPlayerPlay class="h-6 w-6" stroke={3.5} />
        Start Game
      </button>

      <!-- Almanac Links -->
      <a
        href="/almanac/plants"
        class="flex transform items-center justify-center gap-2 rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
      >
        <IconPlant class="h-6 w-6" stroke={3.5} />
        Plants Almanac
      </a>

      <a
        href="/almanac/zombies"
        class="flex transform items-center justify-center gap-2 rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
      >
        <IconMan class="h-6 w-6" stroke={3.5} />
        Zombies Almanac
      </a>

      <a
        href="/settings"
        class="flex transform items-center justify-center gap-2 rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
      >
        <IconSettings class="h-6 w-6" stroke={3.5} />
        Settings
      </a>

      <!-- Github Link -->
      <a
        href="https://github.com/oggnimodd/svelte-vs-zombies"
        target="_blank"
        rel="noreferrer noopener"
        class="flex transform items-center justify-center gap-2 rounded-lg border-2 border-lime-400 bg-gradient-to-r from-green-600 to-lime-500 px-6 py-3 text-center font-bold uppercase text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime-400/20 active:translate-y-0.5 active:shadow-md"
      >
        <IconBrandGithub class="h-6 w-6" stroke={3.5} />
        Github
      </a>
    </div>
  </div>
</div>
