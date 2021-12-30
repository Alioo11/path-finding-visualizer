import { draw, writeIn } from "../helpers/draw.js";
import Node from '../helpers/Node.js'
import Myset from "../helpers/mySet.js";
import { onWaiting } from './../helpers/wait.js'
import { findNeighbours } from "../helpers/neighbours.js";
import { visPath } from './../helpers/visPath.js'

const set = Myset

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'

export const dijkestra = (startingNode) => {
  const NodeList = [];
  const possibleRouts = new set();
  const iteration = async (nodeLoop, firstTime) => {
    NodeList.push(nodeLoop);
    draw(nodeLoop.node, firstTime ? entry : scaning);
    writeIn(nodeLoop.node, `c:${nodeLoop.cost}`)
    if (nodeLoop.node.className === target) {
      visPath(nodeLoop);
      return;
    }
    const res = await onWaiting(15);
    possibleRouts.delete(nodeLoop);
    findNeighbours(nodeLoop.node).forEach((item) => {
      const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 10 : 1));
      //console.log(item.className == weight)
      //console.log()
      //console.log(newNode)
      possibleRouts.add(newNode);
    });
    iteration(possibleRouts.findBestNode());
  };
  return iteration(startingNode, true);
};