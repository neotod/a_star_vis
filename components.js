const NODES_ID_UPPER = 2000000

class Node {
    constructor(isObstacle=false) {
        this.nodeId = Math.floor(genRandom(1, NODES_ID_UPPER))
        this.isObstacle = isObstacle
        this.neighborsWeight = {} // this contains weight of the edges between the current node and each neighbor node
        this.gScore = Infinity
        this.fScore = this.gScore
    }
}