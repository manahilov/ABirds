/** Class representing a Boundary object. */
class Boundary {
    /**
     * Creates and add a boundary to the physics world.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - width.
     * @param {number} h - height.
     * @param {number} a - angle.
     * @param {boolean} sensor - Is it a sensor.
     * @param {number} mask - The mask number of the object.
     * @param {Object} world - The current world.
     */
    constructor(x, y, w, h, a, sensor, mask, world) {
        var options = {
            friction: 0,
            angle: a,
            restitution: 0.1,
            isStatic: true,
            label: "boundary",
            isSensor: sensor,
            collisionFilter: {
                category: mask
            }
        };

        this.body = Bodies.rectangle(x, y, w, h, options);
        this.w = w;
        this.h = h;
        this.world = world;
        World.add(this.world, this.body);
    }

    /**
     * Draws the boundary onto the screen with the position and angle from the physics body.
     */
    show() {
        var pos = this.body.position;
        var angle = this.body.angle;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }
}