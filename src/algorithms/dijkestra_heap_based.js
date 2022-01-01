import { draw, writeIn } from "../helpers/draw.js";
import Node from '../helpers/Node.js'
import Myset from "../helpers/mySet.js";
import { onWaiting } from '../helpers/wait.js'
import { findNeighbours } from "../helpers/neighbours.js";
import { visPath } from '../helpers/visPath.js'

//! this is a test case 
let MinHeap = function () {

  let heap = [null];

  this.insert = function (node) {
    const alreadyHaveItem = heap.reduce((finalRes = false, item) => item.node?.id === node.node?.id ? finalRes = true : finalRes = finalRes)
    if (alreadyHaveItem) return
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
        return smallest;
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
    // console.log('%c removing this item :', "background : red")
    // console.log(smallest)
    // console.log("%cthis is the result after removing what I told you", "background : purple")
    // console.table(heap)
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

let delayTime = 0;

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'

let count = 0

export const dijkestra = async (startingNode) => {
  return new Promise((resolve, reject) => {
    const NodeList = [];
    const possibleRouts = new MinHeap();
    const iteration = async (nodeLoop, firstTime) => {
      // console.log(`%c${count}`, "background : blue ")
      // console.log('%c this is the one choosen from the last time', "background : green")
      // console.log(nodeLoop)
      NodeList.push(nodeLoop);
      draw(nodeLoop.node, firstTime ? entry : scaning);
      firstTime ? delayTime = (5 - localStorage.getItem("algorithm_speed")) * 20 + 2 : 15;
      writeIn(nodeLoop.node, `c:${nodeLoop.cost}`)
      if (nodeLoop.node.className === target) {
        visPath(nodeLoop);
        return resolve();
      }
      const res = await onWaiting(delayTime);

      findNeighbours(nodeLoop.node).forEach((item) => {
        const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + (item.className === weight ? 10 : 1));
        possibleRouts.insert(newNode);
      });
      iteration(possibleRouts.best());
      possibleRouts.remove();
      count++;

    };
    return iteration(startingNode, true);
  })
};