
export default function Myset() {
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
    console.log(`finding the best node among %c${this.collection.length} `, 'background: red ; padding:0.3rem ; borderRadius:50%')
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

/* Heaps */

// left child: i * 2
// right child: i * 2 + 1
// parent: i / 2

let MinHeap = function () {

  let heap = [null];

  this.insert = function (num) {
    heap.push(num);
    if (heap.length > 2) {
      let idx = heap.length - 1;
      while (heap[idx] < heap[Math.floor(idx / 2)]) {
        if (idx >= 1) {
          [heap[Math.floor(idx / 2)], heap[idx]] = [heap[idx], heap[Math.floor(idx / 2)]];
          if (Math.floor(idx / 2) > 1) {
            idx = Math.floor(idx / 2);
          } else {
            break;
          };
        };
      };
    };
  };


  this.remove = function () {
    let smallest = heap[1];
    if (heap.length > 2) {
      heap[1] = heap[heap.length - 1];
      heap.splice(heap.length - 1);
      if (heap.length == 3) {
        if (heap[1] > heap[2]) {
          [heap[1], heap[2]] = [heap[2], heap[1]];
        };
        return smallest;
      };
      let i = 1;
      let left = 2 * i;
      let right = 2 * i + 1;
      while (heap[i] >= heap[left] || heap[i] >= heap[right]) {
        if (heap[left] < heap[right]) {
          [heap[i], heap[left]] = [heap[left], heap[i]];
          i = 2 * i
        } else {
          [heap[i], heap[right]] = [heap[right], heap[i]];
          i = 2 * i + 1;
        };
        left = 2 * i;
        right = 2 * i + 1;
        if (heap[left] == undefined || heap[right] == undefined) {
          break;
        };
      };
    } else if (heap.length == 2) {
      heap.splice(1, 1);
    } else {
      return null;
    };
    return smallest;
  };
  this.print = () => {
    return this.heap
  }
};
