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

const NewNode = ( data, left = null, right = null ) => {
    return {
        data,
        left,
        right
    };
}

const buildTree = ( array, start = 0, end = array.length -1 ) => { 
    if ( start > end ) return null;
    let mid = parseInt((start + end) / 2);
    let root = NewNode(array[mid]);
    root.left = buildTree(array, start, mid - 1)
    root.right = buildTree(array, mid + 1, end);
    return root;
};

function Tree( arr ) {
    // sorts input array, removes duplicates, and transforms set back to array
    let newArray = [...new Set(arr.sort(function(a, b){return a - b}))]       
    return {
        root: buildTree( newArray ),

        insert(value, root = this.root) {
            //base case
            if (root === null) {
              root = NewNode(value);
              return root;
            }
            //traverse tree and insert node at new position
            if (value < root.data) {
              root.left = this.insert( value, root.left );
            } else if (value > root.data) {
              root.right = this.insert( value, root.right );
            }
      
            return root;
          },

          delete(value, root = this.root) {
            //base case
            if ( root === null ) {
                return;
            }

            //traverse tree to node
            if ( value < root.data ) {
                root.left = this.delete( value, root.left);
            } else if ( value > root.data ) {
                root.right = this.delete( value, root.right );
            } else {
                // leaf node
                if ( root.left === null && root.right === null ) {
                    return null;
                } else if ( root.left === null ) { // 1 child
                    return root.right;
                } else if ( root.right === null ) {
                    return root.left;
                    
                } else { // 2 children
                    //find successor
                    let succParent = root;
                    let succ = succParent.right;

                    while ( succ.left !== null ) {
                        succParent = succ;
                        succ = succ.left;
                    }
                    
                    if ( succParent !== root ) {
                        succParent.left = succ.right;
                    } else {
                        succParent.right = succ.right;
                    }

                    // replace root with successor
                    root.data = succ.data;
                    return root;
                }
                
            }
            return root;
          },

          find ( value, root = this.root ) {
            //return object with root.data === value
            if ( root === null ) {
                return root;
            }
            if ( value < root.data ) {
                root = this.find(value, root.left )
            } else if ( value > root.data ) {
                root = this.find(value, root.right)
            } else {
                return root;
            }
            return root;
          },

          levelOrder( callback = null, root = this.root ){
            // callback performs operation on each node or node.data is added to array
            const q = [];
            const returnArray = [];
            //discover root
            q.push(root);
            //as long as queue is not empty
            while ( q.length > 0 ) {
                // dequeue front node, visit it
                let current = q.shift();
                if( callback && typeof callback == 'function') {
                    // callback(current node);
                    callback(current);
                } else {
                    returnArray.push(current.data);
                }
                // enqueue children nodes
                if ( current.left ) {
                    q.push(current.left)
                }
                if ( current.right ) {
                    q.push(current.right)
                }
                
                
            } 
            if( !callback ) return returnArray;
          },

          inOrder( callback = null, root = this.root, array = [] ) {
            if( root === null ) return;
            //traverse left subtree
            this.inOrder(callback, root.left, array);
            //callback with node as argument or add node data to array
            if (callback && typeof callback == 'function') {
                callback(root)
            } else {
                array.push(root.data);
            }
            //traverse right subtree
            this.inOrder(callback, root.right, array);
            //return array of values if no callback provided
            return array;
          },

          preOrder( callback = null, root = this.root, array = [] ) {
            if( root === null ) return;
            //callback with node as argument or add node data to array
            if (callback && typeof callback == 'function') {
                callback(root)
            } else {
                array.push(root.data);
            }
            //traverse left subtree
            this.preOrder(callback, root.left, array);
            //traverse right subtree
            this.preOrder(callback, root.right, array);
            //return array of values if no callback provided
            return array;
          },

          postOrder( callback = null, root = this.root, array = [] ) {
            if( root === null ) return;
            //traverse left subtree
            this.postOrder(callback, root.left, array);
            //traverse right subtree
            this.postOrder(callback, root.right, array);
            //callback with node as argument or add node data to array
            if (callback && typeof callback == 'function') {
                callback(root)
            } else {
                array.push(root.data);
            }
            //return array of values if no callback provided
            return array;
          },

          height( node ) {
            if (node === null) return -1;
            const leftHeight = this.height(node.left);
            const rightHeight = this.height(node.right);

            return Math.max(leftHeight, rightHeight) + 1;
          },

          depth( node, root = this.root ) {
            if (root === node) return 0;
            if (root === null) return 1;
            const leftDepth = this.depth(node, root.left);
            const rightDepth = this.depth(node, root.right);
            return Math.min(leftDepth, rightDepth) + 1;
            
          },

          isBalanced( root = this.root ) {
            if ( root === null ) return;
            this.isBalanced(root.left);
            this.isBalanced(root.right);
            if ( Math.abs(this.height(root.left) - this.height(root.right)) > 1 ) {
                return false;
            } else {
                return true;
            }
          },

          rebalance() {
            const arr = this.inOrder();
            this.root = buildTree(arr);
          }
    }
}



const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const unsrtArray = [1, 200, 4, 23, 45, 65, 90, 5, 6, 600, 700, 800, 900, 7, 8, 9, 10];

const t = Tree(testArray);
prettyPrint(t.root);
