import {draw} from './helpers/draw.js'
import Node from './helpers/Node.js'
import {dijkestra} from './algorithms/dijkestra.js'
import {backTracker} from './algorithms/back-tracker.js'
import {dimentions as DM} from './utils/config.js'

const dimentions = new DM()

let step = 0;
let entryNode = null;
let targetNode = null;

const WIDTH = dimentions.getWidth();
const HEIGHT = dimentions.getHeight()
let isXActive = false;

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";

const board = document.getElementsByClassName("board");
const startBtn = document.getElementById('start_btn')

startBtn.addEventListener('click' , ()=>{
  startVis()
})

const createBoard = (width, height) => {
  for (let i = 0; i < width * height; i++) {
    board[0].innerHTML += `<div id="${i}" class="cell"></div>`;
  }
};

createBoard(WIDTH, HEIGHT);

export const cells = document.querySelectorAll(".cell");


const handleSenario = (NodeCell)=>{
  switch(step){
    case 0:{
      backTracker(NodeCell , true)
      step +=1;
      break;
    }
    case 1:{
      draw(NodeCell , target)
      step +=1
      console.log(step)
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

const startVis = ()=>{
  if(step ===3 && entryNode){
    dijkestra(new Node(entryNode, null, entry, 0))
  }
}

cells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
    //backTracker(e.target , true)
    handleSenario (e.target)
    //dijkestra(new Node(e.target, null, entry, 0));
    //draw(e.target , wall)
  });
});

window.addEventListener("keydown", (e) => {
  isXActive = e.key === "x";
});
window.addEventListener("keyup", (e) => {
  isXActive = !(e.key === "x");
});

cells.forEach((cell) => {
  cell.addEventListener("mouseover", (e) => {
    isXActive && draw(e.target, wall);
  });
});
