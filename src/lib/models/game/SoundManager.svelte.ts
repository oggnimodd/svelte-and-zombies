import { Howl } from "howler";

// Define available sound types
export type GameSoundEffect =
  | "pea-shoot"
  | "explosion"
  | "chomp"
  | "plant-place"
  | "chomper"
  | "slap"
  | "weed"
  | "splat"
  | "fire"
  | "pop"
  | "hit"
  | "impact"
  | "dig"
  | "shovel"
  | "splash";

interface SoundConfig {
  src: string;
  volume: number;
  loop?: boolean;
}

// Define sound configurations
const SOUND_CONFIGS: Record<GameSoundEffect | "bg-music", SoundConfig> = {
  "bg-music": {
    src: "/sounds/bg.mp3",
    volume: 0.5,
    loop: true,
  },
  "pea-shoot": {
    src: "/sounds/pea-pop.mp3",
    volume: 0.5,
  },
  pop: {
    src: "/sounds/pop.mp3",
    volume: 0.6,
  },
  explosion: {
    src: "/sounds/explosion.mp3",
    volume: 0.9,
  },
  chomp: {
    src: "/sounds/chomp.mp3",
    volume: 0.6,
  },
  "plant-place": {
    src: "/sounds/plant-place.mp3",
    volume: 0.6,
  },
  splash: {
    src: "/sounds/splash.mp3",
    volume: 0.6,
  },
  chomper: {
    src: "/sounds/chomper.mp3",
    volume: 0.6,
  },
  slap: {
    src: "/sounds/slap.mp3",
    volume: 0.8,
  },
  weed: {
    src: "/sounds/weed.mp3",
    volume: 0.5,
  },
  splat: {
    src: "/sounds/splat.mp3",
    volume: 0.5,
  },
  fire: {
    src: "/sounds/fire.mp3",
    volume: 0.3,
  },
  hit: {
    src: "/sounds/hit.mp3",
    volume: 0.8,
  },
  impact: {
    src: "/sounds/impact.mp3",
    volume: 0.8,
  },
  dig: {
    src: "/sounds/dig.mp3",
    volume: 0.8,
  },
  shovel: {
    src: "/sounds/shovel.mp3",
    volume: 0.8,
  },
};

export default class SoundManager {
  private readonly sounds: Map<GameSoundEffect, Howl>;
  private readonly bgMusic: Howl;
  private soundCooldowns: Map<GameSoundEffect, number> = new Map();

  private readonly cooldownDurations: Record<GameSoundEffect, number> = {
    "pea-shoot": 50, // Fast-paced shooting sounds
    explosion: 200, // Impactful explosion sounds need more spacing
    chomp: 100, // Medium cooldown for chomping
    pop: 100,
    "plant-place": 100, // Medium cooldown for placing plants
    splash: 100, // Medium cooldown for splash effects
    chomper: 200, // Longer cooldown for chomper sounds
    slap: 100, // Medium cooldown for slap sounds
    weed: 100, // Medium cooldown for weed sounds
    splat: 100, // Medium cooldown for splat sounds
    fire: 100, // Medium cooldown for fire sounds
    hit: 100, // Medium cooldown for hit sounds
    impact: 80,
    dig: 100,
    shovel: 100,
  };

  isMuted: boolean = $state(false);

  constructor() {
    // Initialize background music
    this.bgMusic = this.createHowl(SOUND_CONFIGS["bg-music"]);

    // Initialize sound effects
    this.sounds = new Map(
      Object.entries(SOUND_CONFIGS)
        .filter(([key]) => key !== "bg-music")
        .map(([key, config]) => [
          key as GameSoundEffect,
          this.createHowl(config),
        ])
    );
  }

  private createHowl(config: SoundConfig): Howl {
    return new Howl({
      src: [config.src],
      volume: config.volume,
      loop: config.loop ?? false,
    });
  }

  playBackgroundMusic() {
    if (!this.isMuted) {
      this.bgMusic.duration(0);
      this.bgMusic.play();
    }
  }

  stopBackgroundMusic() {
    this.bgMusic.stop();
  }

  playSound(soundName: GameSoundEffect) {
    const sound = this.sounds.get(soundName);
    const currentTime = performance.now();
    const lastPlayTime = this.soundCooldowns.get(soundName) || 0;
    const cooldownDuration = this.cooldownDurations[soundName];

    if (
      !this.isMuted &&
      sound &&
      currentTime - lastPlayTime >= cooldownDuration
    ) {
      // Add slight random variation to volume (±10%)
      const baseVolume = sound.volume();
      const volumeVariation = baseVolume * (0.9 + Math.random() * 0.2);
      sound.volume(volumeVariation);

      // Add slight random variation to rate/pitch (±5%)
      const rateVariation = 0.95 + Math.random() * 0.1;
      sound.rate(rateVariation);

      sound.play();
      this.soundCooldowns.set(soundName, currentTime);

      // Reset volume and rate after playing
      sound.once("end", () => {
        sound.volume(baseVolume);
        sound.rate(1);
      });
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.bgMusic.pause();
    } else {
      this.bgMusic.play();
    }
  }

  setVolume(volume: number) {
    if (volume < 0 || volume > 1) {
      throw new Error("Volume must be between 0 and 1");
    }
    this.bgMusic.volume(volume);
    this.sounds.forEach((sound) => sound.volume(volume));
  }

  clearCooldowns() {
    this.soundCooldowns.clear();
  }

  stopAll() {
    this.bgMusic.stop();
    this.sounds.forEach((sound) => sound.stop());
    this.clearCooldowns();
  }

  dispose() {
    this.bgMusic.unload();
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
    this.clearCooldowns();
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();
