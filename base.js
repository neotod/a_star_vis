const WIDTH = 1600, HEIGHT = 800
const NUM_OF_NODES = 500
const MIN_EDGE_GSCORE = 10, MAX_EDGE_GSCORE = 100
const NODES_NEIGHBORS_RADIUS = 70

let state = 'running'

function reset() {
    noLoop()
    nodes = genRandomGraph(NUM_OF_NODES, WIDTH, HEIGHT, MIN_EDGE_GSCORE, MAX_EDGE_GSCORE, NODES_NEIGHBORS_RADIUS)
    aStarReset()
    loop()
}

function setup() {
    nodes = genRandomGraph(NUM_OF_NODES, WIDTH, HEIGHT, MIN_EDGE_GSCORE, MAX_EDGE_GSCORE, NODES_NEIGHBORS_RADIUS)
    
    createCanvas(WIDTH, HEIGHT)
    background(255)

    aStarSetup()

    drawNodes()
    
    let resetButton = createButton('Another one!')
    resetButton.position(WIDTH, HEIGHT)
    resetButton.mouseClicked(reset)
}

function draw() {
    drawNodes()

    state = aStarLoop()
    if (state == 'success') {
        drawNodes()
        noLoop()
    }
    else if (state == 'failure') {
        fill('red')
        text('Algorithm Cannot find a way.', WIDTH/2, HEIGHT-10)
        noLoop()
    }
}