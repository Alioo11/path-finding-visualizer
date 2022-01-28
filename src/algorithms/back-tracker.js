import { findNeighbours, findNeighbours2 } from "../helpers/neighbours.js"
import { draw } from "../helpers/draw.js"
import { dimentions as DM } from '../utils/config.js'
import { cells } from '../index.js'
import { onWaiting } from "../helpers/wait.js"

const dimentions = new DM()

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

let delayTime = 0

const WIDTH = dimentions.getWidth()
const HEIGHT = dimentions.getHeight()

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const cell = 'cell'


const FillBoard = async () => {
    for (let i = 0; i < HEIGHT; i++) {
        await onWaiting(2)
        for (let j = 0; j < WIDTH; j++) {
            draw(cells[WIDTH * i + j], wall)
        }
    }
}

const findInBetween = (Node1, Node2) => {
    const diffrence = parseInt(Node2.id) - parseInt(Node1.id);
    const nodeIndex = parseInt(Node1.id)

    if (diffrence === WIDTH * 2) {
        //console.log('its down')
        return cells[nodeIndex + WIDTH]
    }
    else if (diffrence === WIDTH * -2) {
        //console.log('its down')
        return cells[nodeIndex - WIDTH]
    }
    else if (diffrence === -2) {    
        //console.log('its back')
        return cells[nodeIndex - 1]
    }
    else if (diffrence === 2) {
        //console.log('its forward')
        return cells[nodeIndex + 1]
    }
}


const visitedNodes = []
let i = 0
export const backTracker = (NodeCell) => {
    return new Promise ((resolve , reject)=>{

    
    const iteration = async (NodeCell, firstTime)=>{
    i++;
    if (firstTime) {
        delayTime = localStorage.getItem("maze_speed") ? (5 - localStorage.getItem("maze_speed")) * 80 + 20 : 30
        visitedNodes.push(NodeCell)
        await FillBoard()
    }
    if (visitedNodes.length === 0) {
        return resolve()
    }
  
    const possibleRouts = findNeighbours2(visitedNodes[visitedNodes.length - 1], 2).filter((routItem) => routItem.className !== 'cell')
    if (possibleRouts.length === 0) {

        visitedNodes.pop()
    } else {
        draw(NodeCell, path)
        await onWaiting(delayTime)
        const randomNode = possibleRouts[getRandomArbitrary(0, possibleRouts.length)]
        visitedNodes.push(randomNode)
        const betWeenCell = findInBetween(NodeCell, visitedNodes[visitedNodes.length - 1])
        draw(betWeenCell, cell , {animationDuration:1000})
    }
    draw(NodeCell, cell)
    iteration(visitedNodes[visitedNodes.length - 1])
}
return iteration (NodeCell , true)})
}