require('./Vector');

const Collision = {};

module.exports = Collision;

(function () {
    Collision.areColliding = function (body1, body2) {
        if (body1.type !== body2.type) {
            return false // TODO add more calculations
        }
        if (body1.type === 'polygon') {
            let b1X = Vec2.create(Number.MAX_VALUE, -Number.MAX_VALUE); // min, max in X axis for body1
            let b1Y = Vec2.create(Number.MAX_VALUE, -Number.MAX_VALUE);
            let b2X = Vec2.create(Number.MAX_VALUE, -Number.MAX_VALUE);
            let b2Y = Vec2.create(Number.MAX_VALUE, -Number.MAX_VALUE);
            for (let point of body1.points) {
                let p = point.rotate(body1.rot).transpose(body1.pos.x, body1.pos.y);
                b1X = Vec2.create(Math.min(b1X.x, p.x), Math.max(b1X.y, p.x));
                b1Y = Vec2.create(Math.min(b1Y.x, p.y), Math.max(b1Y.y, p.y));
            }
            for (let point of body2.points) {
                let p = point.rotate(body2.rot).transpose(body2.pos.x, body2.pos.y);
                b2X = Vec2.create(Math.min(b2X.x, p.x), Math.max(b2X.y, p.x));
                b2Y = Vec2.create(Math.min(b2Y.x, p.y), Math.max(b2Y.y, p.y));
            }
            const body1MinX = b1X.x;
            const body1MaxX = b1X.y;
            const body2MinX = b2X.x;
            const body2MaxX = b2X.y;
            const body1MinY = b1Y.x;
            const body1MaxY = b1Y.y;
            const body2MinY = b2Y.x;
            const body2MaxY = b2Y.y;
            return body1MinX < body2MaxX &&
                body1MaxX > body2MinX &&
                body1MinY < body2MaxY &&
                body1MaxY > body2MinY;
        } else if (body1.type === 'circle') {
            return body1.pos.sub(body2.pos).sqrtMagnitude() < body1.radious + body2.radious;
        }
    };

    Collision.calculateSAT = function (body1, body2, options = {}) {
        if (body1.type === 'circle' || body2.type === 'circle') return null; // TODO add more calculations
        let context = !options.debug || options.context;
        let debug = options.debug || false;

        function projectPoint(axis, point, body) {
            return point.copy().rotate(body.rot).transpose(body.pos.x, body.pos.y).cross(axis);
        }

        function projectBody(axis, body) {
            let min = Number.MAX_VALUE;
            let minPoint;
            let max = -Number.MAX_VALUE;
            let maxPoint;
            for (let point of body.points) {
                let projection = projectPoint(axis, point, body);
                if (min > projection) {
                    min = projection;
                    minPoint = point;
                }
                if (max < projection) {
                    max = projection;
                    maxPoint = point;
                }
            }
            return {"min": min, "max": max, "minPoint": minPoint, "maxPoint": maxPoint};
        }

        function drawNormal(normal) {
            context.strokeStyle = "#000";
            context.lineWidth = 1;
            normal = normal.normal();
            context.beginPath();
            let axisStart = normal.scale(-10 * graphics.scale);
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.scale(10 * graphics.scale);
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        function drawProjection(normal, body, proj, color, width) {
            context.strokeStyle = color;
            context.lineWidth = width;
            normal = normal.normal();
            context.beginPath();
            let axisStart = normal.scale(proj.max * -graphics.scale);
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.copy().scale(proj.min * -graphics.scale);
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        let mtvAxis = null;
        let mtvLength = Number.MAX_VALUE;
        let refP1;
        let refP2;
        let incP1;
        let incP2;
        let incidentBody;
        let referenceBody;
        for (let bodies of [[body1, body2], [body2, body1]]) {
            let body = bodies[0];
            let other = bodies[1];
            for (let axisWithPoints of body.axes()) {
                let axis = axisWithPoints.axis;

                let normal = axis.rotate(body.rot).normalize();
                let bProj = projectBody(normal, body);
                let oProj = projectBody(normal, other);
                if (debug) {
                    drawNormal(normal);
                    drawProjection(normal, body, bProj, "#FF0000", 10);
                    drawProjection(normal, other, oProj, "#00FF00", 8);
                }
                // check overlap
                if (bProj.max <= oProj.min ||
                    bProj.min >= oProj.max) {
                    return false
                }
                let overlap = 0;

                if (bProj.min < oProj.min) {
                    overlap = bProj.max - oProj.min;
                } else {
                    overlap = oProj.max - bProj.min;
                }
                if (overlap < mtvLength) {
                    mtvLength = overlap;
                    mtvAxis = normal;
                    referenceBody = body;
                    refP1 = axisWithPoints.p1;
                    refP2 = axisWithPoints.p2;
                    incidentBody = other;
                    incP1 = oProj.minPoint;
                    incP2 = oProj.maxPoint;

                }
            }
        }

        let penetratingPointInWorld = incP2
            .rotate(incidentBody.rot)
            .transpose(incidentBody.pos.x, incidentBody.pos.y);
        let penetratingPoint;
        if (referenceBody.isInside(penetratingPointInWorld)) {
            penetratingPoint = incP2;
        } else {
            penetratingPoint = incP1;
        }
        let edgePoint = penetratingPoint
            .rotate(incidentBody.rot)
            .transpose(incidentBody.pos.x, incidentBody.pos.y)
            .add(mtvAxis.normal().scale(mtvLength))
            .transpose(-referenceBody.pos.x, -referenceBody.pos.y);
        penetratingPoint = penetratingPoint
            .rotate(incidentBody.rot);

        return {
            'normal': mtvAxis,
            'length': mtvLength,
            'penetratingBody': incidentBody,
            'refP1': refP1,
            'refP2': refP2,
            'referenceBody': referenceBody,
            'referencePoint': edgePoint,
            'penetratingPoint': penetratingPoint
        };
    }
}());