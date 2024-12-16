import fs from "node:fs";
import path from "node:path";

const ASSETS_DIR = "static";
const OUTPUT_FILE = "src/lib/preload-list.json";

// Explicitly define the type for assetList
const assetList: { images: string[]; sounds: string[] } = {
  images: [],
  sounds: [],
};

function walkDir(dir: string) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      const relativePath = path.relative(ASSETS_DIR, fullPath);
      if (
        file.endsWith(".png") ||
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".gif")
      ) {
        assetList.images.push("/" + relativePath);
      } else if (file.endsWith(".mp3") || file.endsWith(".wav")) {
        assetList.sounds.push("/" + relativePath);
      }
    }
  });
}

walkDir(ASSETS_DIR);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(assetList, null, 2));
console.log(`Asset list generated at: ${OUTPUT_FILE}`);
