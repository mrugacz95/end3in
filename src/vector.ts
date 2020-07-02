export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    rotate(theta) {
        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        return new Vec2(rotatedX, rotatedY);
    }

    copy() {
        return new Vec2(this.x, this.y)
    };

    scale(s) {
        return new Vec2(this.x * s, this.y * s);
    };

    sqrtMagnitude() {
        return Math.sqrt(this.magnitude());
    };

    magnitude() {
        return this.x * this.x + this.y * this.y;
    };

    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    };

    normalize() {
        let len = this.sqrtMagnitude();
        return new Vec2(this.x / len, this.y / len)
    };

    dot(other) {
        return this.x * other.x - this.y * other.y;
    };

    cross(other) {
        return this.x * other.y - this.y * other.x;
    };

    normal() {
        return new Vec2(-this.y, this.x);
    };

    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    };

    div(divider) {
        return new Vec2(this.x / divider, this.y / divider);
    };

    pseudoCross(value) {
        return new Vec2(-value * this.x, value * this.y)
    }

    static down() {
        return new Vec2(0, 1)
    }

    static up() {
        return new Vec2(0, -1)
    }

    static left() {
        return new Vec2(-1, 0)
    }

    static right() {
        return new Vec2(1, 0)
    }

    static zero(){
        return new Vec2(0,0)
    }
}