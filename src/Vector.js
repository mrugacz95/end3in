Vec2 = {};

module.exports = Vec2;

(function () {
    Vec2.create = function (x, y) {
        this.x = x;
        this.y = y;
        return Object.assign({}, this)
    };


    Vec2.transpose = function (x, y) {
        return Vec2.create(this.x + x, this.y + y)
    };

    Vec2.rotate = function (theta) {
        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        return Vec2.create(rotatedX, rotatedY);
    };

    Vec2.copy = function () {
        return Vec2.create(this.x, this.y)
    };

    Vec2.scale = function (s) {
        return Vec2.create(this.x * s, this.y * s);
    };

    Vec2.sqrtMagnitude = function () {
        return Math.sqrt(this.magnitude());
    };

    Vec2.magnitude = function () {
        return this.x * this.x + this.y * this.y;
    };

    Vec2.sub = function (other) {
        return Vec2.create(this.x - other.x, this.y - other.y);
    };

    Vec2.normalize = function () {
        let len = this.sqrtMagnitude();
        return Vec2.create(this.x / len, this.y/ len)
    };

    Vec2.dot = function (other) {
        return this.x * other.y - this.y * other.x;
    };


    Vec2.normal = function () {
        return Vec2.create(-this.y, this.x);
    };

    Vec2.add = function (other) {
        return Vec2.create(this.x + other.x, this.y + other.y);
    };

    Vec2.div = function (divider) {
        return Vec2.create(this.x / divider, this.y / divider);
    }
}());