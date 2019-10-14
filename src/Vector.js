Vec2 = {};

module.exports = Vec2;

(function () {
    Vec2.create = function (x, y) {
        this.x = x;
        this.y = y;
        return Object.assign({}, this)
    };


    Vec2.transpose = function (x, y) {
        this.x += x;
        this.y += y;
        return this
    };

    Vec2.rotate = function (theta) {
        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        this.x = rotatedX;
        this.y = rotatedY;
        return this
    };

    Vec2.copy = function () {
        return Vec2.create(this.x, this.y)
    };

    Vec2.scale = function (s) {
        this.x *= s;
        this.y *= s;
        return this
    };

    Vec2.sqrtMagnitude = function () {
        return Math.sqrt(this.magnitude());
    };

    Vec2.magnitude = function () {
        return this.x * this.x + this.y * this.y;
    };

    Vec2.sub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };

    Vec2.normalize = function () {
        let len = this.sqrtMagnitude();
        this.x /= len;
        this.y /= len;
        return this
    };

    Vec2.dot = function (other) {
        return this.x * other.y - this.y * other.x;
    };
}());