class Pig {
    constructor(x, y, r) {
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

        World.add(world, this.body);
    }


    removeFromWorld() {
        World.remove(world, this.body);
    }

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