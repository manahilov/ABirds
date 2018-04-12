class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.active = false;
        var options = {
            friction: 0.001,
            label: "circle",
            restitution: 0.6,
        };

        this.body = Bodies.circle(x, y, r, options);
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
        ellipse(0, 0, this.r * 2);
        line(0, 0, this.r, 0);
        pop();
    }
}