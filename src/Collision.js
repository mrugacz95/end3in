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

    Collision.calculateSAT = function (body1, body2, options) {
        let context = options.context;
        let debug = options.debug || false;

        function project(axis, body) {
            let min = Number.MAX_VALUE;
            let max = -Number.MAX_VALUE;
            for (let point of body.points) {
                let projection = point.copy().rotate(body.rot).transpose(body.pos.x, body.pos.y).dot(axis);
                min = Math.min(min, projection);
                max = Math.max(max, projection);
            }
            return Vec2.create(min, max);
        }

        function drawNormal(normal) {
            context.strokeStyle = "#000";
            context.lineWidth = 1;
            normal = normal.copy().normal();
            context.beginPath();
            let axisStart = normal.copy().scale(-10 * engine.scale);
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.copy().scale(10 * engine.scale);
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        function drawProjection(normal, body, proj, color) {
            context.strokeStyle = color;
            context.lineWidth = 8;
            normal = normal.copy().normal();
            context.beginPath();
            let axisStart = normal.copy().scale(proj.y * -engine.scale);
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.copy().scale(proj.x * -engine.scale);
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        for (let body of [body1, body2]) {
            for (let axis of body.axes()) {
                let normal = axis.rotate(body.rot).normalize();
                let b1Proj = project(normal, body1);
                let b2Proj = project(normal, body2);
                if (debug) {
                    drawNormal(normal);
                    drawProjection(normal, body1, b1Proj, "#FF0000");
                    drawProjection(normal, body2, b2Proj, "#00FF00");
                }
                if (b1Proj.y <= b2Proj.x ||
                    b1Proj.x >= b2Proj.y) {
                    return false
                }
            }
        }
        return true;
    }
}());