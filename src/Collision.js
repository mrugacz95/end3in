require('./Vector');

var Collision = {};

module.exports = Collision;

(function () {
    Collision.areColliding = function (body1, body2) {
        // AABB test
        var b1X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        var b1Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        var b2X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        var b2Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        for (let point of body1.points) {
            let p = point.copy().rotate(body1.rot).transpose(body1.pos.x, body1.pos.y);
            b1X = Vec2.create(Math.min(b1X.x, p.x), Math.max(b1X.y, p.x));
            b1Y = Vec2.create(Math.min(b1Y.x, p.y), Math.max(b1Y.y, p.y));
        }
        for (let point of body2.points) {
            let p = point.copy().rotate(body2.rot).transpose(body2.pos.x, body2.pos.y);
            b2X = Vec2.create(Math.min(b2X.x, p.x), Math.max(b2X.y, p.x));
            b2Y = Vec2.create(Math.min(b2Y.x, p.y), Math.max(b2Y.y, p.y));
        }
        return b1X.x < b2X.y &&
            b1X.y > b2X.x &&
            b1Y.x < b2Y.y &&
            b1Y.y > b2Y.x;

    };
}());