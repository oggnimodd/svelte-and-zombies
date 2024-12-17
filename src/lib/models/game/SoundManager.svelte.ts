import { Howl } from "howler";
import uuid from "short-uuid";
import LocalStorageManager from "../../utils/localStorage";

type GameSoundEffect =
  | "pea-shoot"
  | "explosion"
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
  | "eating"
  | "lawnmower"
  | "splash";

interface SoundConfig {
  src: string;
  volume: number;
  loop?: boolean;
}

const SOUND_CONFIGS: Record<GameSoundEffect | "bg-music", SoundConfig> = {
  "bg-music": { src: "/sounds/bg.mp3", volume: 0.5, loop: true },
  "pea-shoot": { src: "/sounds/pea-pop.mp3", volume: 0.5 },
  pop: { src: "/sounds/pop.mp3", volume: 0.6 },
  explosion: { src: "/sounds/explosion.mp3", volume: 0.9 },
  splash: { src: "/sounds/splash.mp3", volume: 0.6 },
  chomper: { src: "/sounds/chomper.mp3", volume: 0.6 },
  slap: { src: "/sounds/slap.mp3", volume: 0.8 },
  weed: { src: "/sounds/weed.mp3", volume: 0.5 },
  splat: { src: "/sounds/splat.mp3", volume: 0.5 },
  fire: { src: "/sounds/fire.mp3", volume: 0.3 },
  hit: { src: "/sounds/hit.mp3", volume: 0.8 },
  impact: { src: "/sounds/impact.mp3", volume: 0.8 },
  dig: { src: "/sounds/dig.mp3", volume: 0.8 },
  shovel: { src: "/sounds/shovel.mp3", volume: 0.8 },
  eating: { src: "/sounds/eating.mp3", volume: 0.4 },
  lawnmower: { src: "/sounds/lawnmower.mp3", volume: 0.7 },
};

export default class SoundManager {
  private readonly sounds: Map<GameSoundEffect, Howl> = new Map();
  private readonly bgMusic: Howl;
  private soundCooldowns: Map<GameSoundEffect, number> = new Map();
  private readonly cooldownDurations: Record<GameSoundEffect, number> = {
    "pea-shoot": 50,
    explosion: 200,
    splash: 100,
    chomper: 200,
    slap: 100,
    weed: 100,
    splat: 100,
    fire: 100,
    hit: 100,
    impact: 80,
    dig: 100,
    shovel: 100,
    eating: 50,
    pop: 50,
    lawnmower: 100,
  };
  isMuted: boolean = $state(LocalStorageManager.get("sound-muted") ?? false);
  private eatingSounds: Map<string, Howl> = new Map();

  constructor() {
    this.bgMusic = this.createHowl(SOUND_CONFIGS["bg-music"]);
    this.sounds = new Map(
      Object.entries(SOUND_CONFIGS)
        .filter(([key]) => key !== "bg-music")
        .map(([key, config]) => [
          key as GameSoundEffect,
          this.createHowl(config),
        ])
    );
    const savedVolume = LocalStorageManager.get("sound-volume");
    this.setVolume(savedVolume || 0.8);
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
    // Sound cooldowns will always be based on real-time (performance.now() instead of gameTime), regardless of whether the game is paused or the game time is manipulated
    const currentTime = performance.now();
    const lastPlayTime = this.soundCooldowns.get(soundName) || 0;
    const cooldownDuration = this.cooldownDurations[soundName];
    if (
      !this.isMuted &&
      sound &&
      currentTime - lastPlayTime >= cooldownDuration
    ) {
      const baseVolume = sound.volume();
      const volumeVariation = baseVolume * (0.9 + Math.random() * 0.2);
      sound.volume(volumeVariation);
      const rateVariation = 0.95 + Math.random() * 0.1;
      sound.rate(rateVariation);
      sound.play();
      this.soundCooldowns.set(soundName, currentTime);
      sound.once("end", () => {
        sound.volume(baseVolume);
        sound.rate(1);
      });
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    LocalStorageManager.set("sound-muted", this.isMuted);

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
    LocalStorageManager.set("sound-volume", volume);

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

  stopSound(soundName: GameSoundEffect) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.stop();
    }
  }

  dispose() {
    this.bgMusic.unload();
    this.sounds.forEach((sound) => sound.unload());
    this.sounds.clear();
    this.clearCooldowns();
  }

  playEatingSound(): string {
    const sound = new Howl({
      src: [SOUND_CONFIGS.eating.src],
      volume: SOUND_CONFIGS.eating.volume,
      loop: true,
      mute: this.isMuted,
    });
    const soundId = uuid.generate();
    this.eatingSounds.set(soundId, sound);
    sound.play();
    return soundId;
  }

  stopEatingSound(soundId: string) {
    const sound = this.eatingSounds.get(soundId);
    if (sound) {
      sound.stop();
      this.eatingSounds.delete(soundId);
    }
  }
}

export const soundManager = new SoundManager();
