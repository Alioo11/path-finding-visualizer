import { draw, writeIn } from "../helpers/draw.js";
import Node from '../helpers/Node.js'
import Myset from "../helpers/mySet.js";
import { onWaiting } from './../helpers/wait.js'
import { findNeighbours } from "../helpers/neighbours.js";
import { visPath } from './../helpers/visPath.js'
import { waitTillUserClick} from '../index.js'

const set = Myset

let delayTime = 0;
let isDetailMood = localStorage.getItem('detail-mode') ? localStorage.getItem('detail-mode') : false;
let NodeList = [];

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'
const candidate = 'candidate'
const cell = 'cell'

export const normalDijkestras = (startingNode) => {
    return new Promise((resolve, reject) => {
        const possibleRouts = new set();
        const iteration = async (nodeLoop, firstTime) => {
            isDetailMood = localStorage.getItem("detail-mode")
            if (isDetailMood && isDetailMood !== 'false') {
                await waitTillUserClick()}
            NodeList.push(nodeLoop);
            draw(nodeLoop.node, firstTime ? entry : scaning , {animationDuration:500});
            firstTime ? delayTime = (5 - localStorage.getItem("algorithm_speed")) * 20 + 2 : 15;
            writeIn(nodeLoop.node, `c:${nodeLoop.cost}`)
            if (nodeLoop.node.className === target) {
                visPath(nodeLoop);
                return resolve();
            }
            const res = await onWaiting(delayTime);
            possibleRouts.delete(nodeLoop);
            findNeighbours(nodeLoop.node).forEach((item) => {
                const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 30 : 1));
                isDetailMood && draw(item, candidate)
                isDetailMood && writeIn(item , `c:${newNode.cost}`)
                possibleRouts.add(newNode);
            });
            iteration(possibleRouts.findBestNode());
        };
        return iteration(startingNode, true);
    })
};

//disable animations 

const clearBoard = (nodes) => {
    nodes.forEach((cellNode) => {
        if(!(cellNode.node.className == wall || cellNode.node.className == weight)) {
         draw(cellNode.node, cell)   
        writeIn(cellNode.node, '') 
        } 
    })
}

export const normalDijkestras_realTime = (startingNode) => {
        const possibleRouts = new set();
        const iteration = (nodeLoop, firstTime) => {
            if(firstTime){
                clearBoard(NodeList)
                NodeList = []
            }
            NodeList.push(nodeLoop);
            draw(nodeLoop.node, firstTime ? entry : scaning);
            if (nodeLoop.node.className === target) {
                    const revPath = [];
                    while (nodeLoop.orgin !== null) {
                        revPath.push(nodeLoop.node);
                        nodeLoop = nodeLoop.orgin;
                    }
                    for (let i = revPath.length - 1; i >= 0; i--) {
                        draw(revPath[i], path);
                    }
                return 
            }
            possibleRouts.delete(nodeLoop);
            findNeighbours(nodeLoop.node).forEach((item) => {
                const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 30 : 1));
                possibleRouts.add(newNode);
            });
            iteration(possibleRouts.findBestNode());
        };
        return iteration(startingNode, true);
};