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

var engine;
var world;
var birds = [],
    pigs = [],
    walls = [],
    boundaries = [];
var slingshotcenter;
var currentBird = 0;
var nextBird = false;
var isBirdFlying = false;
var mouseButtonUp;
var wasBirdDragged = false;

var mConstraint;
var constraint;

var boundaryCategory = 0x0001,
    birdCategory = 0x0002,
    pigCategory = 0x0004,
    nocolideCategory = 0x0008,
    wallCategory = 0x0020,
    nonCurrentBirdCategory = 0x0030;

var enableInput = false;


function setup() {
    var canvas = createCanvas(1280, 720);
    frameRate(60);
    engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 10
    });
    world = engine.world;
    constructWorld(canvas);
}

function draw() {
    background(144);
    Engine.update(engine);
    if (mouseButtonUp) {
        releaseBird();
    }

    drawObjects();

    checkForNextShot();

    checkCollision();
}

function mouseReleased() {
    if (wasBirdDragged == true) {
        mouseButtonUp = true;
        wasBirdDragged = false;
    }
}

//Checks if everything is asleep and if so, it prepares the next bird to be launched.
//If you run out of birds, it's game over
function checkForNextShot() {
    if (isEverythingSleeping() && birds.length > 1 && isBirdFlying) {
        isBirdFlying = false;
        nextBird = true;
        loadNextBird();
    } else if (isEverythingSleeping() && birds.length == 1 && isBirdFlying) {
        birds.splice(currentBird, 1);
        alert("game over");
    }
}

//Populating the world with bodies and making the mouse interactivity working
function constructWorld(canvas) {
    boundaries.push(new Boundary(640, 700, width, 10, 0, false, boundaryCategory));
    boundaries.push(new Boundary(1270, 360, 10, 720, 0, false, boundaryCategory));

    //boxes.push(new Box(1000, 600, 100, 100));
    pigs.push(new Pig(800, 450, 30));
    pigs.push(new Pig(600, 600, 30));
    pigs.push(new Pig(900, 600, 30));

    walls.push(new Wall(750, 600, 20, 150));
    walls.push(new Wall(850, 600, 20, 150));
    walls.push(new Wall(800, 500, 140, 20));

    slingshotcenter = new Boundary(300, 450, 10, 10, 0, true, nocolideCategory);

    birds.push(new Bird(300, 450, 30));
    birds.push(new Bird(200, 450, 30));
    birds.push(new Bird(150, 450, 30));

    //Creating the slingshot and attaching the slingshot center to the current "bird" body
    var coptions = {
        bodyA: slingshotcenter.body,
        bodyB: birds[currentBird].body,
        length: 0,
        stiffness: 0.003
    }

    constraint = Constraint.create(coptions);
    World.add(world, constraint);

    //Creating a mouse constraint, which will later be used as a connection between the current body and the mouse
    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRation = pixelDensity();

    var options = {
        mouse: canvasmouse,
        collisionFilter: {
            mask: birdCategory
        }
    }

    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
    birds[currentBird].body.collisionFilter.category = birdCategory;
}

//Releasing the body from the slingshot when the distance between the body and the center is less than 30
function releaseBird() {
    var distance = dist(slingshotcenter.body.position.x, slingshotcenter.body.position.y, birds[currentBird].body.position.x, birds[currentBird].body.position.y);
    if (distance < 30) {
        isBirdFlying = true;
        constraint.bodyB = null;
        mouseButtonUp = false;
    }
}

//After the current body is asleep, we create a new body and attach it to the sling
function loadNextBird() {
    if (nextBird == true) {
        birds[currentBird].removeFromWorld();
        birds.splice(currentBird, 1);
        birds[currentBird].body.collisionFilter.category = birdCategory;
        Body.setPosition(birds[currentBird].body, {
            x: 300,
            y: 440
        });
        constraint.bodyB = birds[currentBird].body;
        nextBird = false;
    }
}

//Drawing all of our bodies and meanwhile checking if there are any pigs left
function drawObjects() {
    //Drawing and checking for sleep in the circles
    for (var i = 0; i < birds.length; i++) {
        birds[i].show();
        //Draws a line between the sling center and the current body
        line(slingshotcenter.body.position.x, slingshotcenter.body.position.y, birds[currentBird].body.position.x, birds[currentBird].body.position.y);
    }

    for (var i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }

    for (var i = 0; i < pigs.length; i++) {
        pigs[i].show();
        if (pigs[i].body.label == "pigDead") {
            pigs[i].removeFromWorld();
            pigs.splice(i, 1);
            if (pigs.length == 0) {
                alert("game over");
            }
        }
    }

    for (var i = 0; i < walls.length; i++) {
        walls[i].show();
    }

    //Checks if the body attached is a bird and sets a trigger
    if (mConstraint.body) {
        if (mConstraint.body.label == "bird") {
            wasBirdDragged = true;
        }
        var pos = mConstraint.body.position;
        var offset = mConstraint.constraint.pointB;
        var m = mConstraint.mouse.position;

        stroke(0, 255, 0);
        line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
}

//Checking if each body's speed is below a threshold
function isEverythingSleeping() {
    var bodies = Composite.allBodies(world);
    var sleeping = bodies.filter((body) => body.speed < 0.30 ? true : false);
    var isWorldSleeping = bodies.length === sleeping.length;
    return isWorldSleeping;
}

//Checks collision between pig-boundary, pig-wall and pig-bird, each with a different 
//threshold for a contact impulse, which if passed, the pig gets destroyed
function checkCollision() {
    Events.on(engine, 'collisionStart', function (event) {
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];

            if (pair.bodyA.label == "boundary" || pair.bodyB.label == "boundary") {
                if (pair.bodyA.label == "pig" || pair.bodyB.label == "pig") {
                    var relativeMomentum = Vector.sub(pair.bodyA.velocity, pair.bodyB.velocity);
                    if (Vector.magnitude(relativeMomentum) > 7) {
                        pair.bodyA.label = pair.bodyA.label == "pig" ? "pigDead" : pair.bodyA.label;
                        pair.bodyB.label = pair.bodyB.label == "pig" ? "pigDead" : pair.bodyB.label;
                    }
                }
            } else {
                if (pair.bodyA.label != "boundary" || pair.bodyB.label != "boundary") {
                    if (pair.bodyA.label == "pig" || pair.bodyB.label == "pig") {
                        var bodyAMomentum = Vector.mult(pair.bodyA.velocity, pair.bodyA.mass);
                        var bodyBMomentum = Vector.mult(pair.bodyB.velocity, pair.bodyB.mass);
                        var relativeMomentum = Vector.sub(bodyAMomentum, bodyBMomentum);
                        var threshold = 25;
                        if (pair.bodyA.label == "wall" || pair.bodyB.label == "wall") {
                            threshold = 13;
                        }
                        console.log(Vector.magnitude(relativeMomentum));
                        if (Vector.magnitude(relativeMomentum) > threshold) {
                            pair.bodyA.label = pair.bodyA.label == "pig" ? "pigDead" : pair.bodyA.label;
                            pair.bodyB.label = pair.bodyB.label == "pig" ? "pigDead" : pair.bodyB.label;
                        }
                    }
                }
            }

            //Old method

            /*var bodyAMomentum = Vector.mult(pair.bodyA.velocity, pair.bodyA.mass);
            var bodyBMomentum = Vector.mult(pair.bodyB.velocity, pair.bodyB.mass);
            var relativeMomentum = Vector.sub(bodyAMomentum, bodyBMomentum);*/
            //var relativeMomentum = Vector.sub(pair.bodyA.velocity, pair.bodyB.velocity);

            /*if (Vector.magnitude(relativeMomentum) > 7 && pair.bodyA.label == "boundary" && pair.bodyB.label == "pig") {
                //console.log(Vector.magnitude(relativeMomentum));
                pair.bodyB.label = "pigDead";
                //console.log("delete pig");
                //console.log(Vector.magnitude(relativeMomentum));
            } else {
                if (Vector.magnitude(relativeMomentum) > 13) {
                    pair.bodyA.label = pair.bodyA.label == "pig" ? "pigDead" : pair.bodyA.label;
                    pair.bodyB.label = pair.bodyB.label == "pig" ? "pigDead" : pair.bodyB.label;
                    //console.log(pair.bodyA.label);
                }
            }*/
        }
    });
}