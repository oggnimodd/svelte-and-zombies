export interface ProjectileStats {
  type: string;
  speed: number;
  width: number;
  height: number;
  image: string;
}

export const ProjectileTypes = {
  PEA: {
    type: "pea",
    speed: 5,
    width: 20,
    height: 20,
    image: "/projectiles/pea.png",
  },
  FIRE_PEA: {
    type: "fire_pea",
    speed: 5,
    width: 30,
    height: 30,
    image: "/projectiles/firepea.png",
  },
  WATERMELON: {
    type: "watermelon",
    speed: 1.5,
    width: 50,
    height: 50,
    image: "/projectiles/watermelon.png",
  },
} as const;

export type ProjectileType = keyof typeof ProjectileTypes;
