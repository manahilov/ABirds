/** Class representing a Bird object. */
class Bird {
    /**
     * Creates and add a bird to the physics world.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} r - The bird's radius.
     * @param {Object} world - The current world.
     */
    constructor(x, y, r, world) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.world = world;
        var options = {
            friction: 0.001,
            label: "bird",
            restitution: 0.6,
            collisionFilter: {
                category: nonCurrentBirdCategory,
                mask: pigCategory | boundaryCategory | wallCategory | birdCategory
            }
        };

        this.body = Bodies.circle(x, y, r, options);
        World.add(this.world, this.body);
    }

    /**
     * Removes the current body from the physics world.
     */
    removeFromWorld() {
        World.remove(this.world, this.body);
    }

    /**
     * Draws the bird onto the screen with the position and angle from the physics body.
     */
    show() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(255);
        fill(127);
        ellipse(0, 0, this.r * 2);
        line(0, 0, this.r, 0);
        pop();
    }
}