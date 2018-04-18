class Bird {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
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
        console.log(this.body);
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
        fill(127);
        //imageMode(CENTER);
        //image(birdimg, 0, 0, this.r * 2, this.r * 2);
        ellipse(0, 0, this.r * 2);
        line(0, 0, this.r, 0);
        pop();
    }
}