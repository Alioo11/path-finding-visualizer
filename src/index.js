import {draw , writeIn} from './helpers/draw.js'
import Node from './helpers/Node.js'
import {dijkestra} from './algorithms/dijkestra.js'
import {backTracker} from './algorithms/back-tracker.js'
import {dimentions as DM} from './utils/config.js'
import { findNeighbours, findNeighbours2 } from './helpers/neighbours.js'
import { distance } from './helpers/distance.js'
import { a_start2 } from './algorithms/a_start.js'

const dimentions = new DM()

let step = 0;
let entryNode = null;
let targetNode = null;

const WIDTH = dimentions.getWidth();
const HEIGHT = dimentions.getHeight()

let isXActive = false;
let isWActive = false;
let isEActive = false;

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'
const cell = "cell"

const board = document.getElementsByClassName("board");
const startBtn = document.getElementById('start_btn')

startBtn.addEventListener('click' , ()=>{
  console.time()
  startVis()
  console.timeEnd()
})

const createBoard = (width, height) => {
  board[0].innerHTML =  Array.from(Array.from(Array(width*height).keys()),(item)=>`<div id='${item}' class='cell'></div>`).join().replace(/,/g,"")
};


board[0].style.gridTemplateColumns = `repeat( ${ WIDTH } , 30px)`

createBoard(WIDTH, HEIGHT);

export const cells = document.querySelectorAll(".cell");


const handleSenario = (NodeCell)=>{
  switch(step){
    case 0:{
      backTracker(cells[WIDTH +1] , true)
      step +=1;
      break;
    }
    case 1:{
      draw(NodeCell , target)
      targetNode = NodeCell;
      step +=1
      break;
    }
    case 2:{
      draw ( NodeCell , entry)
      entryNode = NodeCell
      step +=1
      break;
    }
  }
}

//? xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
let node1 = null
let node2 = null
const handleTestSenario = (NodeCell)=>{
  switch(step){
    case 0:{
      node1 = NodeCell
      draw(NodeCell , wall)
      step +=1;
      break;
    }
    case 1:{
      node2 = NodeCell
      draw(NodeCell , wall)
      distance(node1 , node2)
      step +=1
      break;
    }
  }
}
//? xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

const startVis = ()=>{
  if(step ===3 && entryNode){
    //dijkestra(new Node(entryNode, null, entry, 0))
    a_start2(new Node(entryNode, null, entry, 0) , targetNode )
  }
}

cells.forEach((cellItem) => {
  cellItem.addEventListener("click", (e) => {
    //findNeighbours2(e.target,1 ,[cell , wall]).map((nodeItem)=> console.log(nodeItem))
    //backTracker(e.target , true)
    handleSenario (e.target)
    //handleTestSenario(e.target)
    //dijkestra(new Node(e.target, null, entry, 0));
    //draw(e.target , wall)
  });
});

window.addEventListener("keydown", (e) => {
  isXActive = e.key === "x";
  isWActive = e.key === "w";
  isEActive = e.key === "e";
});
window.addEventListener("keyup", () => {
  isXActive = false;
  isWActive = false;
  isEActive = false;
});

cells.forEach((cellNode) => {
  cellNode.addEventListener("mouseover", (e) => {
    //isXActive && draw(e.target, weight);
    if(isXActive){
      draw(e.target , weight)
      writeIn(e.target , 10)
    }
    if(isWActive){
      draw(e.target , wall)
    }
      if(isEActive){
      draw(e.target , cell)
    }
  });
});
