let nodes, node
let startNodeId, curNodeId, goalNodeId
let currentPath = [], frontier = [], reachedNodes = [], nodesPaths = {}

const HEURISTIC_CONST = 2

function heuristic(node) {
    let goalNode = nodes[goalNodeId]

    // euclidean distance
    return HEURISTIC_CONST*Math.sqrt(
        Math.pow(goalNode.position[0] - node.position[0], 2) + 
        Math.pow(goalNode.position[1] - node.position[1], 2)
    )
}

function calcNodeFScore(node) {
    return nodes[curNodeId].gScore + heuristic(node) + nodes[curNodeId].neighborsWeight[node.nodeId]
}

function aStarReset() {
    nodesPaths = {}
    currentPath = [], frontier = [], reachedNodes = []
    aStarSetup()
}

function aStarSetup() {
    do {
        startNodeId = nodes[Object.keys(nodes)[Math.floor(random(0, Object.keys(nodes).length))]].nodeId
        goalNodeId = nodes[Object.keys(nodes)[Math.floor(random(0, Object.keys(nodes).length))]].nodeId        
    } while (startNodeId == goalNodeId || nodes[startNodeId].isObstacle || nodes[goalNodeId].isObstacle)

    nodes[startNodeId].gScore = nodes[startNodeId].fScore = 0
    frontier.push(startNodeId)
    nodesPaths[startNodeId] = [startNodeId]

    console.log('startNode', nodes[startNodeId])
    console.log('goalNode', nodes[goalNodeId])
}

function aStarLoop() {
    // choose next node
    let minCost = Infinity, lowestCostNodeId
    for (let nodeId of frontier) {
        node = nodes[nodeId]
        if (Number(nodeId) == goalNodeId) { // we found the way!
            currentPath = nodesPaths[curNodeId]
            currentPath.push(nodeId)
            return 'success'
        }
        else {
            if (node.fScore < minCost) {
                minCost = node.fScore
                lowestCostNodeId = node.nodeId
            }
        }
    }
    frontier.splice(frontier.indexOf(lowestCostNodeId), 1) // delete the node from the frontier
    curNodeId = lowestCostNodeId
    currentPath = nodesPaths[curNodeId]
    
    // update nodes cost/weight (relaxation) + collect new nodes into the frontier for next expansion
    for (let nodeId of Object.keys(nodes[curNodeId].neighborsWeight)) {
        node = nodes[nodeId]
        
        if (nodes[curNodeId].gScore + nodes[curNodeId].neighborsWeight[node.nodeId] < node.gScore) {
            node.gScore = nodes[curNodeId].gScore + nodes[curNodeId].neighborsWeight[node.nodeId]
            node.fScore = calcNodeFScore(node)
            
            // node isn't in the reachedNodes and isn't in the frontier
            if (!reachedNodes.includes(Number(nodeId)) && !frontier.includes(Number(nodeId))) {
                frontier.push(Number(nodeId))
                
                nodesPaths[nodeId] = JSON.parse(JSON.stringify(currentPath))
                nodesPaths[nodeId].push(Number(nodeId))
            }
        }
    }
    reachedNodes.push(curNodeId)

    if (frontier.length == 0) {
        return 'failure'
    }
}