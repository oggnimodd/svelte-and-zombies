interface ScreenOrientation {
  lock(orientation: OrientationLockType): Promise<void>;
  unlock(): void;
  type: OrientationType;
  angle: number;
}

interface Screen {
  orientation: ScreenOrientation;
}
