require('./Vector');

var Body = {};

module.exports = Body;

(function () {

    Body.rect = function (width, height, x, y) {
        this.pos = Vec2.create(x, y);
        this.rot = 1;
        this.points = [Vec2.create(-width / 2, -height / 2),
            Vec2.create(width / 2, -height / 2),
            Vec2.create(width / 2, height / 2),
            Vec2.create(-width / 2, height / 2)];
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.omega = 0.0;
        this.m = 0.9 * this.width * this.height;
        this.I = this.m * (this.width * this.width + this.height + this.height) / 12;

        return Object.assign({}, this)
    };
    Body.draw = function (ctx, scale) {
        ctx.beginPath();
        for (let i = 0; i < this.points.length + 1; i++) {
            let next = this.points[i % this.points.length]
                .copy()
                .rotate(this.rot)
                .scale(scale)
                .transpose(this.pos.x * scale, this.pos.y * scale);
            if (i === 0) {
                ctx.moveTo(next.x, next.y);
            } else {
                ctx.lineTo(next.x, next.y)
            }
        }
        ctx.fillStyle = "#000000";
        ctx.fill()

    };

    Body.update = function (dt) {
        this.pos.x += this.vx * dt;
        this.pos.y += this.vy * dt;
        this.rot += this.omega * dt;
    };

    Body.applyForce = function (fx, fy, px, py, dt) {
        px = px - this.pos.x;
        py = py - this.pos.y;
        let tau = px * fy - py * fx;
        let ax = fx / this.m;
        let ay = fy / this.m;
        this.applyAcceleration(ax, ay, tau, dt)
    };

    Body.applyAcceleration = function (ax, ay, tau, dt) {
        let alpha = tau / this.I;
        this.vx += ax * dt;
        this.vy -= ay * dt;
        this.omega += alpha * dt;
    };
}());