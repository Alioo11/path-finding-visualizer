export function dimentions() {
    let WIDTH = (parseInt(window.innerWidth / 30) - 2) % 2 === 0 ? (parseInt(window.innerWidth / 30) - 3) : (parseInt(window.innerWidth / 30) - 2);
    let HEIGHT = window.innerWidth < 400 ? (parseInt(window.innerHeight / 30) - 1) : (parseInt(window.innerHeight / 30) - 3) - 2;
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
