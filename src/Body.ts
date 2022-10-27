import { Vec2 } from "./Vector";
import { Utils } from "./Utlis";
import { AABB } from "./AABB";

export abstract class Body {
    protected _pos = Vec2.ZERO;
    protected _rot = 0;
    v = Vec2.ZERO;
    omega = 0;
    readonly isStatic: boolean;
    readonly massInv: number;
    readonly inertiaInv: number;
    readonly restitution: number;
    color: string;
    transformUpdateRequired: boolean;
    private _cachedAABB: AABB

    get AABB(): AABB {
        if (this._cachedAABB === null) {
            this._cachedAABB = this._AABB
        }
        return this._cachedAABB
    }

    protected abstract get _AABB(): AABB

    protected constructor(
        mass: number,
        inertia: number,
        isStatic = false,
        restitution = 0.3,
        color: string = Utils.randomColor()) {
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
        this._cachedAABB = null
    }

    update(dt: number) {
        if (this.isStatic){
            return
        }
        this.pos = this.pos.add(this.v.scale(dt))
        this.rot += this.omega * dt;
        this.transformUpdateRequired = true;
        this._cachedAABB = null
    }

    applyAcceleration(a: Vec2, dt: number) {
        this.v = this.v.add(a.scale(dt))
    }

    get pos(): Vec2{
        return this._pos
    }
    set pos(value: Vec2){
        this._pos = value
        this.transformUpdateRequired = true
    }

    get rot(): number{
        return this._rot
    }
    set rot(value: number){
        this._rot = value
        this.transformUpdateRequired = true
    }


    abstract isInside(point: Vec2): boolean
}


export class Polygon extends Body {
    points: Vec2[] = [];
    private _transformedPoints: Vec2[] = [];

    constructor(points: number[][], mass: number, inertia: number, isStatic: boolean) {
        super(mass, inertia, isStatic);
        const vertices = points.map(p => new Vec2(p[0], p[1]));
        const meanX = vertices.map((o) => o.x).reduce((p, c) => p + c, 0) / points.length;
        const meanY = vertices.map((o) => o.y).reduce((p, c) => p + c, 0) / points.length;
        for (const point of vertices) {
            this.points.push(new Vec2(point.x - meanX, point.y - meanY));
        }
    }

    get transformedPoints(): Vec2[] {
        if (this.transformUpdateRequired === false) {
            return this._transformedPoints
        }
        for (let i = 0; i < this.points.length; i++) {
            this._transformedPoints[i] = this.points[i].rotate(this._rot).add(this.pos)
        }
        this.transformUpdateRequired = false;
        return this._transformedPoints;
    }

    get transformedAxes() {
        const result = [];
        for (let i = 0; i < this.transformedPoints.length; i++) {
            const first = this.transformedPoints[i];
            const second = this.transformedPoints[(i + 1) % this.transformedPoints.length];
            result.push({axis: second.sub(first), p1: first, p2: second})
        }
        return result;
    }

    isInside(point: Vec2): boolean {
        for (const a of this.transformedAxes) {
            const d = a.axis.cross(a.p2.sub(point));
            if (d > 0) return false;
        }
        return true;
    }

    get _AABB(): AABB {
        let minX = Number.MAX_VALUE,
            maxX = -Number.MAX_VALUE,
            maxY = -Number.MAX_VALUE,
            minY = Number.MAX_VALUE;
        for (const p of this.transformedPoints) {
            minX = Math.min(minX, p.x)
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }
        return new AABB(minX, minY, maxX, maxY)
    }
}

export class RegularPolygon extends Polygon {
    constructor(num_of_vertices: number, radius: number, mass: number, isStatic: boolean) {
        const points = [];
        for (let i = num_of_vertices - 1; i >= 0; i--) {
            const pos_x = Math.cos(2.0 * Math.PI / num_of_vertices * i) * radius;
            const pos_y = Math.sin(2.0 * Math.PI / num_of_vertices * i) * radius;
            points.push([pos_x, pos_y])
        }
        const inertia = 1 / 2 * mass * radius * radius * (1 - 2 / 3 * Math.sin(Math.PI / num_of_vertices) * Math.sin(Math.PI / num_of_vertices))
        super(points, mass, inertia, isStatic)
    }
}

export class Rectangle extends Polygon {
    constructor(width: number, height: number, mass: number, isStatic: boolean) {
        const points = [[-width / 2, height / 2],
            [width / 2, height / 2],
            [width / 2, -height / 2],
            [-width / 2, -height / 2]];
        const inertia = 1 / 12 * mass * (height * height + width * width)
        super(points, mass, inertia, isStatic);
    }
}

export class Circle extends Body {
    radius: number;

    constructor(radius: number, mass: number, isStatic: boolean) {
        const inertia = 0.5 * mass * radius * radius;
        super(mass, inertia, isStatic);
        this.radius = radius;
    }

    isInside(point: Vec2): boolean {
        return point.distance(this.pos) < this.radius
    }

    get _AABB(): AABB {
        const minX = this.pos.x - this.radius;
        const maxX = this.pos.x + this.radius;
        const minY = this.pos.y - this.radius;
        const maxY = this.pos.y + this.radius;
        return new AABB(minX, minY, maxX, maxY)
    }
}