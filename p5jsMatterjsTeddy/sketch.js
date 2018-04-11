var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Resolver = Matter.Resolver,
    Vector = Matter.Vector,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var circles = [];
var boxes = [];
var currentBird = 0;
var nextBird = false;
var boundaries = [];
var slingshotcenter;
var mouseButtonUp;

var mConstraint;
var constraint;

var defaultCategory = 0x0001,
    birdCategory = 0x0002,
    staticCategory = 0x0004;

function setup() {
    var canvas = createCanvas(1280, 720);
    frameRate(60);
    engine = Engine.create({
        enableSleeping: true
    });
    world = engine.world;
    boundaries.push(new Boundary(640, 700, width, 10, 0, false));
    boxes.push(new Box(1000, 600, 100, 100));
    slingshotcenter = new Boundary(300, 450, 10, 10, 0, true);

    circles.push(new Circle(300, 450, 30));
    console.log(circles[0].body);

    //Creating the slingshot and attaching the slingshot center to the current "bird" body
    var coptions = {
        bodyA: slingshotcenter.body,
        bodyB: circles[currentBird].body,
        length: 0,
        stiffness: 0.003
    }

    constraint = Constraint.create(coptions);
    World.add(world, constraint);

    //Creating a mouse constraint, which will later be used as a connection between the current body and the mouse
    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRation = pixelDensity();

    var options = {
        mouse: canvasmouse
    }

    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
}

function mouseReleased() {
    mouseButtonUp = true;
}

//Releasing the body from the slingshot when the distance between the body and the center is less than 30
function releaseBird() {
    var distance = dist(slingshotcenter.body.position.x, slingshotcenter.body.position.y, circles[currentBird].body.position.x, circles[currentBird].body.position.y);
    if (distance < 30) {
        constraint.bodyB = null;
        mouseButtonUp = false;
    }
}

//Adds a new body via keypress
function keyPressed() {
    circles.push(new Circle(300, 450, 30));
    currentBird++;
    constraint.bodyB = circles[currentBird].body;

}

//after the current body is asleep, we create a new body and attach it to the sling
function loadNextBird() {
    if (nextBird == true) {
        circles.push(new Circle(300, 450, 30));
        currentBird++;
        constraint.bodyB = circles[currentBird].body;
        nextBird = false;
    }
}

function draw() {
    background(144);
    Engine.update(engine);
    if (mouseButtonUp) {
        releaseBird();
    }

    //boxes[0].body.position.x = 500;

    //Drawing and checking for sleep in the circles
    for (var i = 0; i < circles.length; i++) {
        circles[i].show();
        if (circles[currentBird].body.isSleeping) {
            console.log("Circle is sleeping");

            nextBird = true;
            loadNextBird();
        }
    }

    for (var i = 0; i < boundaries.length; i++) {
        boundaries[i].show();
    }

    for (var i = 0; i < boxes.length; i++) {
        boxes[i].show();
        if (boxes[i].body.isSleeping) {
            //console.log("Box is sleeping");
        }
    }

    //Draws a line between the sling center and the current body
    line(slingshotcenter.body.position.x, slingshotcenter.body.position.y, circles[currentBird].body.position.x, circles[currentBird].body.position.y);

    //Connects the mouse and the body, so that we could move the body
    if (mConstraint.body) {
        var pos = mConstraint.body.position;
        var offset = mConstraint.constraint.pointB;
        var m = mConstraint.mouse.position;

        /*var circleVec = createVector(pos.x, pos.y);
        var centerVec = createVector(slingshotcenter.body.position.x, slingshotcenter.body.position.y);
        var distance = dist(centerVec.x, centerVec.y, circleVec.x, circleVec.y);

        if (distance > 150) {
            var centerToPos = p5.Vector.sub(circleVec, centerVec);
            centerToPos.normalize();
            centerToPos = p5.Vector.mult(centerToPos, 150);
            centerToPos = p5.Vector.add(centerVec, centerToPos);

            mConstraint.body.position.x = centerToPos.x;
            mConstraint.body.position.y = centerToPos.y;
            //pos = mConstraint.body.position;
            //console.log(centerToPos.x);
        }*/

        stroke(0, 255, 0);
        line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
}