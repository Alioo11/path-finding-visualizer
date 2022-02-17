import { draw, writeIn } from "../helpers/draw.js";
import Node from '../helpers/Node.js'
import Myset from "../helpers/mySet.js";
import { onWaiting } from '../helpers/wait.js'
import { findNeighbours } from "../helpers/neighbours.js";
import { visPath } from '../helpers/visPath.js'
import BST from '../helpers/BST.js'
import { waitTillUserClick} from '../index.js'

//?this is a BST 

//?this is a BST


const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'
const candidate = 'candidate'
const cell = 'cell'
const clearBoard = (nodes) => {
  nodes.forEach((cellNode) => {
    if (!(cellNode.node.className == wall || cellNode.node.className == weight)) {
      draw(cellNode.node, cell)
      writeIn(cellNode.node, '')
    }
  })
}

let isDetailMood = localStorage.getItem('detail-mode') ? localStorage.getItem('detail-mode') : false

//! this is a test case 
let MinHeap = function () {

  let heap = [null];
  let binarySearchTree = new BST()
  this.insert = function (node) {
    const alreadyHaveItem = binarySearchTree.find(parseInt(node.node?.id))
    //const alreadyHaveItem = heap.reduce((finalRes = false, item) => item.node?.id === node.node?.id ? finalRes = true : finalRes = finalRes)
    if (alreadyHaveItem) return
    binarySearchTree.add(parseInt(node.node?.id))
    heap.push(node);
    if (heap.length > 2) {
      let idx = heap.length - 1;
      while (heap[idx].cost < heap[Math.floor(idx / 2)].cost) {
        if (idx >= 1) {
          [heap[Math.floor(idx / 2)].cost, heap[idx].cost] = [heap[idx].cost, heap[Math.floor(idx / 2)].cost];
          if (Math.floor(idx / 2) > 1) {
            idx = Math.floor(idx / 2);
          } else {
            break;
          };
        };
      };
    };
  };

  this.remove = function () {
    let smallest = heap[1];
    if (heap.length > 2) {
      heap[1] = heap[heap.length - 1];
      heap.splice(heap.length - 1);
      if (heap.length == 3) {
        if (heap[1].cost > heap[2].cost) {
          [heap[1], heap[2]] = [heap[2], heap[1]];
        };
        return smallest ;
      };
      let i = 1;
      let left = 2 * i;
      let right = 2 * i + 1;
      while (heap[i]?.cost >= heap[left]?.cost || heap[i]?.cost >= heap[right]?.cost) {
        if (heap[left].cost < heap[right].cost) {
          [heap[i], heap[left]] = [heap[left], heap[i]];
          i = 2 * i
        } else {
          [heap[i], heap[right]] = [heap[right], heap[i]];
          i = 2 * i + 1;
        };
        left = 2 * i;
        right = 2 * i + 1;
        if (heap[left]?.cost == undefined || heap[right]?.cost == undefined) {
          break;
        };
      };
    } else if (heap.length == 2) {
      heap.splice(1, 1);
    } else {
      return null;
    };
    binarySearchTree.remove(parseInt(smallest.node.id))
    return smallest;
  };
  this.items = function () {
    return heap
  }
  this.best = function () {
    return heap[1]
  }
};


//! this is a test case

//const set = Myset

let NodeList = [];

let delayTime = 0;


let count = 0

export const dijkestra = async (startingNode) => {
  return new Promise((resolve, reject) => {

    const possibleRouts = new MinHeap();
    const iteration = async (nodeLoop, firstTime) => {
      isDetailMood = localStorage.getItem("detail-mode")
      if (isDetailMood && isDetailMood !== 'false') {
        await waitTillUserClick()
      }
      NodeList.push(nodeLoop);
      draw(nodeLoop.node, firstTime ? entry : scaning , {animationDuration:500});
      firstTime ? delayTime = (5 - localStorage.getItem("algorithm_speed")) * 20 + 2 : 15;
      writeIn(nodeLoop.node, `c:${nodeLoop.cost}`)
      if (nodeLoop.node.className === target) {
        visPath(nodeLoop);
        return resolve();
      }
      const res = await onWaiting(delayTime);

      findNeighbours(nodeLoop.node).forEach((item) => {
        const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 10 : 1));
        isDetailMood && draw(item, candidate)
        isDetailMood && writeIn(item, `c:${newNode.cost}`)
        possibleRouts.insert(newNode);
      });
      iteration(possibleRouts.best());
      possibleRouts.remove();
      count++;

    };
    return iteration(startingNode, true);
  })
};

export const dijkestra_realTime =  (startingNode) => {
    const possibleRouts = new MinHeap();
    const iteration = async  (nodeLoop, firstTime) => {
      count ++
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
      findNeighbours(nodeLoop.node).forEach((item) => {
        const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 10 : 1));

        possibleRouts.insert(newNode);
      });
      possibleRouts.remove();
      
      iteration(possibleRouts.best());
      
    };
    return iteration(startingNode, true);
};