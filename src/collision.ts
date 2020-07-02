import {Vec2} from "./vector";
import {Body} from "./body";

class Bounds {
    max: Vec2 = new Vec2(-Infinity, -Infinity)
    min: Vec2 = new Vec2(Infinity, Infinity)

    constructor(points) {
        for (let p of points) {
            this.max.x = Math.max(this.max.x, p.x)
            this.max.y = Math.max(this.max.y, p.y)
            this.min.x = Math.min(this.min.x, p.x)
            this.min.y = Math.min(this.min.y, p.y)
        }
    }

    isIntersecting(other: Bounds) {
        return this.min.x < other.max.x && // left side of this is on left to right side of other
            this.max.x > other.min.x && // right side of this is on right to left side of other
            this.min.y < other.max.y && // ...
            this.max.y > other.min.y
    }
}

export class Collision {

    static areColliding(body1: Body, body2: Body) {
        if (typeof body1 !== typeof body2) {
            return false
        }

        let body1Bounds = new Bounds(body1.orientedPoints())
        let body2Bounds = new Bounds(body2.orientedPoints())

         return body1Bounds.isIntersecting(body2Bounds)
    }
}