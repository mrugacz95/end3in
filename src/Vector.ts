import { Utils } from "./Utlis";

export class Vec2 {
    readonly x: number;
    readonly y: number;
    static readonly ZERO = new Vec2(0,0)


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    };

    transpose(x: number, y: number) {
        return new Vec2(this.x + x, this.y + y)
    };

    rotate(theta: number) {
        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        return new Vec2(rotatedX, rotatedY);
    };

    scale(s: number) {
        return new Vec2(this.x * s, this.y * s);
    };

    sqrtMagnitude() {
        return Math.sqrt(this.magnitude());
    };

    magnitude() {
        return this.x * this.x + this.y * this.y;
    };

    sub(other: Vec2) {
        return new Vec2(this.x - other.x, this.y - other.y);
    };

    normalize() {
        let len = this.sqrtMagnitude();
        return new Vec2(this.x / len, this.y / len)
    };

    dot(other: Vec2) {
        return this.x * other.x + this.y * other.y;
    };

    cross(other: Vec2) {
        return this.x * other.y - this.y * other.x;
    };

    normal() {
        return new Vec2(-this.y, this.x);
    };

    rightNormal() {
        return new Vec2(this.y, -this.x);
    };

    add(other: Vec2) {
        return new Vec2(this.x + other.x, this.y + other.y);
    };

    pseudoCross(value: number) {
        return new Vec2(-value * this.x, value * this.y)
    }

    inv() {
        return this.scale(-1)
    }

    toArray() {
        return [this.x, this.y]
    }

    distance(other: Vec2){
        return this.sub(other).sqrtMagnitude()
    }

    isCloseTo(other: Vec2){
        return Utils.isCloseTo(this.x, other.x) && Utils.isCloseTo(this.y, other.y)
    }

}