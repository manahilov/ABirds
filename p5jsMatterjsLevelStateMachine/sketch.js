var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Resolver = Matter.Resolver,
    Vector = Matter.Vector,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite;

var boundaryCategory = 0x0001,
    birdCategory = 0x0002,
    pigCategory = 0x0004,
    nocolideCategory = 0x0008,
    wallCategory = 0x0020,
    nonCurrentBirdCategory = 0x0030;

var canvas;

const LEVEL_0 = 0,
    LEVEL_1 = 1,
    END_GAME = 2;
var gameState = 0;
var levelCompleted = false;
var level0, level1;
var level0data, level1data;

/**
 * Load the object configurations from JSON files.
 */
function preload() {
    level0data = loadJSON("level0.json");
    level1data = loadJSON("level1.json");
}

/**
 * Creates the canvas, engine, world and loads the first level.
 */
function setup() {
    canvas = createCanvas(1280, 720);
    frameRate(60);
    engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 10
    });
    world = engine.world;
    level0 = new Level(canvas, level0data);
}

/**
 * Updates the engine and calls the corresponding draw functions and manages the level system.
 */
function draw() {

    background(144);
    Engine.update(engine);
    switch (gameState) {
        case LEVEL_0:
            level0.draw();
            if (levelCompleted) {
                level0 = null;
                level1 = new Level(canvas, level1data);
                gameState = LEVEL_1;
                levelCompleted = false;
            }
            break;
        case LEVEL_1:
            level1.draw();
            if (levelCompleted) {
                level1 = null;
                gameState = END_GAME;
            }
            break;
        case END_GAME:
            textSize(42);
            text('Game Over!', (width / 2) - 50, height / 2);
            fill(0, 102, 153);
            break;

    }
}

/**
 * Calls the corresponding mouseRelease functions for the current level.
 */
function mouseReleased() {
    if (gameState == LEVEL_0) {
        level0.mouseReleased();
    }
    if (gameState == LEVEL_1) {
        level1.mouseReleased();
    }
}