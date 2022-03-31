import { draw, writeIn, forceDraw } from "./helpers/draw.js";
import Node from "./helpers/Node.js";
import { dijkestra, dijkestra_realTime } from "./algorithms/dijkestra_heap_based.js";
import { normalDijkestras, normalDijkestras_realTime } from "./algorithms/dijkestra_normal.js";
import { backTracker } from "./algorithms/back-tracker.js";
import { dimentions as DM } from "./utils/config.js";
import { a_start, a_start2, a_start_realTime } from "./algorithms/a_start.js";
import { greedy, greedy_realTime } from "./algorithms/greedy.js";
import { visPath } from "./helpers/visPath.js";
import { onWaiting } from "./helpers/wait.js";
import { basicRandom } from "./algorithms/basic_randomized.js";
import { basic_random } from "./algorithms/basic-random.js";
import { randomized_kruskal2 } from "./algorithms/randomized_kruskal.js";
import { first_depth } from "./algorithms/firstDepth.js";
import { nodeTypes } from "./utils/config.js";

import "./../styles.css";

navigator.serviceWorker.register("../sw.js");

document.getElementById("algo_dijkestra").addEventListener("click", (e) => {
  localStorage.setItem("algorithm", "dijkestra");
});
document.getElementById("algo_A_start").addEventListener("click", (e) => {
  localStorage.setItem("algorithm", "a_start");
});
document.getElementById("algo_dijkestra_heap_based").addEventListener("click", (e) => {
  localStorage.setItem("algorithm", "dijkestra_heap_based");
});
document.getElementById("maze_recursive_backtracking").addEventListener("click", () => {
  localStorage.setItem("maze", "recursive_backtracking");
  selectAndCreateMaze();
});
document.getElementById("maze_basic_random").addEventListener("click", () => {
  localStorage.setItem("maze", "basic_random");
  selectAndCreateMaze();
});
document.getElementById("maze_randomized_kruskal").addEventListener("click", () => {
  localStorage.setItem("maze", "randomized_kruskal");
  selectAndCreateMaze();
});

document.getElementById("algo_greedy").addEventListener("click", (e) => {
  localStorage.setItem("algorithm", "greedy");
});

const guideOpen = document.querySelector("#guide_open");
const guideClose = document.querySelector("#guide_close");
const guide = document.querySelector(".guide");

const toggleGuide = () => {
  guideClose.classList.toggle("hide");
  guideOpen.classList.toggle("hide");
  guide.classList.toggle("closeGuide");
};

guideOpen.addEventListener("click", toggleGuide);
guideClose.addEventListener("click", toggleGuide);

document.querySelector("#clear_maze").addEventListener("click", () => cleanBoard("all"));
document.querySelector("#clear_path").addEventListener("click", () => cleanBoard("path"));
document.querySelector("#clear_walls").addEventListener("click", () => cleanBoard("walls"));
const board = document.getElementsByClassName("board");
const detailMood = document.getElementById("detail-mode");
document.getElementById("detail-mode").addEventListener("click", () => {
  handleCheckbox();
});

const maze_speed = document.getElementById("maze_algorithm_speed");
const algorithm_speed = document.getElementById("algorithm_speed");

//const create_maze = document.getElementById("create_maze")

const dimentions = new DM();

let step = 1;
let entryNode = null;
let targetNode = null;
let running = false;

let progressing = false;

const WIDTH = dimentions.getWidth();
const HEIGHT = dimentions.getHeight();

let isXActive = false;
let isWActive = false;
let isEActive = false;
let hodingClick = false;
let hodledElement = null;
let tempNode = null;

document.addEventListener("mousedown", (e) => {
  if (progressing) return;
  if (e.target.className == "entry" || e.target.className == "target") {
    hodledElement = e.target.className;
    hodingClick = true;
    e.target.style.cursor = "grabbing";
  }
  board[0].style.cursor = "grabbing";
  //TODO                                                                       don't forget to change cursor icon
});

document.addEventListener("mouseup", (e) => {
  if (progressing) return;
  hodingClick = false;
  hodledElement = null;
  board[0].style.cursor = "pointer";
});

const { wall, target, entry, weight, cell } = nodeTypes;

const handleCheckbox = () => {
  localStorage.setItem("detail-mode", detailMood.checked);
};

export const waitTillUserClick = () => {
  return new Promise((resolve, reject) => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "f" || e.key == "F") {
        return resolve();
      }
    });
  });
};

const createBoard = (width, height) => {
  board[0].innerHTML = Array.from(Array.from(Array(width * height).keys()), (item) => `<div id='${item}' class='cell'></div>`)
    .join()
    .replace(/,/g, "");
};

board[0].style.gridTemplateColumns = `repeat( ${WIDTH} , 30px)`;

createBoard(WIDTH, HEIGHT);

export const cells = document.querySelectorAll(".cell");

function init() {
  localStorage.removeItem("maze_speed");
  localStorage.removeItem("algorithm_speed");
  localStorage.removeItem("algorithm");
  localStorage.removeItem("maze");
  localStorage.removeItem("detail-mode");

  step = 3;

  const midBoard = Math.floor(HEIGHT / 2) - 1;

  const targetIndex = WIDTH * midBoard + Math.floor(0.8 * WIDTH);
  const endtryIndex = WIDTH * midBoard + Math.floor(0.2 * WIDTH);

  console.log(targetIndex);

  targetNode = cells[targetIndex];
  draw(targetNode, target);

  entryNode = cells[endtryIndex];
  draw(entryNode, entry);
}
init();

const startBtn = document.getElementById("start_btn");

maze_speed.addEventListener("change", (e) => localStorage.setItem("maze_speed", e.target.value));
algorithm_speed.addEventListener("change", (e) => localStorage.setItem("algorithm_speed", e.target.value));
//create_maze.addEventListener('click', (e) => selectAndCreateMaze())

startBtn.addEventListener("click", () => {
  running = !running;
  startVis();
});

const cleanBoard = async (type) => {
  if (progressing) return;
  step = 1;
  for (let i = 0; i < cells.length; i++) {
    i % WIDTH == 0 && (await onWaiting(20));
    if (type == "all") {
      localStorage.setItem("algorithm", "");
      forceDraw(cells[i], cell);
      forceDraw(cells[cells.length - i - 1], cell);
      writeIn(cells[i], "");
      writeIn(cells[cells.length - i - 1], "");
    } else if (type == "walls") {
      step = 3;
      if (cells[i].className === "wall") {
        forceDraw(cells[i], cell);
      }
    } else if (type == "path") {
      step = 3;
      if (cells[i].className === "scaning" || cells[i].className === "path") {
        forceDraw(cells[i], cell);
      }
    }
  }
};

const handleSenario = (NodeCell) => {
  if (progressing) return;
  switch (step) {
    case 0: {
      backTracker(cells[WIDTH + 1], true);
      step += 1;
      break;
    }
    case 1: {
      draw(NodeCell, target);
      targetNode = NodeCell;
      step += 1;
      break;
    }
    case 2: {
      draw(NodeCell, entry);
      entryNode = NodeCell;
      step += 1;
      break;
    }
  }
};

const startVis = async (fast_forward) => {
  if (progressing) return;
  if (step === 3 && entryNode) {
    const algorithm = localStorage.getItem("algorithm") ? localStorage.getItem("algorithm") : null;
    console.time();
    progressing = true;
    switch (algorithm) {
      case "dijkestra_heap_based": {
        if (fast_forward) {
          dijkestra_realTime(new Node(entryNode, null, entry, 0));
          break;
        }
        await dijkestra(new Node(entryNode, null, entry, 0));
        break;
      }
      case "dijkestra": {
        if (fast_forward) {
          normalDijkestras_realTime(new Node(entryNode, null, entry, 0));
          break;
        } else {
          await normalDijkestras(new Node(entryNode, null, entry, 0));
          break;
        }
      }
      case "a_start": {
        if (fast_forward) {
          a_start_realTime(new Node(entryNode, null, entry, 0), targetNode);
          break;
        } else {
          await a_start2(new Node(entryNode, null, entry, 0), targetNode);
          break;
        }
      }
      case "greedy": {
        if (fast_forward) {
          greedy_realTime(new Node(entryNode, null, entry, 0), targetNode);
          break;
        } else {
          greedy(new Node(entryNode, null, entry, 0), targetNode);
          break;
        }
      }
      default: {
        await normalDijkestras(new Node(entryNode, null, entry, 0));
      }
    }
    progressing = false;
    console.timeEnd();
  }
};

const selectAndCreateMaze = async () => {
  if (progressing) return;
  progressing = true;
  step = 1;
  entryNode && draw(entryNode, cell);
  targetNode && forceDraw(targetNode, cell);
  const mazeAlgo = localStorage.getItem("maze");
  switch (mazeAlgo) {
    case "recursive_backtracking": {
      await backTracker(cells[WIDTH + 1], true);
      break;
    }
    case "recursive_backtracking": {
      await backTracker(cells[WIDTH + 1], true);
      break;
    }
    case "basic_random": {
      await basicRandom();
      break;
    }
    case "randomized_kruskal": {
      await randomized_kruskal2();
      break;
    }
    default: {
      await randomized_kruskal2();
      break;
    }
  }
  progressing = false;
  //
  //basicRandom()
};

cells.forEach((cellItem) => {
  cellItem.addEventListener("click", (e) => {
    handleSenario(e.target);
  });
});

window.addEventListener("keydown", (e) => {
  isXActive = e.key === "x";
  isWActive = e.key === "w";
  isEActive = e.key === "e";
  e.key == "v" && startVis();
  e.key == "m" && selectAndCreateMaze();
});
window.addEventListener("keyup", () => {
  isXActive = false;
  isWActive = false;
  isEActive = false;
});

cells.forEach((cellNode) => {
  cellNode.addEventListener("mouseover", (e) => {
    //isXActive && draw(e.target, weight);
    if (isXActive) {
      draw(e.target, weight);
      writeIn(e.target, 3);
    }
    if (isWActive) {
      draw(e.target, wall);
    }
    if (isEActive) {
      draw(e.target, cell);
    }
    if (hodingClick) {
      tempNode = e.target.className;
      if ((hodledElement == "entry" && e.target.className !== "target") || (hodledElement == "target" && e.target.className !== "entry")) {
        forceDraw(e.target, hodledElement);
        if (hodledElement == "entry") {
          entryNode = e.target;
        } else if (hodledElement == "target") {
          targetNode = e.target;
        }
        // console.log(step);
        if (step > 1 && localStorage.getItem("algorithm")) {
          startVis(true);
        }
      }
    }
  });
});

cells.forEach((cellNode) => {
  cellNode.addEventListener("mouseout", (e) => {
    if (hodingClick) {
      forceDraw(e.target, tempNode ? tempNode : cell);
    }
  });
});
