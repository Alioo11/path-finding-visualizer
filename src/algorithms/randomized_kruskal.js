import { findNeighbours, findNeighbours2 } from "../helpers/neighbours.js"
import { draw } from "../helpers/draw.js"
import { dimentions as DM } from '../utils/config.js'
import { cells } from '../index.js'
import { onWaiting } from "../helpers/wait.js"


const dimentions = new DM()

const WIDTH = dimentions.getWidth();
const HEIGHT = dimentions.getHeight()


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


const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";
const weight = 'weight'
const cell = "cell"

//? ***************************************** LINKED LIST *************************************//

function LinkedList() {
    var length = 0;
    var head = null;

    var Node = function (element) {
        this.element = element;
        this.next = null;
    };

    this.size = function () {
        return length;
    };

    this.head = function () {
        return head;
    };

    this.print = function (){
        let currentNode = head
        let str = []
        while(currentNode){
            //console.log(currentNode.element)
            str.push(currentNode.element)
            currentNode = currentNode.next
        }
        console.log(str.join("_"));
    }

    this.add = function (element) {
        var node = new Node(element);
        if (head === null) {
            head = node;
        } else {
            var currentNode = head;

            while (currentNode.next) {
                currentNode = currentNode.next;
            }

            currentNode.next = node;
        }

        length++;
    };

    this.remove = function (element) {
        var currentNode = head;
        var previousNode;
        if (currentNode.element === element) {
            head = currentNode.next;
        } else {
            while (currentNode.element !== element) {
                previousNode = currentNode;
                currentNode = currentNode.next;
            }

            previousNode.next = currentNode.next;
        }

        length--;
    };

    this.isEmpty = function () {
        return length === 0;
    };

    this.indexOf = function (element) {
        var currentNode = head;
        var index = -1;

        while (currentNode) {
            index++;
            if (currentNode.element === element) {
                return index;
            }
            currentNode = currentNode.next;
        }

        return -1;
    };

    this.elementAt = function (index) {
        var currentNode = head;
        var count = 0;
        while (count < index) {
            count++;
            currentNode = currentNode.next
        }
        return currentNode.element;
    };


    this.addAt = function (index, element) {
        var node = new Node(element);

        var currentNode = head;
        var previousNode;
        var currentIndex = 0;

        if (index > length) {
            return false;
        }

        if (index === 0) {
            node.next = currentNode;
            head = node;
        } else {
            while (currentIndex < index) {
                currentIndex++;
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
            node.next = currentNode;
            previousNode.next = node;
        }
        length++;
    }

    this.removeAt = function (index) {
        var currentNode = head;
        var previousNode;
        var currentIndex = 0;
        if (index < 0 || index >= length) {
            return null
        }
        if (index === 0) {
            head = currentNode.next;
        } else {
            while (currentIndex < index) {
                currentIndex++;
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
            previousNode.next = currentNode.next
        }
        length--;
        return currentNode.element;
    }

}
//? ***************************************** LINKED LIST *************************************//

const InitiGrid = ()=>{
    const grid = new LinkedList()
    for(let i =0 ; i< HEIGHT ; i++){
        for(let j =0 ; j < WIDTH ; j++){
            if(i%2 !== 0 && j%2 !== 0){
                grid.add(WIDTH * i + j)
                //draw(cells[WIDTH * i + j] , wall)
            }
            
        }
    }
    return grid
}

export const kruskal = async ()=>{
    const grid =  InitiGrid()
    const iteration = async ()=>{
        grid.print()
        if( grid.size== 1) return
        let currentGridNode = grid.head()
        let interator = 0;
        const randomFactor = getRandomArbitrary(0 , grid.size())
        while(interator !== randomFactor){
            currentGridNode = currentGridNode.next
            interator +=1
        }
        const nodeNeibours =  findNeighbours2(cells[currentGridNode.element] , 2)
        const randomNeibour = nodeNeibours[getRandomArbitrary(0, nodeNeibours.length)]
        const between = findInBetween(cells[currentGridNode.element], cells[randomNeibour.id])
        grid.remove(currentGridNode.element)
        cells[parseInt(randomNeibour.id)].className =='cell' && grid.remove(parseInt(randomNeibour.id))
        draw(cells[currentGridNode.element],wall, {animationDuration:100})
        await onWaiting(5)
        draw(cells[between.id], wall, { animationDuration: 100 })
        await onWaiting(5)
        draw(cells[parseInt(randomNeibour.id)], wall, { animationDuration: 100 })
        await onWaiting(5) 
        iteration()
    }
    iteration()
}
