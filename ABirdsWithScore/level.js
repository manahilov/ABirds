/** Class representing a level. */
class Level {
    /**
     * Creates all the variables and then constructs the level from a file data provided by the config param.
     * @param {Object} canvas - The canvas that we are using.
     * @param {Object} config - A JSON object containing all of the data for our birds, pigs and walls.
     */
    constructor(canvas, config) {
        this.birds = [];
        this.pigs = [];
        this.walls = [];
        this.boundaries = [];
        this.slingshotcenter;
        this.currentBird = 0;
        this.nextBird = false;
        this.isBirdFlying = false;
        this.mouseButtonUp;
        this.wasBirdDragged = false;

        this.canvas = canvas;
        this.configdata = config;
        this.mConstraint;
        this.constraint;

        this.slingA = loadImage("images/SlingA.png");
        this.slingB = loadImage("images/SlingB.png");


        this.enableInput = false;
        this.piglength = 0;

        this.constructWorld(this.canvas);

        this.score = 0;
        this.stageCompleted = false;

        this.nextBtn = createSprite(width / 2 + 40, height / 2 + 80, 110, 50);
        this.nextBtn.addImage(playBtn);

        this.resetBtn = createSprite(width / 2 - 100, height / 2 + 80, 110, 50);
        this.resetBtn.addImage(resetBtn);

        this.scoreBgnSprite = createSprite(width / 2, height / 2, 600, 400);
        this.scoreBgnSprite.addImage(scoreBgr);

    }

    /**
     * Calls the functions for drawing the objects, if everything has stopped to load the next bird and collision detection.
     */
    draw() {

        if (this.mouseButtonUp) {
            this.releaseBird();
        }

        this.drawObjects();
        fill(255);
        textSize(35);
        text("Score: " + this.score, width - 220, height / 6 - 30);

        this.checkForNextShot();

        this.checkCollision();

        if (this.stageCompleted) {
            this.drawScorecard();
        }
    }

    /**
     * Checks if the mouse had dragged a bird and sets some flags if so.
     */
    mouseReleased() {
        if (this.wasBirdDragged == true) {
            this.mouseButtonUp = true;
            this.wasBirdDragged = false;
        }
    }

    /**
     * Checks if everything has stopped and there are more birds to be launched, if there are non, it clears the matter.js engine and sets a flag for loading the next stage.
     */
    checkForNextShot() {
        if (this.isEverythingSleeping() && this.birds.length > 1 && this.isBirdFlying) {
            this.isBirdFlying = false;
            this.nextBird = true;
            this.birds[this.currentBird].birdspr.changeAnimation("dead");
            this.loadNextBird();
        } else if (this.isEverythingSleeping() && this.birds.length == 1 && this.isBirdFlying) {
            this.birds.splice(this.currentBird, 1);
            if (this.piglength > 0) {
                lvlFailedSFX.play();
            }
            this.stageCompleted = true;
        }
    }

    /**
     * Creates and adds all of our objects and constraints to our world.
     * @param {Object} canvas - The canvas that we are using.
     */
    constructWorld(canvas) {
        this.boundaries.push(new Boundary(640, 700, width, 20, 0, false, boundaryCategory, world));
        this.boundaries.push(new Boundary(1270, 360, 20, 720, 0, false, boundaryCategory, world));
        this.boundaries.push(new Boundary(0, 360, 20, 720, 0, false, boundaryCategory, world));
        this.boundaries.push(new Boundary(640, 0, width, 20, 0, false, boundaryCategory, world));


        var pigsData = this.configdata.pigs;
        for (var pig of pigsData) {
            this.pigs.push(new Pig(pig.x, pig.y, pig.r, world));
        }
        this.piglength = this.pigs.length;

        var wallData = this.configdata.walls;
        for (var wall of wallData) {
            this.walls.push(new Wall(wall.x, wall.y, wall.w, wall.h, world));
        }

        this.slingshotcenter = new Boundary(300, 450, 10, 10, 0, true, nocolideCategory, world);

        var birdData = this.configdata.birds;
        for (var bird of birdData) {
            this.birds.push(new Bird(bird.x, bird.y, bird.r, world));
        }

        for (var i = 1; i < this.birds.length; i++) {
            this.birds[i].body.isSensor = true;
            this.birds[i].body.isStatic = true;
        }

        //Creating the slingshot and attaching the slingshot center to the current "bird" body
        var coptions = {
            bodyA: this.slingshotcenter.body,
            bodyB: this.birds[this.currentBird].body,
            length: 0,
            stiffness: 0.003
        }

        this.constraint = Constraint.create(coptions);
        World.add(world, this.constraint);

        //Creating a mouse constraint, which will later be used as a connection between the current body and the mouse
        var canvasmouse = Mouse.create(this.canvas.elt);
        canvasmouse.pixelRation = pixelDensity();
        var options = {
            mouse: canvasmouse,
            collisionFilter: {
                mask: birdCategory
            }
        }

        this.mConstraint = MouseConstraint.create(engine, options);
        World.add(world, this.mConstraint);
        this.birds[this.currentBird].body.collisionFilter.category = birdCategory;
        console.log(this.birds[this.currentBird].body.collisionFilter.category);
    }

    /**
     * When the bird is launched, it checks the distance between the sling center and the bird center and detaches the body.
     */
    releaseBird() {
        var distance = dist(this.slingshotcenter.body.position.x, this.slingshotcenter.body.position.y, this.birds[this.currentBird].body.position.x, this.birds[this.currentBird].body.position.y);
        if (distance < 30) {
            birdflySFX.play();
            this.isBirdFlying = true;
            this.constraint.bodyB = null;
            this.mouseButtonUp = false;
            this.birds[this.currentBird].body.collisionFilter.category = nonCurrentBirdCategory;
        }
    }

    /**
     * Removes the launched bird and loads the next one on the slingshot.
     */
    loadNextBird() {
        if (this.nextBird == true) {
            this.birds[this.currentBird].removeFromWorld();
            this.birds.splice(this.currentBird, 1);
            this.birds[this.currentBird].body.isSensor = false;
            this.birds[this.currentBird].body.isStatic = false;
            this.birds[this.currentBird].body.collisionFilter.category = birdCategory;
            Body.setPosition(this.birds[this.currentBird].body, {
                x: 300,
                y: 440
            });
            this.constraint.bodyB = this.birds[this.currentBird].body;
            this.nextBird = false;
        }
    }

    /**
     * Draws all the object and if there are no pigs left, it changes a flag to indicate next level.
     */
    drawObjects() {
        //Drawing and checking for sleep in the circles
        image(this.slingB, 300, 450, 45, 200);

        for (var i = 0; i < this.birds.length; i++) {
            this.birds[i].show();

            if (!this.isBirdFlying) {
                push();
                strokeWeight(10);
                stroke(78, 46, 40);
                line(this.slingshotcenter.body.position.x + 30, this.slingshotcenter.body.position.y + 30, this.birds[this.currentBird].body.position.x - 15, this.birds[this.currentBird].body.position.y);
                //Draws a line between the sling center and the current body
                line(this.slingshotcenter.body.position.x - 20, this.slingshotcenter.body.position.y + 30, this.birds[this.currentBird].body.position.x - 15, this.birds[this.currentBird].body.position.y);
                pop();

            }
            //centerline
            //line(this.slingshotcenter.body.position.x, this.slingshotcenter.body.position.y, this.birds[this.currentBird].body.position.x, this.birds[this.currentBird].body.position.y);
        }
        image(this.slingA, 265, 455, 50, 110);


        for (var i = 0; i < this.boundaries.length; i++) {
            this.boundaries[i].show();
        }

        for (var i = 0; i < this.pigs.length; i++) {
            this.pigs[i].show();
            if (this.pigs[i].body.label == "pigIsDying") {
                this.pigs[i].body.label = "pigDead";
                this.pigs[i].removeFromWorld();
                this.pigs[i].pigspr.changeAnimation("pigdead");
                this.score += 1000;
                this.piglength--;
                if (this.piglength == 0) {
                    lvlVictorySFX.play();
                    this.stageCompleted = true;
                }
                setTimeout(this.removePig, 2000, this.pigs, this.pigs[i], i);


            }
        }

        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].show();
        }

        if (this.mConstraint.body) {
            if (this.mConstraint.body.label == "bird") {
                if (this.wasBirdDragged == false) {
                    slingSFX.play();
                }
                this.wasBirdDragged = true;
            }
            var pos = this.mConstraint.body.position;
            var offset = this.mConstraint.constraint.pointB;
            var m = this.mConstraint.mouse.position;

            stroke(0, 255, 0);
            line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
        }
    }

    removePig(pigsarr, pig, index, flag) {
        pig.body.isSensor = true;
        pig.body.isStatic = true;
        pig.pigspr.visible = false;
        //pig.removeFromWorld();
        pigsarr.splice(index, 1);
        if (pigsarr.length == 0) {}
    }

    /**
     * Checks if all objects have stopped moving.
     * @returns {boolean} - Has everything stopped
     */
    isEverythingSleeping() {
        var bodies = Composite.allBodies(world);
        var sleeping = bodies.filter((body) => body.speed < 0.30 ? true : false);
        var isWorldSleeping = bodies.length === sleeping.length;
        return isWorldSleeping;
    }

    /**
     * Checks if there was a collision that involved a pig and if so, it checks for the impact and if it's above a threshold, it marks it for removal.
     */
    checkCollision() {
        Events.on(engine, 'collisionStart', function (event) {
            var pairs = event.pairs;

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];

                if (pair.bodyA.label == "boundary" || pair.bodyB.label == "boundary") {
                    if (pair.bodyA.label == "pig" || pair.bodyB.label == "pig") {
                        var relativeMomentum = Vector.sub(pair.bodyA.velocity, pair.bodyB.velocity);
                        if (Vector.magnitude(relativeMomentum) > 7) {
                            pigColSFX.play();
                            pair.bodyA.label = pair.bodyA.label == "pig" ? "pigIsDying" : pair.bodyA.label;
                            pair.bodyB.label = pair.bodyB.label == "pig" ? "pigIsDying" : pair.bodyB.label;
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
                            if (Vector.magnitude(relativeMomentum) > threshold) {
                                pigColSFX.play();
                                pair.bodyA.label = pair.bodyA.label == "pig" ? "pigIsDying" : pair.bodyA.label;
                                pair.bodyB.label = pair.bodyB.label == "pig" ? "pigIsDying" : pair.bodyB.label;
                            }
                        }
                    }
                }
            }
        });
    }

    drawScorecard() {
        push();
        drawSprite(this.scoreBgnSprite);
        fill(51, 26, 0);
        textSize(40);
        text("Level Cleared!", width / 2 - 80, 290);
        text("Score: " + this.score, width / 2 - 130, height / 2 + 10);
        //fill(255);
        //rect(width / 2 - 130, height / 2 + 40, 110, 50);
        //fill(255);
        // rect(width / 2 + 10, height / 2 + 40, 110, 50);
        drawSprite(this.nextBtn);
        drawSprite(this.resetBtn);
        pop();

    }

    mousePressed() {
        if (this.stageCompleted) {
            if (mouseX > this.nextBtn.position.x - this.nextBtn.width / 2 && mouseX < this.nextBtn.position.x + this.nextBtn.width / 2 && mouseY > this.nextBtn.position.y - this.nextBtn.height / 2 && mouseY < this.nextBtn.position.y + this.nextBtn.height / 2) {
                clearEngine();
                levelCompleted = true;
            }

            if (mouseX > this.resetBtn.position.x - this.resetBtn.width / 2 && mouseX < this.resetBtn.position.x + this.resetBtn.width / 2 && mouseY > this.resetBtn.position.y - this.resetBtn.height / 2 && mouseY < this.resetBtn.position.y + this.resetBtn.height / 2) {
                this.resetLevel();
            }
        }
    }

    resetLevel() {
        clearEngine();
        this.birds = [];
        this.pigs = [];
        this.walls = [];
        this.boundaries = [];
        this.currentBird = 0;
        this.nextBird = false;
        this.isBirdFlying = false;
        this.wasBirdDragged = false;

        this.enableInput = false;

        this.constructWorld(this.canvas);

        this.score = 0;
        this.stageCompleted = false;
    }
}
/**
 * Prepares the world and the engine for the next level by clearing them.
 */
function clearEngine() {
    World.clear(engine.world);
    Engine.clear(engine);
}