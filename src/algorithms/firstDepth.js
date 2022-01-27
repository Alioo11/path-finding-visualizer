import { draw, writeIn } from "../helpers/draw.js";
import { onWaiting } from './../helpers/wait.js'
import { findNeighbours, findNeighbours2 } from "../helpers/neighbours.js";
import { visPath } from './../helpers/visPath.js'
import { waitTillUserClick } from '../index.js'


function Node(node, orgin, type, cost, depth) {
    this.node = node;
    this.orgin = orgin;
    this.type = type;
    this.cost = cost;
    this.depth = depth
}



function set() {
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
            return all.cost > current.cost ? current : all;
        });
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
                await waitTillUserClick()
            }
            NodeList.push(nodeLoop);
            draw(nodeLoop.node, firstTime ? entry : scaning, { animationDuration: 500 });
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
                isDetailMood && writeIn(item, `c:${newNode.cost}`)
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
        if (!(cellNode.node.className == wall || cellNode.node.className == weight)) {
            draw(cellNode.node, cell)
            writeIn(cellNode.node, '')
        }
    })
}

export const first_depth = (startingNode) => {
     const possibleRouts = new set();
    const iteration = async (nodeLoop, firstTime) => {
        if (firstTime) {
            clearBoard(NodeList)
            NodeList = []
        }
        await onWaiting(300)
        NodeList.push(nodeLoop);
        draw(nodeLoop.node, firstTime ? entry : scaning , {animationDuration:500});
        writeIn(nodeLoop.node , nodeLoop.depth)
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
        possibleRouts.delete(nodeLoop)
        const bestMove = findNeighbours(nodeLoop.node).map((item) => {
            const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 30 : 1), nodeLoop.depth + 1);
            possibleRouts.add(newNode)
            return newNode
        })
        //console.table(bestMove)
        if (bestMove[0].depth == 8){
            iteration(possibleRouts.findBestNode())
        }else if(bestMove[0].depth <= 8){
         iteration(bestMove[0])   
        }else{
            console.log('%c warning : maximum depth extended ! ' , 'color : red ; background : yellow ; border-radius : 5px ; font-size : 20px')
            return
        }
        
    };
    return iteration({ ...startingNode, depth: 0 }, true);
};