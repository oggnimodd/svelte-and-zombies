export async function lockOrientationToLandscape() {
  // Check if orientation is available
  if (screen.orientation) {
    // Check if currently in portrait mode
    if (screen.orientation.type.includes("portrait")) {
      try {
        await screen.orientation.lock("landscape-primary");
      } catch (err) {
        console.error("Failed to lock orientation:", err);
      }
    }
  }
}

export async function enterFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch (err) {
    console.error("Failed to enter fullscreen:", err);
  }
}
