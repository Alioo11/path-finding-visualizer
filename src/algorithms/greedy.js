import { draw, writeIn } from "../helpers/draw.js";
import { onWaiting } from './../helpers/wait.js'
import { findNeighbours } from "../helpers/neighbours.js";
import { visPath } from './../helpers/visPath.js'
import { distance } from "../helpers/distance.js";
import { dimentions } from "../utils/config.js";
import { waitTillUserClick } from '../index.js'
import { nodeTypes } from "../utils/config.js";

const {
    scaning ,
    path ,
    wall ,
    target ,
    entry , 
    weight , 
    candidate ,
    cell} = nodeTypes


const clearBoard = (nodes) => {
    nodes.forEach((cellNode) => {
        if (!(cellNode.node.className == wall || cellNode.node.className == weight)) {
            draw(cellNode.node, cell)
            writeIn(cellNode.node, '')
        }
    })
}
let isDetailMood = localStorage.getItem('detail-mode') ? localStorage.getItem('detail-mode') : false

function Node(node, orgin, type, cost, heuristic) {
    this.node = node;
    this.orgin = orgin;
    this.type = type;
    this.cost = cost;
    this.heuristic = heuristic;
}

function Myset() {
    this.collection = [];
    this.bestNode = null;
    this.add = (Node) => {
        const haveItem =
            this.collection.filter((item) => item.node?.id == Node.id).length > 0;
        if (!haveItem) {
            this.collection.push(Node);
        } else {
            this.collection = this.collection.filter(
                (item) => item.node?.id !== Node.id
            );
        }
    };
    this.delete = (Node) => {
        this.collection = this.collection.filter(
            (collectionItem) => collectionItem?.node?.id !== Node.node.id
        );
        return this.collection;
    };
    this.findBestNode = () => {
        this.bestNode = this.collection.reduce((all, current) => {
            return all.heuristic > current.heuristic  ? current : all;

        });
        // console.log(this.bestNode)
        return this.bestNode;
    };
    this.reSort = () => {
        return this.collection.sort((a, b) => a.cost - b.cost);
    };
    this.show = () => {
        console.log(this.collection);
    };
    this.col = () => {
        return this.collection;
    };
}
const set = Myset
let delayTime = 0
let NodeList = [];
export const greedy = (startingNode, endNode) => {
    const possibleRouts = new set();
    const iteration = async (nodeLoop, firstTime) => {
        firstTime ? delayTime = (5 - localStorage.getItem("algorithm_speed")) * 20 + 2 : 15;
        isDetailMood = localStorage.getItem("detail-mode")
        if (isDetailMood && isDetailMood !== 'false') {
            await waitTillUserClick()
        }
        NodeList.push(nodeLoop);
        draw(nodeLoop.node, firstTime ? entry : scaning , {animationDuration:500});
        if (nodeLoop.node.className === target) {
            visPath(nodeLoop);
            return;
        }
        const res = await onWaiting(delayTime);
        possibleRouts.delete(nodeLoop);
        findNeighbours(nodeLoop.node).forEach((item) => {
            const cost = nodeLoop.cost + (item.className === weight ? 10 : 1);
            const heuristic = distance(item, endNode);
            const newNode = new Node(item, nodeLoop, scaning, cost, heuristic);
            //console.log(isDetailMood);
            isDetailMood && draw(item, candidate)
            isDetailMood && writeIn(item, `H:${newNode.cost == 0 ? 0 : newNode.heuristic}`)
            possibleRouts.add(newNode);
        });
        iteration(possibleRouts.findBestNode());
    };
    return iteration(startingNode, true);
};

export const greedy_realTime = (startingNode, endNode) => {
    const possibleRouts = new set();
    const iteration =  (nodeLoop, firstTime) => {
        if(firstTime){
            clearBoard(NodeList)
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
            const cost = nodeLoop.cost + (item.className === weight ? 10 : 1);
            const heuristic = distance(item, endNode);
            const newNode = new Node(item, nodeLoop, scaning, cost, heuristic);

            possibleRouts.add(newNode);
        });
        if(possibleRouts.col().length === 0){
            return
        }
        iteration(possibleRouts.findBestNode());
    };
    return iteration(startingNode, true);
};