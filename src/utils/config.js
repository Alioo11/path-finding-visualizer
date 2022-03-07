const windowWidth = window.innerWidth
const windowHeight = window.innerHeight;

const calculateWidth = ()=>{
    return ((parseInt(windowWidth / 30) - 2) % 2 === 0 ? (parseInt(windowWidth / 30) -  3 ) : (parseInt(windowWidth / 30) - 2))
}

const calculateHeight = ()=>{
    return parseInt(windowHeight/30)%2 ==0 ?  (parseInt(windowHeight / 30) - 5)  :  (parseInt(windowHeight / 30) - 4) 
}

export function dimentions() {
    let WIDTH = calculateWidth() + (windowWidth >500 ? 0 : 4)
    let HEIGHT = calculateHeight()
    let running = false;
    let algorithm = null
    let mazeAlgorithm = null;

    localStorage.setItem("WIDTH" , WIDTH)
    localStorage.setItem("HEIGHT" , HEIGHT)


    this.getWidth = () => WIDTH
    this.getHeight = () => HEIGHT
    this.getAlgorithm = () => algorithm
    this.getMazeAlgorithm = () => mazeAlgorithm
    this.getRunning = () => running

    this.swapRunning = () => {
        running = !running
    }

    this.setAlgorithm = (newAlgorithm) => {
        algorithm = newAlgorithm
    }

    this.setMazeAlgorithm = (newMazeAlgorithm) => {
        mazeAlgorithm = newMazeAlgorithm
    }

    this.setWidth = (newWidth) => {
        WIDTH = newWidth
        console.log(WIDTH)
    }

    this.setHeight = (newHeight) => {
        HEIGHT = newHeight
    }
}
export const nodeTypes = {
    scaning : "scaning",
    path : "path",
    wall : "wall",
    target : "target",
    entry: "entry",
    weight : "weight",
    cell : "cell",
    candidate : "candidate"
}
