export interface PlantStats {
  id: string;
  name: string;
  price: number;
  health: number;
  damage?: number;
  // Shooting cooldown
  shootCooldown?: number;
  // Buy cooldown
  buyCooldown?: number;
  range?: number;
  description?: string;
}

export default class BasePlant {
  id: string;
  name: string;
  price: number;
  health: number = $state(0);
  damage: number;
  shootCooldown: number;
  range: number;
  lastShotTime: number = 0;
  buyCooldown: number = 0;
  isHit: boolean = $state(false);
  hitEndTime: number = 0;
  private hitEffectDuration: number = 500;

  constructor(stats: PlantStats) {
    this.id = stats.id;
    this.name = stats.name;
    this.price = stats.price;
    this.health = stats.health;
    this.damage = stats.damage ?? 0;
    this.shootCooldown = stats.shootCooldown ?? 0;
    this.buyCooldown = stats.buyCooldown ?? 0;
    this.range = stats.range ?? 0;
  }

  canShoot(gameTime: number) {
    return gameTime - this.lastShotTime >= this.shootCooldown;
  }

  resetLastShotTime(gameTime: number) {
    this.lastShotTime = gameTime;
  }

  takeHit(damage: number, gameTime: number) {
    this.health -= damage;
    this.hitEndTime = Math.max(
      gameTime + this.hitEffectDuration,
      this.hitEndTime
    );
    this.isHit = true;
  }

  getStatus() {
    return {
      isHit: this.isHit,
    };
  }
}
