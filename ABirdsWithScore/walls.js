/** Class representing a Wall object. */
class Wall {
    /**
     * Creates and add a boundary to the physics world.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} w - width.
     * @param {number} h - height.
     * @param {Object} world - The current world.
     */
    constructor(x, y, w, h, world) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.world = world;
        var options = {
            friction: 0.001,
            restitution: 0.2,
            label: "wall",
            collisionFilter: {
                category: wallCategory,
                mask: pigCategory | birdCategory | boundaryCategory | wallCategory
            }
        };

        this.body = Bodies.rectangle(x, y, w, h, options);


        World.add(this.world, this.body);
    }

    /**
     * Draws the wall onto the screen with the position and angle from the physics body.
     */
    show() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        stroke(120, 90, 30);
        fill(96, 62, 17);
        rect(0, 0, this.w, this.h);
        pop();
    }
}