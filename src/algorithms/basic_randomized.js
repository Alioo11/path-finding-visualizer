import { findNeighbours, findNeighbours2 } from "../helpers/neighbours.js"
import { draw } from "../helpers/draw.js"
import { dimentions as DM } from '../utils/config.js'
import { cells } from '../index.js'
import { onWaiting } from "../helpers/wait.js"

const wall = 'wall'
const weight = 'weight'
const dimentions = new DM()

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

let delayTime = 0

const WIDTH = dimentions.getWidth()
const HEIGHT = dimentions.getHeight()

export const basicRandom = async () => {
    for (let i = 0; i < 100 ; i++) {
        await onWaiting(5)
        draw(cells[getRandomArbitrary(0,cells.length)], wall, { animationDuration: 1000 })
        draw(cells[getRandomArbitrary(0, cells.length)], weight, { animationDuration: 1000 })
    }
}