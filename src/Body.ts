import { Vec2 } from "./Vector";

require("./Vector");
const Utils = require("./Utlis");


export enum Type {
    Polygon,
    Circle
}

export abstract class Body {
    pos: Vec2;
    protected v: Vec2;
    readonly type: Type;
    readonly rot: number;
    protected omega;
    readonly isStatic: boolean;
    readonly massInv: number;
    readonly InertiaInv: number;
    readonly restitution: number;
    readonly color: string;
    transformUpdateRequired: boolean;

    protected constructor(
        x: number,
        y: number,
        mass: number,
        inertia: number,
        type: Type,
        isStatic: boolean = false,
        rot: number = 0,
        restitution: number = 0.5,
        color: string = Utils.randomColor()) {
        this.pos = new Vec2(x, y)
        this.type = type
        this.rot = rot
        this.isStatic = isStatic;
        if (this.isStatic) {
            this.massInv = 0
            this.InertiaInv = 0
        } else {
            this.massInv = 1 / mass
            this.InertiaInv = 1 / inertia
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
        let alpha = tau * this.InertiaInv;
        this.v = this.v.add(a.scale(dt))
        this.omega += alpha * dt;
    };

    applyImpulse(P: Vec2) {
        if (this.isStatic) {
            return
        }
        this.v = this.v.sub(new Vec2(P.x * this.massInv, P.y * this.massInv))
        // this.omega -= this.IInv * r.cross(P);
    };

    abstract isInside(point: Vec2): boolean
}


export class Polygon extends Body {
    points: Vec2[] = [];
    private _transformedPoints: Vec2[] = [];
    private area: number;

    constructor(points: Vec2[], x: number, y: number, mass: number, isStatic: boolean, rot: number) {
        const maxR = (Math.max.apply(Math, points.map((v) => (v.sqrtMagnitude()))));
        const inertia = (mass * maxR * maxR) / 2;
        super(x, y, mass, inertia, Type.Polygon, isStatic, rot);
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const point = points[i]
            const next: Vec2 = points[i % points.length]
            area += (point.x * next.y) - (point.y * next.x);
        }
        area /= 2.0;
        this.area = area;
        const meanX = points.map((o) => o.x).reduce((p, c) => p + c, 0) / points.length;
        const meanY = points.map((o) => o.y).reduce((p, c) => p + c, 0) / points.length;
        for (let point of points) {
            this.points.push(new Vec2(point.x - meanX, point.y - meanY));
        }
    }

    get transformedPoints() : Vec2[] {
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
            points.push(new Vec2(pos_x, pos_y))
        }
        super(points, x, y, mass, isStatic, rot)
    };
}

export class Rectangle extends Polygon {
    constructor(width: number, height: number, x: number, y: number, mass: number, isStatic: boolean, rot: number) {
        const points = [new Vec2(-width / 2, height / 2),
            new Vec2(width / 2, height / 2),
            new Vec2(width / 2, -height / 2),
            new Vec2(-width / 2, -height / 2)];
        super(points, x, y, mass, isStatic, rot);
    }
}

export class Circle extends Body {
    constructor(x: number, y: number, radius: number, mass: number) {
        const inertia = 2 / (mass * radius * radius);
        super(x, y, mass, inertia, Type.Circle);
    }

    isInside(point: Vec2): boolean {
        return false;
    }
}