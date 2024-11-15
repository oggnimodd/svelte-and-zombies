class GameTime {
  private gameTime: number = $state(0);

  constructor() {
    this.gameTime = 0;
  }

  get(): number {
    return this.gameTime;
  }

  set(gameTime: number) {
    this.gameTime = gameTime;
  }
}

export const gameTime = new GameTime();
