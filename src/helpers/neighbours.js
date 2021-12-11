import {dimentions as DM} from '../utils/config.js'
import {cells} from './../index.js'

const dimentions = new DM


const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";

export const findNeighbours = (cellNode , distance = 1 , returnWalls = false) => {
  const WIDTH =  dimentions.getWidth()
  const HEIGHT =  dimentions.getHeight()
  if (!cellNode) return [];
  const result = [];
  const cellIndex = parseInt(cellNode.id);

  if (cellIndex - (WIDTH * distance) >= 0) {
    result.push(cells[cellIndex - (WIDTH * distance)]);
  }

  if ((cellIndex % WIDTH) + distance < WIDTH) {
    result.push(cells[cellIndex + (1 * distance)]);
  }

  if (cellIndex + WIDTH *distance < WIDTH * HEIGHT) {
    result.push(cells[cellIndex + (WIDTH * distance)]);
  }

  if (cellIndex % WIDTH >= distance ) {
    result.push(cells[cellIndex - (1 * distance)]);
  }

  return result
    ? result.filter(
        (res) => res.className === "cell" || res.className === target || returnWalls ? wall : ''
      )
    : [];
};