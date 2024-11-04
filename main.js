class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.sortedArr = this.sortAndFilter(array);
    this.root = this.buildtree(this.sortedArr);
  }

  buildtree(array, start = 0, end = array.length - 1) {
    if (start > end) return null;

    let mid = start + Math.floor((end - start) / 2);
    let root = new Node(array[mid]);
    
    root.left = this.buildtree(array, start, mid - 1);
    root.right = this.buildtree(array, mid + 1, end);

    return root;
  }

  sortAndFilter(array) {
    return [...new Set(array)].sort((a,b) =>  a - b);
  }

  min(root) {
    if(!root.left) {
      return root.data;
    } else {
      return this.min(root.left);
    }
  }

  insert(value) {
    let newNode = new Node(value);
    let currentNode = this.root;
    while(currentNode) {
      if (value === currentNode.data) return undefined;
      if (value < currentNode.data) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
          return this;
        }
        currentNode = currentNode.left;
      } else {
        if (currentNode.right === null) {
          currentNode.right = newNode;
          return this;
        }
        currentNode = currentNode.right;
      }
    }
  }

  deleteItem(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(root, value) {
    if(root === null) {
      return root;
    }

    if(value < root.data) {
      root.left = this.deleteNode(root.left, value);
    } else if (value > root.data) {
      root.right = this.deleteNode(root.right, value);
    } else {
      if(!root.left && !root.right) {
        return null;
      }
      if(!root.left) {
        return root.right;
      } else if (!root.right) {
        return root.left;
      }
      root.data = this.min(root.right);
      root.right = this.deleteNode(root.right, root.data);
    }
    return root;
  }

  find(value) {
    let currentNode = this.root;
    while(currentNode) {
      if (value === currentNode.data) return currentNode;
      if (value < currentNode.data) {
        if (currentNode.left.data === value) {
          return currentNode.left;
        }
        currentNode = currentNode.left;
      } else {
        if (currentNode.right.data === value) {
          return currentNode.right;
        }
        currentNode = currentNode.right;
      }
    }
  }

  levelOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback function required.');
    }
    
    let currentNode = this.root;

    if (currentNode === null) return;
    const queue = [];
    queue.push(currentNode);
    while(queue.length) {
      callback(queue[0]);
      if (queue[0].left) queue.push(queue[0].left);      
      if (queue[0].right) queue.push(queue[0].right);
      queue.shift();
    }
  }

  inOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback function required.');
    }
    
    function inOrderTraverse(node) {
      if (!node) return;

      inOrderTraverse(node.left);
      callback(node);
      inOrderTraverse(node.right);
    }

    inOrderTraverse(this.root);
  }

  preOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback function required.');
    }
    
    function preOrderTraverse(node) {
      if (!node) return;

      callback(node);
      preOrderTraverse(node.left);
      preOrderTraverse(node.right);
    }

    preOrderTraverse(this.root);
  }

  postOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback function required.');
    }
    
    function postOrderTraverse(node) {
      if (!node) return;

      postOrderTraverse(node.left);
      postOrderTraverse(node.right);
      callback(node);
    }

    postOrderTraverse(this.root);
  }

  height(node) {
    const currentNode = this.find(node);

    function findHeight(root) {
      if (!root) return -1;

      let leftHeight = findHeight(root.left);
      let rightHeight = findHeight(root.right);

      return Math.max(leftHeight, rightHeight) + 1;
    }

    return findHeight(currentNode);

  }

  depth(node, root = this.root, depthCount = 0) {
    if (!root) return -1;

    if (root.data === node) return depthCount;

    let leftDepth = this.depth(node, root.left, depthCount + 1);
    if (leftDepth !== -1) return leftDepth;

    return this.depth(node, root.right, depthCount + 1);
  }

  isBalanced(root) {
    if (root) return true;

    function getHeight(node) {
      if (!node) return 0;

      return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    }

    let leftHeight = getHeight(this.root.left);
    let rightHeight = getHeight(this.root.right);

    if (Math.abs(leftHeight - rightHeight) <= 1 && 
        this.isBalanced(this.root.left) === true &&
        this.isBalanced(this.root.right) === true) return true;
    
    return false;
  }

  rebalance() {
    const nodeArray = [];
    this.preOrder(node => {
      nodeArray.push(node.data);
    });

    this.sortedArr = this.sortAndFilter(nodeArray);
    this.root = this.buildtree(this.sortedArr);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};


const myArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]
const myTree = new Tree(myArray);
prettyPrint(myTree.root);