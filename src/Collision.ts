import { Body, Polygon, Circle } from "./Body";
import { Vec2 } from "./Vector";

export class Collision{
    static areColliding(body1 : Body, body2: Body) {
        if (body1 instanceof Polygon && body2 instanceof Polygon) {
            let body1MinX = Number.MAX_VALUE, body1MaxX = -Number.MAX_VALUE,
                body2MinX = Number.MAX_VALUE, body2MaxX = -Number.MAX_VALUE,
                body1MinY = Number.MAX_VALUE, body1MaxY = -Number.MAX_VALUE,
                body2MinY = Number.MAX_VALUE, body2MaxY = -Number.MAX_VALUE;
            for (let p of body1.transformedPoints) {
                body1MinX = Math.min(body1MinX, p.x)
                body1MaxX = Math.max(body1MaxX, p.x);
                body1MinY = Math.min(body1MinY, p.y);
                body1MaxY = Math.max(body1MaxY, p.y);
            }
            for (let p of body2.transformedPoints) {
                body2MinX = Math.min(body2MinX, p.x);
                body2MaxX = Math.max(body2MaxX, p.x);
                body2MinY = Math.min(body2MinY, p.y);
                body2MaxY = Math.max(body2MaxY, p.y);
            }
            return body1MinX < body2MaxX &&
                body1MaxX > body2MinX &&
                body1MinY < body2MaxY &&
                body1MaxY > body2MinY;
        } else if (body1 instanceof Circle && body2 instanceof Circle) {
            return body1.pos.sub(body2.pos).sqrtMagnitude() < body1.radius + body2.radius;
        } else {
            throw new Error(`Collision between ${body1} and ${body2} Not implemented yet`);
        }
    };

    static calculateSAT (body1: Body, body2: Body) {
        if (body1 instanceof Circle || body2 instanceof Circle) return null; // TODO add more calculations
        function projectPoint(axis: Vec2, point: Vec2) {
            return point.dot(axis);
        }

        function projectBody(axis: Vec2, body: Polygon) {
            let min = Number.MAX_VALUE;
            let max = -Number.MAX_VALUE;
            let minPoint;
            let maxPoint;
            for (let point of body.transformedPoints) {
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

        if (body1 instanceof Polygon && body2 instanceof Polygon) {

            let mtvAxis = null;
            let mtvLength = Number.MAX_VALUE;
            let refP1;
            let refP2;
            let incP1;
            let incP2;
            let incidentBody;
            let referenceBody;
            for (let body of [body1, body2]) {
                for (let axisWithPoints of body.transformedAxes) {
                    let axis = axisWithPoints.axis;

                    let normal = axis.normalize().normal();
                    let bProj = projectBody(normal, body1);
                    let oProj = projectBody(normal, body2);

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

            let penetratingPoint;
            if (referenceBody.isInside(incP2)) {
                penetratingPoint = incP2;
            } else {
                penetratingPoint = incP1;
            }
            let edgePoint = penetratingPoint
                .add(mtvAxis.normal().scale(mtvLength))

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
    }
}