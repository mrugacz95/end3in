import { Vec2 } from "./Vector";
import { Utils } from "./Utlis";

export abstract class Body {
    pos: Vec2;
    rot: number;
    v: Vec2;
    omega: number;
    readonly isStatic: boolean;
    readonly massInv: number;
    readonly inertiaInv: number;
    readonly restitution: number;
    color: string;
    transformUpdateRequired: boolean;

    protected constructor(
        x: number,
        y: number,
        mass: number,
        inertia: number,
        isStatic: boolean = false,
        rot: number = 0,
        restitution: number = 0.5,
        color: string = Utils.randomColor()) {
        this.pos = new Vec2(x, y)
        this.rot = rot
        this.isStatic = isStatic;
        if (this.isStatic) {
            this.massInv = 0
            this.inertiaInv = 0
        } else {
            this.massInv = 1 / mass
            this.inertiaInv = 1 / inertia
        }
        this.restitution = restitution
        this.color = color
        this.v = Vec2.ZERO
        this.omega = 0
        this.transformUpdateRequired = true
    }

    update(dt: number) {
        this.pos = this.pos.add(this.v.scale(dt))
        // this.rot += this.omega * dt;
        this.transformUpdateRequired = true;
    };

    applyForce(fx: number, fy: number, px: number, py: number, dt: number) {
        px = px - this.pos.x;
        py = py - this.pos.y;
        let tau = px * fy - py * fx;
        let ax = fx * this.massInv;
        let ay = fy * this.massInv;
        this.applyAcceleration(new Vec2(ax, ay), tau, dt)
    };

    applyAcceleration(a: Vec2, tau: number, dt: number) {
        let alpha = tau * this.inertiaInv;
        this.v = this.v.add(a.scale(dt))
        this.omega += alpha * dt;
    };

    applyImpulse(P: Vec2, r: Vec2) {
        if (this.isStatic) {
            return
        }
        this.v = this.v.sub(new Vec2(P.x * this.massInv, P.y * this.massInv))
        this.omega -= this.inertiaInv * r.cross(P);
    };

    abstract isInside(point: Vec2): boolean
}


export class Polygon extends Body {
    points: Vec2[] = [];
    private _transformedPoints: Vec2[] = [];
    private area: number;

    constructor(points: number[][], x: number, y: number, mass: number, isStatic: boolean, rot: number) {
        const vertices = points.map(p => new Vec2(p[0], p[1]));
        const maxR = (Math.max.apply(Math, vertices.map((v) => (v.sqrtMagnitude()))));
        const inertia = (mass * maxR * maxR) / 2;
        super(x, y, mass, inertia, isStatic, rot);
        let area = 0;
        for (let i = 0; i < vertices.length; i++) {
            const point = vertices[i]
            const next: Vec2 = vertices[i % vertices.length]
            area += (point.x * next.y) - (point.y * next.x);
        }
        area /= 2.0;
        this.area = area;
        const meanX = vertices.map((o) => o.x).reduce((p, c) => p + c, 0) / points.length;
        const meanY = vertices.map((o) => o.y).reduce((p, c) => p + c, 0) / points.length;
        for (let point of vertices) {
            this.points.push(new Vec2(point.x - meanX, point.y - meanY));
        }
    }

    get transformedPoints(): Vec2[] {
        if (this.transformUpdateRequired === false) {
            return this._transformedPoints
        }
        for (let i = 0; i < this.points.length; i++) {
            this._transformedPoints[i] = this.points[i].rotate(this.rot).add(this.pos)
        }
        this.transformUpdateRequired = false;
        return this._transformedPoints;
    };

    get transformedAxes() {
        let result = [];
        for (let i = 0; i < this.transformedPoints.length; i++) {
            let first = this.transformedPoints[i];
            let second = this.transformedPoints[(i + 1) % this.transformedPoints.length];
            result.push({axis: second.sub(first), p1: first, p2: second})
        }
        return result;
    };

    isInside(point: Vec2): boolean {
        for (let a of this.transformedAxes) {
            let d = a.axis.cross(a.p2.sub(point));
            if (d > 0) return false;
        }
        return true;
    }
}

export class RegularPolygon extends Polygon {
    constructor(num_of_vertices: number, radius: number, x: number, y: number, mass: number, isStatic: boolean, rot: number) {
        let points = [];
        for (let i = num_of_vertices - 1; i >= 0; i--) {
            let pos_x = Math.cos(2.0 * Math.PI / num_of_vertices * i) * radius;
            let pos_y = Math.sin(2.0 * Math.PI / num_of_vertices * i) * radius;
            points.push([pos_x, pos_y])
        }
        super(points, x, y, mass, isStatic, rot)
    };
}

export class Rectangle extends Polygon {
    constructor(width: number, height: number, x: number, y: number, mass: number, isStatic: boolean, rot: number) {
        const points = [[-width / 2, height / 2],
            [width / 2, height / 2],
            [width / 2, -height / 2],
            [-width / 2, -height / 2]];
        super(points, x, y, mass, isStatic, rot);
    }
}

export class Circle extends Body {
    radius: number;
    constructor(x: number, y: number, radius: number, mass: number) {
        const inertia = 2 / (mass * radius * radius);
        super(x, y, mass, inertia);
        this.radius = radius;
    }

    isInside(point: Vec2): boolean {
        return false;
    }
}