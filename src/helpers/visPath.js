import { onWaiting } from "./wait.js";
import { draw } from "./draw.js";

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";

export const visPath = async (finalNode) => {
  const revPath = [];
  while (finalNode.orgin !== null) {
    revPath.push(finalNode.node);
    //updateBoard(finalNode.node , path)
    finalNode = finalNode.orgin;
  }
  for (let i = revPath.length - 1; i >= 0; i--) {
    const waitingResult = await onWaiting();
    draw(revPath[i], path);
  }
};

