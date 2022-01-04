import { draw, writeIn } from "../helpers/draw.js";
import Node from '../helpers/Node.js'
import Myset from "../helpers/mySet.js";
import { onWaiting } from './../helpers/wait.js'
import { findNeighbours } from "../helpers/neighbours.js";
import { visPath } from './../helpers/visPath.js'

const set = Myset

let delayTime = 0;

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'
const candidate = 'candidate'

export const normalDijkestras = (startingNode) => {
    return new Promise((resolve, reject) => {
        const NodeList = [];
        const possibleRouts = new set();
        const iteration = async (nodeLoop, firstTime) => {
            NodeList.push(nodeLoop);
            draw(nodeLoop.node, firstTime ? entry : scaning);
            firstTime ? delayTime = (5 - localStorage.getItem("algorithm_speed")) * 20 + 2 : 15;
            writeIn(nodeLoop.node, `c:${nodeLoop.cost}`)
            if (nodeLoop.node.className === target) {
                visPath(nodeLoop);
                return resolve();
            }
            const res = await onWaiting(delayTime);
            possibleRouts.delete(nodeLoop);
            findNeighbours(nodeLoop.node).forEach((item) => {
                const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 10 : 1));
                //draw(item, candidate)
                //writeIn(item , `c:${newNode.cost}`)
                possibleRouts.add(newNode);
            });
            iteration(possibleRouts.findBestNode());
        };
        return iteration(startingNode, true);
    })
};