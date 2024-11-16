import { getCellCoordinates } from "../../../utils/getCellCoordinates";
import type BasePlant from "../plants/Plant";
import Plant from "../plants/Plant";
import { generate } from "short-uuid";
import EventEmitter from "../EventEmitter";
import { gameTime } from "./GameTime.svelte";

interface PlantedPlantCell {
  row: number;
  col: number;
}

export interface PlantedPlant {
  plantedId: string;
  plant: Plant;
  currentHealth: number;
  cell: PlantedPlantCell;
  coordinates: { x: number; y: number };
  plantedTime: number;
}

type PlantedPlants = PlantedPlant[];
type AvailablePlants = BasePlant[];

export default class PlantManager {
  plantedPlants: PlantedPlants = $state([]);
  availablePlants: AvailablePlants = $state([]);

  constructor(availablePlants: AvailablePlants) {
    this.availablePlants = availablePlants;

    EventEmitter.on("chilliExploded", this.remove.bind(this));
    EventEmitter.on("cherryExploded", this.remove.bind(this));
    EventEmitter.on("potatoExploded", this.remove.bind(this));
  }

  plant(plant: Plant, cell: { row: number; col: number }) {
    const plantedId = generate();
    const coordinates = getCellCoordinates(cell.row, cell.col);

    // console.log("Before planting:", [...this.plantedPlants]);
    const plantedPlant = {
      plantedId,
      plant,
      currentHealth: plant.health,
      cell,
      coordinates,
      plantedTime: gameTime.get(),
    };

    this.plantedPlants = [...this.plantedPlants, plantedPlant];

    // console.log("After planting:", [...this.plantedPlants]);

    EventEmitter.emit("plantAdded", plantedPlant);
    return plantedPlant;
  }

  remove(plantedId: string) {
    // console.log("Before removal:", [...this.plantedPlants]);

    const filteredPlantedPlants = this.plantedPlants.filter(
      (plantedPlant) => plantedPlant.plantedId !== plantedId
    );

    this.plantedPlants = filteredPlantedPlants;

    // console.log("After removal:", [...this.plantedPlants]);
    EventEmitter.emit("plantRemoved", plantedId);
  }

  getPlantById(plantedId: string) {
    return this.plantedPlants.find(
      (plantedPlant) => plantedPlant.plantedId === plantedId
    );
  }

  getPlantsInRow(row: number): PlantedPlant[] {
    return this.plantedPlants.filter((plant) => plant.cell.row === row);
  }
}
