const plantImageCache = new Map<string, string>();

export const getPlantImage = (plantId: string) => {
  if (!plantImageCache.has(plantId)) {
    plantImageCache.set(plantId, `/plants/${plantId}.png`);
  }
  return plantImageCache.get(plantId)!;
};
