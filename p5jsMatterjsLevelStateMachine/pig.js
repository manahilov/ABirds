/** Class representing a Pig object. */

class Pig {
    /**
     * Creates and add a pig to the physics world.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} r - The pig's radius.
     * @param {Object} world - The current world.
     */
    constructor(x, y, r, world) {
        var options = {
            friction: 0.001,
            restitution: 0.6,
            label: "pig",
            collisionFilter: {
                category: pigCategory,
                mask: boundaryCategory | birdCategory | wallCategory | pigCategory
            }
        };

        this.body = Bodies.circle(x, y, r, options);
        this.x = x;
        this.y = y;
        this.r = r;
        this.world = world

        World.add(this.world, this.body);
    }

    /**
     * Removes the current body from the physics world.
     */
    removeFromWorld() {
        World.remove(this.world, this.body);
    }

    /**
     * Draws the pig onto the screen with the position and angle from the physics body.
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
        fill(144, 0, 144);
        ellipse(0, 0, this.r * 2);
        line(0, 0, this.r, 0);
        pop();
    }
}