class Box {
    constructor(x, y, w, h) {
        var options = {
            friction: 0.001,
            restitution: 0.6,
            label: "box"
        };

        this.body = Bodies.rectangle(x, y, w, h, options);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        World.add(world, this.body);
    }
    show() {
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(2);
        stroke(255);
        fill(127);
        rect(0, 0, this.w, this.h);
        pop();
    }
}