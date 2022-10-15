require('./Vector');

var Body = {};

module.exports = Body;

(function () {

    Body.rect = function (width, height, x, y, options = {}) {
        this.pos = Vec2.create(x, y);
        this.rot = options.rot || 0.0;
        this.points = [Vec2.create(-width / 2, -height / 2),
            Vec2.create(width / 2, -height / 2),
            Vec2.create(width / 2, height / 2),
            Vec2.create(-width / 2, height / 2)];
        this.width = width;
        this.height = height;
        this.v = Vec2.create(0, 0);
        this.omega = 0.0;
        if (options.isStatic) {
            this.m = 0;
            this.mInv = 0;
            this.IInv = 0;
        } else {
            this.m = 900 * this.width * this.height;
            this.mInv = 1.0 / this.m;
            this.IInv = 12.0 / (this.m * (this.width * this.width + this.height + this.height));
        }
        if (options.color) {
            this.color = options.color
        } else {
            this.color = this.randomColor()
        }
        this.isStatic = options.isStatic || false;
        this.type = 'polygon';
        return Object.assign({}, this)
    };

    Body.randomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    Body.polygon = function (vertices, x, y, options = {}) {
        this.pos = Vec2.create(x, y);
        this.rot = options.rot || 0.0;
        this.points = [];
        let meanX = vertices.map((o) => o[0]).reduce((p, c) => p + c, 0) / vertices.length;
        let meanY = vertices.map((o) => o[1]).reduce((p, c) => p + c, 0) / vertices.length;
        for (let pair of vertices) {
            this.points.push(Vec2.create(pair[0] - meanX, pair[1] - meanY));
        }
        this.v = Vec2.create(0, 0);
        this.omega = 0.0;
        if (options.isStatic) {
            this.m = 0;
            this.mInv = 0;
            this.IInv = 0;
        } else {
            let area = 0;
            let last = this.points[this.points.length - 1];
            for (let point of this.points) {
                area += (last.x * point.y) - (last.y * point.x);
                last = point
            }
            area /= 2.0;
            this.m = 900 * Math.abs(area);
            // aprox with circle
            this.mInv = 1.0 / this.m;
            const maxR = (Math.max.apply(Math, this.points.map((v) => (v.sqrtMagnitude()))));
            this.IInv = 2 / (this.m * maxR * maxR);
        }
        if (options.color) {
            this.color = options.color
        } else {
            this.color = this.randomColor()
        }
        this.isStatic = options.isStatic || false;
        this.type = 'polygon';
        return Object.assign({}, this)
    };

    Body.regularPolygon = function (num_of_vertices, radius, x, y, options = {}) {
        let positions = [];
        for (let i = 0; i < num_of_vertices; i++) {
            let pos_x = Math.cos(2.0 * Math.PI / num_of_vertices * i) * radius;
            let pos_y = Math.sin(2.0 * Math.PI / num_of_vertices * i) * radius;
            positions.push([pos_x, pos_y])
        }
        return Body.polygon(positions, x, y, options)
    };

    Body.circle = function (x, y, radius, options = {}) {
        this.pos = Vec2.create(x, y);
        this.rot = 0.0;
        this.v = Vec2.create(0, 0);
        this.omega = 0.0;
        this.IInv = 0;
        if (options.isStatic) {
            this.m = 0;
            this.mInv = 0;
        } else {
            let area = 2 * Math.PI * radius * radius;
            this.m = 900 * area;
            // aprox with circle
            this.mInv = 1.0 / this.m;
            this.IInv = 2 / (this.m * radius * radius);
        }
        if (options.color) {
            this.color = options.color
        } else {
            this.color = this.randomColor()
        }
        this.isStatic = options.isStatic || false;
        this.type = 'circle';
        this.radius = radius;
        return Object.assign({}, this)
    };

    Body.draw = function (ctx, debug) {
        if (this.type === 'polygon') {
            ctx.beginPath();
            for (let i = 0; i < this.points.length + 1; i++) {
                let next = this.points[i % this.points.length]
                    .rotate(this.rot)
                    .transpose(this.pos.x, this.pos.y);
                if (i === 0) {
                    ctx.moveTo(next.x, next.y);
                } else {
                    ctx.lineTo(next.x, next.y)
                }
            }
            ctx.fillStyle = this.color;
            ctx.fill();
            if (debug) {
                for (axis of this.axes()) {
                    let mid = axis.p1.add(axis.p2).scale(0.5).rotate(this.rot).add(this.pos);
                    let norm = axis.axis.rotate(this.rot).normal();
                    ctx.lineWidth = 1 / engine.scale;
                    ctx.strokeStyle = "#7a7a7a";
                    ctx.beginPath();
                    ctx.moveTo(mid.x, mid.y);
                    ctx.lineTo(mid.x + norm.x, mid.y + norm.y);
                    ctx.stroke()
                }

            }
        } else if (this.type === 'circle') {
            ctx.lineWidth = 1 / engine.scale;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }

    };

    Body.update = function (dt) {
        this.pos.x += this.v.x * dt;
        this.pos.y += this.v.y * dt;
        this.rot += this.omega * dt;
    };

    Body.applyForce = function (fx, fy, px, py, dt) {
        px = px - this.pos.x;
        py = py - this.pos.y;
        let tau = px * fy - py * fx;
        let ax = fx * this.mInv;
        let ay = fy * this.mInv;
        this.applyAcceleration(ax, ay, tau, dt)
    };

    Body.applyAcceleration = function (ax, ay, tau, dt) {
        let alpha = tau * this.IInv;
        this.v.x += ax * dt;
        this.v.y -= ay * dt;
        this.omega += alpha * dt;
    };

    Body.applyImpulse = function (P, r) {
        if (this.isStatic) {
            return
        }
        this.v.x -= P.x * this.mInv;
        this.v.y -= P.y * this.mInv;
        this.omega -= this.IInv * r.cross(P);
    };

    Body.axes = function () {
        let result = [];
        for (let i = 0; i < this.points.length; i++) {
            let first = this.points[i].copy();
            let second = this.points[(i + 1) % this.points.length].copy();
            result.push({"axis": first.copy().sub(second), "p1": first, "p2": second})
        }
        return result;
    };

    Body.isInside = function (point) {
        for (a of this.axes()) {
            let p1 = a.p1.rotate(this.rot).transpose(this.pos.x, this.pos.y);
            let p2 = a.p2.rotate(this.rot).transpose(this.pos.x, this.pos.y);
            let s = p1.sub(p2);
            let d = s.cross(point.sub(p2));
            if (d > 0) return false;
        }
        return true;
    };
}());