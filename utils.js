const NODE_WIDTH = 10, NODE_HEIGHT = 10
const TEXT_SIZE = 50
const OBSTACLE_NODE_GSCORE_CONST = 10
const OBSTACLE_NODE_PROB = 0.5

function drawNodes(drawNodePosition=false) {
    background('white')

    let curNodePosition, neighborNodePosition
    for (let nodeId of Object.keys(nodes)) {
        node = nodes[nodeId]
        curNodePosition = node.position
        for (let neighborNodeId of Object.keys(node.neighborsWeight)) {
            neighborNodePosition = nodes[neighborNodeId].position

            strokeWeight(0.1)
            stroke('black')
            line(curNodePosition[0], curNodePosition[1], neighborNodePosition[0], neighborNodePosition[1])
        }
    }
    
    for (let nodeId of Object.keys(nodes)) {
        node = nodes[nodeId]

        if (Number(nodeId) == startNodeId) {
            fill('green')
        }
        else if (Number(nodeId) == goalNodeId) {
            fill('blue')
        }
        else if (currentPath.includes(Number(nodeId))) {
            fill('red')
        }
        else if (frontier.includes(Number(nodeId))) {
            fill('yellow')
        }
        else if (nodeId == curNodeId) {
            fill('red')
        }
        else if (node.isObstacle) {
            fill('black')
        }
        else {
            fill('gray')
        }
        
        
        if (Number(nodeId) == startNodeId || Number(nodeId) == goalNodeId) {
            ellipse(node.position[0], node.position[1], NODE_WIDTH+10, NODE_HEIGHT+10)
        }
        else if (currentPath.includes(Number(nodeId))) {
            ellipse(node.position[0], node.position[1], NODE_WIDTH+5, NODE_HEIGHT+5)
        }
        else {
            ellipse(node.position[0], node.position[1], NODE_WIDTH, NODE_HEIGHT)
        }

        if (node.gScore != Infinity) {
            if (drawNodePosition) {
                fill(10)
                textAlign(CENTER)
                textSize(15)
                text(node.fScore, node.position[0], node.position[1])
            }
        }
    }
}

function genRandom(min, max) {
    return (Math.random() * (max - min)) + min
}

function genRandomGraph(numberOfNodes, width, height, minEdgeCost, maxEdgeCost, nodesNeighborsRadius) {
    let nodes = {}
    let newNode, isNodeObstacle = false
    for (let i = 0; i < numberOfNodes; i++) {
        isNodeObstacle = false
        if (genRandom(0, 1) > OBSTACLE_NODE_PROB) {
            isNodeObstacle = true
        }
        newNode = new Node(isNodeObstacle)
        newNode.position = [genRandom(10, width-10), genRandom(10, height-10)] // X, Y
        nodes[newNode.nodeId] = newNode
    }

    let nodeDistance, randEdgeCost
    for (let node1 of Object.values(nodes)) {
        for (let node2 of Object.values(nodes)) {
            if (node1.nodeId == node2.nodeId) {
                continue
            }
            else {
                nodeDistance = Math.sqrt(
                    Math.pow(node2.position[0] - node1.position[0], 2) + Math.pow(node2.position[1] - node1.position[1], 2)
                )
                if (nodeDistance <= nodesNeighborsRadius) { // if the node2 is in the radius of the node1 
                    if (!(node2.nodeId in node1.neighborsWeight) && !(node1.nodeId in node2.neighborsWeight)) {
                        randEdgeCost = genRandom(minEdgeCost, maxEdgeCost) // cost of the edge between two nodes
                        if (node1.isObstacle || node2.isObstacle) {
                            randEdgeCost *= OBSTACLE_NODE_GSCORE_CONST
                        }
                        node1.neighborsWeight[node2.nodeId] = randEdgeCost
                        node2.neighborsWeight[node1.nodeId] = randEdgeCost
                    }
                }
            }
        }
    }

    return nodes   
}