class Boundary {
    constructor(x, y, w, h, a, sensor) {
        var options = {
            friction: 0,
            angle: a,
            restitution: 0.1,
            isStatic: true,
            label: "boundry",
            isSensor: sensor
        };

        this.body = Bodies.rectangle(x, y, w, h, options);
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
        strokeWeight(1);
        noStroke();
        fill(0);
        rect(0, 0, this.w, this.h);
        pop();
    }
}