import { onWaiting } from "./wait.js";
import { draw } from "./draw.js";
import { nodeTypes } from "../utils/config.js";


const {path} = nodeTypes

export const visPath = async (finalNode) => {
  const revPath = [];
  while (finalNode.orgin !== null) {
    revPath.push(finalNode.node);
    //updateBoard(finalNode.node , path)
    finalNode = finalNode.orgin;
  }
  for (let i = revPath.length - 1; i >= 0; i--) {
    const waitingResult = await onWaiting(10);
    draw(revPath[i], path , {animationDuration:1000});
  }
};

