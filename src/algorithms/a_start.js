import { draw, writeIn } from "../helpers/draw.js";
import { onWaiting } from './../helpers/wait.js'
import { findNeighbours } from "../helpers/neighbours.js";
import { visPath } from './../helpers/visPath.js'
import { distance } from "../helpers/distance.js";
import { dimentions } from "../utils/config.js";
import { waitTillUserClick} from '../index.js'

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'
const candidate = 'candidate'

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
      return all.cost + all.heuristic * 2 > current.cost + current.heuristic * 2 ? current : all;

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

export const a_start = (startNode, endNode) => {
  //console.log(startNode , endNode)
  const visitedNodes = []
  const interation = async (NodeCell, firstTime = true) => {
    const possibleNodes = []
    if (NodeCell.node.className === target) {
      //? found the target node 
      visPath(NodeCell);
      return;
    }
    draw(NodeCell.node, firstTime ? scaning : scaning);

    writeIn(NodeCell.node, `C:${NodeCell.cost} <br/> H:${NodeCell.cost == '0' ? 0 : NodeCell.heuristic}`)
    const possibleRout = findNeighbours(NodeCell.node, 1)
    if (possibleRout.length == 0) {
      if (visitedNodes.length === 0) alert('there is no way out  !')
      visitedNodes.pop()
      interation(visitedNodes[visitedNodes.length - 1])
    } else {
      const res = await onWaiting(50);
      visitedNodes.push(NodeCell)
      possibleRout.forEach((item) => {
        const cost = NodeCell.cost + (item.className === weight ? 10 : 1);
        const heuristic = distance(item, endNode);
        console.log(distance(item, endNode))
        console.log(NodeCell.cost + (item.className === weight ? 10 : 1))
        const NewNode = new Node(item, NodeCell, scaning, cost, heuristic)
        possibleNodes.push(NewNode)
      })
      const bestNode = possibleNodes.reduce((all, current) => {
        return all.cost + all.heuristic > current.cost + current.heuristic ? current : all;
      })
      interation(bestNode)
    }
  }
  interation(startNode, true)
}

export const a_start2 = (startingNode, endNode) => {
  const NodeList = [];
  const possibleRouts = new set();
  const iteration = async (nodeLoop, firstTime) => {
    isDetailMood = localStorage.getItem("detail-mode")
    if (isDetailMood && isDetailMood !== 'false') {
      await waitTillUserClick()
    }
    NodeList.push(nodeLoop);
    draw(nodeLoop.node, firstTime ? entry : scaning);
    writeIn(nodeLoop.node, `C:${nodeLoop.cost} <br/> H:${nodeLoop.cost == 0 ? 0 : nodeLoop.heuristic}`)
    if (nodeLoop.node.className === target) {
      visPath(nodeLoop);
      return;
    }
    const res = await onWaiting(50);
    possibleRouts.delete(nodeLoop);
    findNeighbours(nodeLoop.node).forEach((item) => {
      const cost = nodeLoop.cost + (item.className === weight ? 10 : 1);
      const heuristic = distance(item, endNode);
      const newNode = new Node(item, nodeLoop, scaning, cost, heuristic);
      isDetailMood && draw(item, candidate)
     // isDetailMood && writeIn(item, `c:${newNode.cost}`)
      isDetailMood && writeIn(item , `C:${newNode.cost} <br/> H:${newNode.cost == 0 ? 0 : newNode.heuristic}`)
      possibleRouts.add(newNode);
    });
    iteration(possibleRouts.findBestNode());
  };
  return iteration(startingNode, true);
};