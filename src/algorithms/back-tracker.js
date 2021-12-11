import { findNeighbours } from "../helpers/neighbours.js"
import { draw } from "../helpers/draw.js"
import {dimentions as DM} from '../utils/config.js'
import {cells} from '../index.js'
import { onWaiting } from "../helpers/wait.js"

const dimentions = new DM()

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min) ;
}

const WIDTH = dimentions.getWidth()
const HEIGHT = dimentions.getHeight()

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const cell = 'cell'


const FillBoard = async ()=>{
    for(let i =0 ; i<HEIGHT ; i++){
        await onWaiting(150)
        for(let j=0 ; j<WIDTH ; j++){
            draw(cells[WIDTH*i +j] , wall)
        }
    }
}

const findInBetween = (Node1 , Node2)=>{
    const diffrence = parseInt(Node2.id) - parseInt(Node1.id);
    const nodeIndex = parseInt(Node1.id)

    if(diffrence === WIDTH *2){
        //console.log('its down')
        return cells[nodeIndex + WIDTH]
    }
    else if (diffrence === WIDTH* -2 ){
        //console.log('its down')
        return cells[nodeIndex - WIDTH]
    }
    else if (diffrence === -2){
        //console.log('its back')
        return cells[nodeIndex -1]
    }
    else if( diffrence === 2){
        //console.log('its forward')
        return cells[nodeIndex + 1]
    }
}


const visitedNodes = []
let i = 0
export const backTracker = async (NodeCell , firstTime)=>{
    i++;
    if(firstTime) {
        visitedNodes.push(NodeCell)
        await FillBoard()
    }
    if(visitedNodes.length === 0) return

    const possibleRouts =  findNeighbours(visitedNodes[visitedNodes.length -1] , 2 , true).filter((routItem)=>routItem.className !== 'cell')
    if(possibleRouts.length === 0) {
        visitedNodes.pop()
    }else{
        //console.log(i)
        //console.log(possibleRouts)
        const randomNode = possibleRouts[getRandomArbitrary(0,possibleRouts.length)]
        //console.log(randomNode)
        visitedNodes.push(randomNode)
        //draw what you did 
        await onWaiting(100)
        //console.log(visitedNodes)
        //find what is in between 
        const betWeenCell = findInBetween(NodeCell , visitedNodes[visitedNodes.length-1])
        draw(betWeenCell , cell)
        draw(visitedNodes[visitedNodes.length-1] , cell)
    }
    //findNeighbours(NodeCell , 2).map((NodeItem)=> draw(NodeItem , wall)) 
    backTracker(visitedNodes[visitedNodes.length-1])
}