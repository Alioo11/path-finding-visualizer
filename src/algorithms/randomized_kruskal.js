import { findNeighbours, findNeighbours2 } from "../helpers/neighbours.js"
import { draw, writeIn } from "../helpers/draw.js"
import { dimentions as DM } from '../utils/config.js'
import { cells } from '../index.js'
import { onWaiting } from "../helpers/wait.js"
import { waitTillUserClick } from '../index.js'

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'
const cell = "cell"

const dimentions = new DM()

const WIDTH = dimentions.getWidth();
const HEIGHT = dimentions.getHeight()

// hello this is the randomized kruskal hahaha 

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
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



//? ***************************************** MATSET *************************************//

function MatSet() {
    let collection = []
    let length = 0

    this.init = (initialValue) => {
        collection = initialValue
        length = initialValue.length
    }
    this.items = () => {
        return collection
    }
    this.size = () => {
        return length
    }
    this.findSequence = (arr) => {
        let found
        for (let i = 0; i < collection.length; i++) {
            found = collection[i].every((colItemItem, index) => {
                return colItemItem == arr[index]
            })
            if (found) return collection[i]
        }
        return null
    }
    this.findSequenceIndex = (arr) => {
        let found
        for (let i = 0; i < collection.length; i++) {
            found = collection[i].every((colItemItem, index) => {
                return colItemItem == arr[index]
            })
            if (found) return i
        }
        return null
    }
    this.findOne = (num) => {
        let found
        for (let i = 0; i < collection.length; i++) {
            found = collection[i].includes(num)
            if (found) return collection[i]
        }
        return null
    }
    this.remove = (arr) => {
        //? find the array 
        const index = this.findSequenceIndex(arr)
        if (index === null) return false
        collection = collection.slice(0, index).concat(collection.slice(index + 1, collection.length))
    }
    this.pushTo = (arr, content) => {
        const index = this.findSequenceIndex(arr)
        if (index == null) return false
        collection = collection.map((item, idx) => {
            if (idx == index) {
                return item.concat(content)
            }
            else {
                return item
            }
        })
    }
}

//? ***************************************** MATSET *************************************//

const FillBoard = async () => {
    for (let i = 0; i < HEIGHT; i++) {
        await onWaiting(2)
        for (let j = 0; j < WIDTH; j++) {
            draw(cells[WIDTH * i + j], wall)
           // writeIn(cells[WIDTH * i + j] , WIDTH * i +j)
        }
    }
}


const initGrid3 = () => {
    const grid = new MatSet()
    const items = Array.from(Array.from(Array(WIDTH * HEIGHT).keys()),
        (item) =>
            [item]).filter((item) =>
                (item % WIDTH) % 2 !== 0 &&
                parseInt(item / WIDTH) % 2 !== 0)
    //console.table(grid)
    grid.init(items)
    return grid
}


const InitiGrid2 = () => {
    const grid = Array.from(Array.from(Array(WIDTH * HEIGHT).keys()),
    (item) =>
    [item]).filter((item) =>
    (item% WIDTH) % 2 !== 0 &&
    parseInt(item/WIDTH) % 2 !== 0)
    //console.table(grid)
    return grid
}

export const randomized_kruskal2 = async () => {
    const  grid = initGrid3()
    const iteration = async (firstTime)=>{
        await onWaiting(10)
        firstTime && await FillBoard()
        if(grid.items().length === 1) return 
        const randomArray = grid.items()[getRandomArbitrary(0 , grid.items().length)]
        const randomItem = randomArray.length >1 ? randomArray[getRandomArbitrary(0 , randomArray.length)] : randomArray[0]
        const  neighbours = findNeighbours2(cells[randomItem],2)
        if(neighbours.length === 0){
            console.log('%c neighours empty' , 'background : purple')
            iteration()
            return
            }
        const randomNeighbour = neighbours.length > 1 ? neighbours[getRandomArbitrary(0, neighbours.length)] : neighbours[0];
        const inBetWeen = findInBetween(cells[randomItem] , randomNeighbour)
        const firstSequence = grid.findOne(randomItem)
        const secondSequence = grid.findOne(parseInt(randomNeighbour.id))
        const isSameArray = firstSequence.every((seqItem , idx)=>{
            return seqItem === secondSequence[idx]
        })
        if(isSameArray){ 
            iteration()
            return
        }
        draw(cells[randomItem], cell)
        draw(inBetWeen, cell)
        draw(randomNeighbour, cell)
        grid.pushTo( firstSequence , secondSequence )
        grid.remove(secondSequence)
        iteration() 
    }
    iteration(true)
}
