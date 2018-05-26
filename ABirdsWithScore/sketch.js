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

const START_GAME = 0,
    LEVEL_0 = 1,
    LEVEL_1 = 2,
    END_GAME = 3;
var gameState = 0;
var levelCompleted = false;
var startmenu, level0, level1;
var level0data, level1data;

var lvl1bgn, lvl2bgn;

var bgnMusicSFX, birdflySFX, lvlCompleteSFX, lvlFailedSFX, lvlStartSFX, lvlVictorySFX, pigColSFX, slingSFX, endSFX;

var aFont;

var playBtn, resetBtn, scoreBgr;

/**
 * Load the object configurations from JSON files.
 */
function preload() {
    bgnMusicSFX = loadSound("sfx/theme.ogg");
    birdflySFX = loadSound("sfx/birdfly.wav");
    lvlCompleteSFX = loadSound("sfx/levelcompleted.wav");
    lvlFailedSFX = loadSound("sfx/levelfailed.wav");
    lvlStartSFX = loadSound("sfx/levelstart.wav");
    lvlVictorySFX = loadSound("sfx/levelvictory.wav");
    pigColSFX = loadSound("sfx/pigcollision.wav");
    slingSFX = loadSound("sfx/slingshotstr.wav");
    endSFX = loadSound("sfx/final.mp3");

    playBtn = loadImage("images/PlayButton.png");
    resetBtn = loadImage("images/ReplayButton.png");
    scoreBgr = loadImage("images/ScoreMenu.png");

    aFont = loadFont("images/ABirds.ttf");

    lvl1bgn = loadImage("images/Farm.png");
    lvl2bgn = loadImage("images/Space.png");
    level0data = loadJSON("level0.json");
    level1data = loadJSON("level1.json");
}

/**
 * Creates the canvas, engine, world and loads the first level.
 */
function setup() {
    setupMusic();
    bgnMusicSFX.loop();
    canvas = createCanvas(1280, 720);
    frameRate(60);
    engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 10
    });
    world = engine.world;
    startmenu = new Menu(canvas);
    level0 = new Level(canvas, level0data);
    textFont(aFont, 32);
}

/**
 * Updates the engine and calls the corresponding draw functions and manages the level system.
 */
function draw() {

    Engine.update(engine);
    switch (gameState) {
        case START_GAME:
            startmenu.draw();
            break;
        case LEVEL_0:
            background(lvl1bgn);
            level0.draw();
            if (levelCompleted) {
                level0 = null;
                level1 = new Level(canvas, level1data);
                gameState = LEVEL_1;
                levelCompleted = false;
                lvlStartSFX.play();
            }
            break;
        case LEVEL_1:
            background(lvl2bgn);
            level1.draw();
            if (levelCompleted) {
                level1 = null;
                gameState = END_GAME;
                endSFX.play();
            }
            break;
        case END_GAME:
            textSize(100);
            stroke(255);
            fill(162, 86, 0);
            text('Game Over!', (width / 2) - 200, height / 2 - 150);
            break;
    }
}

/**
 * Calls the corresponding mouseRelease functions for the current level.
 */
function mouseReleased() {
    if (gameState == START_GAME) {
        startmenu.mouseReleased();
    }
    if (gameState == LEVEL_0) {
        level0.mouseReleased();
    }
    if (gameState == LEVEL_1) {
        level1.mouseReleased();
    }
}

function mousePressed() {
    if (gameState == LEVEL_0) {
        level0.mousePressed();
    }
    if (gameState == LEVEL_1) {
        level1.mousePressed();
    }
}

function setupMusic() {
    bgnMusicSFX.setVolume(0.3);
    birdflySFX.setVolume(0.3);
    lvlCompleteSFX.setVolume(0.3);
    lvlFailedSFX.setVolume(0.3);
    lvlStartSFX.setVolume(0.3);
    lvlVictorySFX.setVolume(0.3);
    pigColSFX.setVolume(0.3);
    slingSFX.setVolume(0.3);
    endSFX.setVolume(0.3);
}

function changeLevel(level) {
    gameState = level;
}