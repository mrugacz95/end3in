const Body = require("./Body");

const Collision = {};

module.exports = Collision;

(function () {
    Collision.areColliding = function (body1, body2) {
        if (body1.type !== body2.type) {
            return false // TODO add more calculations
        }
        if (body1.type === Body.Type.Polygon) {
            let body1MinX = Number.MAX_VALUE, body1MaxX = -Number.MAX_VALUE,
                body2MinX = Number.MAX_VALUE, body2MaxX = -Number.MAX_VALUE,
                body1MinY = Number.MAX_VALUE, body1MaxY = -Number.MAX_VALUE,
                body2MinY = Number.MAX_VALUE, body2MaxY = -Number.MAX_VALUE;
            for (let p of body1.getTransformedPoints()) {
                body1MinX = Math.min(body1MinX, p.x)
                body1MaxX = Math.max(body1MaxX, p.x);
                body1MinY = Math.min(body1MinY, p.y);
                body1MaxY = Math.max(body1MaxY, p.y);
            }
            for (let p of body2.getTransformedPoints()) {
                body2MinX = Math.min(body2MinX, p.x);
                body2MaxX = Math.max(body2MaxX, p.x);
                body2MinY = Math.min(body2MinY, p.y);
                body2MaxY = Math.max(body2MaxY, p.y);
            }
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

        function projectPoint(axis, point) {
            return point.dot(axis);
        }

        function projectBody(axis, body) {
            let min = Number.MAX_VALUE;
            let max = -Number.MAX_VALUE;
            let minPoint;
            let maxPoint;
            for (let point of body.getTransformedPoints()) {
                let projection = projectPoint(axis, point);
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
            let axisStart = normal.scale(-10 * graphics.scale).add(graphics.cameraPos.scale(graphics.scale));
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.scale(10 * graphics.scale).add(graphics.cameraPos.scale(graphics.scale));
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        function drawProjection(normal, body, proj, color, width) {
            context.strokeStyle = color;
            context.lineWidth = width;
            context.beginPath();
            let axisStart = normal.scale(proj.max * graphics.scale).add(graphics.cameraPos.scale(graphics.scale));
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.copy().scale(proj.min * graphics.scale).add(graphics.cameraPos.scale(graphics.scale));
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        function drawIncidentPoint(point1) {
            context.strokeStyle = "#FFF000";
            context.beginPath();
            let point = graphics.worldToCanvasPosition(point1.add(graphics.cameraPos))
            context.arc(point.x, point.y, 30, 0, 2 * Math.PI);
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
        for (let body of [body1, body2]) {
            for (let axisWithPoints of body.transformedAxes()) {
                let axis = axisWithPoints.axis;

                let normal = axis.normalize().normal();
                let bProj = projectBody(normal, body1);
                let oProj = projectBody(normal, body2);
                if (debug) {
                    drawNormal(normal);
                    drawProjection(normal, body1, body2, "#FF0000", 10);
                    drawProjection(normal, body1, body2, "#00FF00", 8);
                }
                // check overlap
                if (bProj.max <= oProj.min ||
                    bProj.min >= oProj.max) {
                    return false
                }
                let overlap = 0;

                overlap = Math.min(
                    bProj.max - oProj.min,
                    oProj.max - bProj.min
                )

                if (overlap < mtvLength) {
                    mtvLength = overlap;
                    mtvAxis = normal;
                    referenceBody = body1;
                    refP1 = axisWithPoints.p1;
                    refP2 = axisWithPoints.p2;
                    incidentBody = body2;
                    incP1 = oProj.minPoint;
                    incP2 = oProj.maxPoint;
                }
            }
        }

        if (referenceBody.pos.sub(incidentBody.pos).dot(mtvAxis) > 0) {
            mtvAxis = mtvAxis.inv()
        }
        let penetratingPointInWorld = incP2

        let penetratingPoint;
        if (referenceBody.isInside(penetratingPointInWorld)) {
            penetratingPoint = incP2;
        } else {
            penetratingPoint = incP1;
        }
        let edgePoint = penetratingPoint
            .add(mtvAxis.normal().scale(mtvLength))

        if(debug) {
            drawIncidentPoint(penetratingPoint)
        }

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