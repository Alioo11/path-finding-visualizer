import obj from './algorithms/dijkestra'
console.log(obj)

const board = document.getElementsByClassName("board");
let isXActive = false;

function Myset() {
  this.collection = [];
  this.bestNode = null;
  this.add = (Node) => {
    const haveItem =
      this.collection.filter((item) => item.node?.id == Node.id).length > 0;
    if (!haveItem) {
      this.collection.push(Node);
    } else {
      this.collection = this.collection.filter(
        (item) => item.node?.id !== Node.id
      );
    }
  };
  this.delete = (Node) => {
    this.collection = this.collection.filter(
      (collectionItem) => collectionItem?.node?.id !== Node.node.id
    );
    return this.collection;
  };
  this.findBestNode = () => {
    this.bestNode = this.collection.reduce((all, current) => {
      return all.cost > current.cost ? current : all;
    });
    return this.bestNode;
  };
  this.reSort = () => {
    return this.collection.sort((a, b) => a.cost - b.cost);
  };
  this.show = () => {
    console.log(this.collection);
  };
  this.col = () => {
    return this.collection;
  };
}

const WIDTH = 50;
const HEIGHT = 28;

const scaning = "scaning";
const path = "path";
const wall = "wall";
const target = "target";
const entry = "entry";

const NodeList = [];

const createBoard = (width, height) => {
  for (let i = 0; i < width * height; i++) {
    board[0].innerHTML += `<div id="${i}" class="cell"></div>`;
  }
};

createBoard(WIDTH, HEIGHT);

const cells = document.querySelectorAll(".cell");

cells[200].className = target;

function Node(node, orgin, type, cost) {
  this.node = node;
  this.orgin = orgin;
  this.type = type;
  this.cost = cost;
}

cells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
    //updateBoard(e.target , path)
    dijkestra(new Node(e.target, null, entry, 0));
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
    isXActive && updateBoard(e.target, wall);
  });
});

const findNeighbours = (cellNode) => {
  if (!cellNode) return [];
  const result = [];
  const cellIndex = parseInt(cellNode.id);
  if (cellIndex - WIDTH >= 0) {
    result.push(cells[cellIndex - WIDTH]);
  }
  if ((cellIndex + 1) % WIDTH !== 0) {
    result.push(cells[cellIndex + 1]);
  }
  if (cellIndex + WIDTH < WIDTH * HEIGHT) {
    result.push(cells[cellIndex + WIDTH]);
  }
  if (cellIndex % WIDTH !== 0) {
    result.push(cells[cellIndex - 1]);
  }
  return result
    ? result.filter(
        (res) => res.className === "cell" || res.className === target
      )
    : [];
};
const updateBoard = (cellNode, className) => {
  cellNode.className = cellNode.className === target ? target : className;
};

const dijkestra = (startingNode) => {
  const NodeList = [];
  const possibleRouts = new Myset();
  const iteration = async (nodeLoop, firstTime) => {
    NodeList.push(nodeLoop);
    updateBoard(nodeLoop.node, firstTime ? entry : scaning);
    if (nodeLoop.node.className === target) {
      visPath(nodeLoop);
      return;
    }
    const res = await onWaiting();
    possibleRouts.delete(nodeLoop);
    findNeighbours(nodeLoop.node).forEach((item) => {
      const newNode = new Node(item, nodeLoop, scaning, nodeLoop.cost + 1);
      possibleRouts.add(newNode);
    });
    iteration(possibleRouts.findBestNode());
  };
  return iteration(startingNode, true);
};

const visPath = async (finalNode) => {
  const revPath = [];
  while (finalNode.orgin !== null) {
    console.log(finalNode);
    revPath.push(finalNode.node);
    //updateBoard(finalNode.node , path)
    finalNode = finalNode.orgin;
  }
  for (let i = revPath.length - 1; i >= 0; i--) {
    const waitingResult = await onWaiting();
    updateBoard(revPath[i], path);
  }
};

const onWaiting = (waitingTime) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        resolve();
      },
      waitingTime ? waitingTime : 30
    );
  });
};
