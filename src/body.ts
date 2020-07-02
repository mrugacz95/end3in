import {Vec2} from "./vector";

/**
 * Base class for all bodies. This object is simple point body without volume.
 */
export class Body {
    pos: Vec2
    rot: number
    omega: number
    v: Vec2 = Vec2.zero()
    m: number
    mInv: number
    inertia: number
    inertiaInv: number
    isStatic: boolean
    color: string
    points: Array<Vec2> = []

    constructor(m: number = 0,
                inertia: number = 0) {
        this.pos = Vec2.zero()
        this.rot = 0.0
        this.omega = 0.0
        this.color = Body.randomColor()
        this.m = m
        this.mInv = m == 0 ? 0 : 1 / m
        this.inertia = inertia
        this.inertiaInv = inertia == 0 ? 0 : 1 / inertia
        this.isStatic = false
        this.color = Body.randomColor()
    }

    position(pos: Vec2) {
        this.pos = pos
        return this
    }

    rotation(rot: number) {
        this.rot = rot
        return this
    }

    velocity(v: Vec2) {
        this.v = v
        return this
    }

    update(dt: number) {
        if (this.isStatic) {
            return
        }
        this.pos.x += this.v.x * dt;
        this.pos.y += this.v.y * dt;
        this.rot += this.omega * dt;
    }

    applyImpulse(P, r) {
        if (this.isStatic) {
            return
        }
        this.v = this.v.sub(P.scale(this.mInv))
        this.omega -= this.inertiaInv * r.cross(P);
    };

    applyForce(f: Vec2, p: Vec2, dt) {
        if (this.isStatic) {
            return
        }
        let pos = p.sub(this.pos);
        let tau = pos.cross(f);
        let a = f.scale(this.mInv);
        this.applyAcceleration(a, tau, dt)
    };

    applyAcceleration(a: Vec2, tau: number, dt: number) {
        if (this.isStatic) {
            return
        }
        let alpha = tau * this.inertiaInv;
        this.v = this.v.add(a.scale(dt))
        this.omega += alpha * dt;
    };

    isInside(point: Vec2) {
        return false
    };

    draw(ctx: CanvasRenderingContext2D, debug: boolean) {
        ctx.beginPath();
        let r = 0.2
        ctx.moveTo(r, -r);
        ctx.lineTo(-r, r);
        ctx.moveTo(r, r);
        ctx.lineTo(-r, -r);
        ctx.stroke();
    }

    private static randomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    orientedPoints(){
        let points :Array<Vec2>=[]
        for(let p of this.points){
            points.push(p.rotate(this.rot).add(this.pos))
        }
        return points
    }
}

export class Polygon extends Body {

    constructor(points: Array<Vec2>) {
        const density = 0.001

        // calculate geometrical center
        const center = points.reduce((p, c) => p.add(c), Vec2.zero()).scale(points.length);

        // sub center
        for (let i =0;i<points.length;i++) {
            points[i] = points[i].sub(center)
        }

        // calculate area
        let area = 0,
            last = points[points.length - 1]
        for (let point of points) {
            area += last.cross(point)
            last = point
        }
        area = Math.abs(area / 2.0)
        let m = density * area

        // approximate inertia with circle
        const maxR = Math.max(...points.map((v) => (v.sqrtMagnitude())))
        let inertia = (m * maxR * maxR) / 2

        super(m, inertia);
        this.points = points

    }

    axes() { //todo check if correct and should be probably cached
        let result = [];
        for (let i = 0; i < this.points.length; i++) {
            let first = this.points[i].copy();
            let second = this.points[(i + 1) % this.points.length].copy();
            result.push({"axis": first.copy().sub(second), "p1": first, "p2": second})
        }
        return result;
    };

    draw(ctx, debug) {
        ctx.beginPath();
        for (let i = 0; i < this.points.length + 1; i++) {
            let next = this.points[i % this.points.length]
            if (i === 0) {
                ctx.moveTo(next.x, next.y);
            } else {
                ctx.lineTo(next.x, next.y)
            }
        }
        ctx.fillStyle = this.color;
        ctx.fill();
        if (debug) {
            for (let axis of this.axes()) {
                let mid = axis.p1.add(axis.p2).scale(0.5).rotate(this.rot).add(this.pos);
                let norm = axis.axis.rotate(this.rot).normal();
                ctx.strokeStyle = "#7a7a7a";
                ctx.beginPath();
                ctx.moveTo(mid.x, mid.y);
                ctx.lineTo(mid.x + norm.x, mid.y + norm.y);
                ctx.stroke()
            }

        }
    }

    isInside(point) {
        for (let a of this.axes()) {
            let p1 = a.p1.rotate(this.rot).add(this.pos);
            let p2 = a.p2.rotate(this.rot).add(this.pos);
            let s = p1.sub(p2);
            let d = s.cross(point.sub(p2));
            if (d > 0) return false;
        }
        return true;
    };
}

export class Rect extends Polygon {
    width: number
    height: number

    constructor(width: number, height: number) {

        let points = [new Vec2(-width / 2, -height / 2),
            new Vec2(width / 2, -height / 2),
            new Vec2(width / 2, height / 2),
            new Vec2(-width / 2, height / 2)];
        super(points);
        this.width = width
        this.height = height
    }
}

// class Circle extends Body {
//     radius: number
//
//     draw(ctx, debug) {
//         ctx.lineWidth = 1 / engine.scale;
//         ctx.beginPath();
//         ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
//         ctx.stroke();
//     }
// }
//

//
// module.exports = Body;
//
// (function () {
//
//
//     Body.regularPolygon = function (num_of_vertices, radius, x, y, options = {}) {
//         let positions = [];
//         for (let i = 0; i < num_of_vertices; i++) {
//             let pos_x = Math.cos(2.0 * Math.PI / num_of_vertices * i) * radius;
//             let pos_y = Math.sin(2.0 * Math.PI / num_of_vertices * i) * radius;
//             positions.push([pos_x, pos_y])
//         }
//         return Body.polygon(positions, x, y, options)
//     };
//
//     Body.circle = function (x, y, radius, options = {}) {
//         this.pos = Vec2.create(x, y);
//         this.rot = 0.0;
//         this.v = Vec2.create(0, 0);
//         this.omega = 0.0;
//         this.IInv = 0;
//         if (options.isStatic) {
//             this.m = 0;
//             this.mInv = 0;
//         } else {
//             let area = 2 * Math.PI * radius * radius;
//             this.m = 900 * area;
//             // aprox with circle
//             this.mInv = 1.0 / this.m;
//             this.IInv = 2 / (this.m * radius * radius);
//         }
//         if (options.color) {
//             this.color = options.color
//         } else {
//             this.color = this.randomColor()
//         }
//         this.isStatic = options.isStatic || false;
//         this.type = 'circle';
//         this.radius = radius;
//         return Object.assign({}, this)
//     };
//
//
// }());