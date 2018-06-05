/** Class representing a Rock object. */
class Rock {
    /**
     * Creates and add a rock to the physics world.
     * @param {number} x - The x position.
     * @param {number} y - The y position.
     * @param {number} r - The rock's radius.
     * @param {Object} world - The current world.
     */
    constructor(x, y, r, world) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.world = world;
        var options = {
            friction: 0.001,
            restitution: 0.2,
            label: "rock",
            collisionFilter: {
                category: wallCategory,
                mask: pigCategory | birdCategory | boundaryCategory | wallCategory
            }
        };

        this.body = Bodies.circle(x, y, r, options);
        this.img = loadImage("images/rock.png");

        World.add(this.world, this.body);
    }

    /**
     * Draws the rock onto the screen with the position and angle from the physics body.
     */
    show() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        strokeWeight(1);
        image(this.img, -this.r, -this.r, this.r * 2, this.r * 2);
        pop();
    }
}