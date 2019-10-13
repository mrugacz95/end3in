class Body {
    constructor(width, height) {
        this.x = 3;
        this.y = 4;
        this.rot = 0;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.omega = 1.0;
        this.m = 0.9 * this.width * this.height;
        this.I = this.m * (this.width * this.width + this.height + this.height) / 12
    }

    draw(ctx, scale) {
        ctx.save();
        ctx.translate(this.x * scale, this.y * scale);
        ctx.rotate(this.rot);
        ctx.fillStyle = "#000000";
        ctx.fillRect(-this.width / 2 * scale, -this.height / 2 * scale, this.width * scale, this.height * scale);
        ctx.fillStyle = "#FF00FF";
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.rot += this.omega * dt;
    }

    applyForce(fx, fy, px, py, dt) {
        px = px - this.x;
        py = py - this.y;
        let tau = px * fy - py * fx;
        let ax = fx / this.m;
        let ay = fy / this.m;
        this.applyAcceleration(ax, ay, tau, dt)
    }

    applyAcceleration(ax, ay, tau, dt) {
        let alpha = tau / this.I;
        this.vx += ax * dt;
        this.vy -= ay * dt;
        this.omega += alpha * dt;
    }

}