import { Body, Circle, Polygon } from "./Body";
import { Vec2 } from "./Vector";
import { ContactPoints } from "./ContactPoints";

export class Collision {
    static areAABBColliding(body1: Body, body2: Body) {
        return body1.AABB.collides(body2.AABB)
    };

    private static projectCircle(normal: Vec2, body1: Circle) {
        const directionRadius = normal.normalize().scale(body1.radius)

        let p1 = body1.pos.add(directionRadius)
        let p2 = body1.pos.sub(directionRadius)

        let max = p1.dot(normal)
        let min = p2.dot(normal)

        if (min > max) {
            [min, max] = [max, min];
            [p1, p2] = [p2, p1];
        }

        return {min: min, max: max, minPoint: p1, maxPoint: p2}
    }

    private static projectPolygon(axis: Vec2, body: Polygon) {
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        let minPoint;
        let maxPoint;
        for (let point of body.transformedPoints) {
            let projection = point.dot(axis);
            if (min > projection) {
                min = projection;
                minPoint = point;
            }
            if (max < projection) {
                max = projection;
                maxPoint = point;
            }
        }
        return {min: min, max: max, minPoint: minPoint, maxPoint: maxPoint};
    }

    static calculateSAT(body1: Body, body2: Body): CollisionManifold {

        let collisionManifold: CollisionManifold = undefined

        if (body1 instanceof Circle) {
            if (body2 instanceof Polygon) {
                collisionManifold = Collision.intersectCirclePolygon(body1, body2)
            } else if (body2 instanceof Circle) {
                collisionManifold = Collision.intersectCircles(body1, body2)
            } else {
                throw new Error(`Colliding circle with ${body2} is not implemented yet`)
            }
        } else if (body1 instanceof Polygon) {
            if (body2 instanceof Polygon) {
                collisionManifold = Collision.intersectPolygons(body1, body2)
            } else if (body2 instanceof Circle) {
                collisionManifold = Collision.intersectCirclePolygon(body2, body1)
                if (collisionManifold) {
                    [collisionManifold.body1, collisionManifold.body2] = [collisionManifold.body2, collisionManifold.body1]
                    collisionManifold.normal = collisionManifold.normal.inv()
                }
            } else {
                throw new Error(`Colliding polygon with ${body2} is not implemented yet`)
            }
        } else {
            throw new Error(`Colliding ${body1} with ${body2} is not implemented yet`)
        }

        if (collisionManifold) {
            const contactPoints : Vec2[] = ContactPoints.getContactPoints(body1, body2)
            collisionManifold.contact1 = contactPoints[0]
            collisionManifold.contact2 = contactPoints[1]
            collisionManifold.contactCount = contactPoints.length
        }

        return collisionManifold
    }

    private static intersectPolygons(body1: Polygon, body2: Polygon) {
        let collisionNormal = null;
        let depth = Number.MAX_VALUE;
        for (let body of [body1, body2]) {
            for (let axisWithPoints of body.transformedAxes) {
                let axis = axisWithPoints.axis;

                let normal = axis.normalize().normal();
                let bProj = Collision.projectPolygon(normal, body1);
                let oProj = Collision.projectPolygon(normal, body2);

                // check overlap
                if (bProj.max <= oProj.min ||
                    bProj.min >= oProj.max) {
                    return undefined
                }
                let overlap = 0;

                overlap = Math.min(
                    bProj.max - oProj.min,
                    oProj.max - bProj.min
                )

                if (overlap < depth) {
                    depth = overlap;
                    collisionNormal = normal;
                }
            }
        }
        if (body1.pos.sub(body2.pos).dot(collisionNormal) > 0) {
            collisionNormal = collisionNormal.inv()
        }
        return new CollisionManifold(
            body1,
            body2,
            collisionNormal,
            depth,
            Vec2.ZERO,
            Vec2.ZERO,
            0
        )
    }

    private static intersectCirclePolygon(circle: Circle, polygon: Polygon): CollisionManifold {
        let returnedNormal: Vec2 = null
        let returnedDepth: number = Number.MAX_VALUE

        for (let axisWithPoints of polygon.transformedAxes) {
            let axis = axisWithPoints.axis
            let normal = axis.normal().normalize()

            const cProj = Collision.projectCircle(normal, circle)
            const pProj = Collision.projectPolygon(normal, polygon)


            if (cProj.min >= pProj.max || pProj.min >= cProj.max) {
                return undefined;
            }

            const axisDepth = Math.min(cProj.max - pProj.min, pProj.max - cProj.min);

            if (axisDepth < returnedDepth) {
                returnedDepth = axisDepth;
                returnedNormal = normal;
            }
        }

        let closestPoint = Collision.closestPointOnPolygon(circle.pos, polygon)
        let normal = closestPoint.sub(circle.pos).normal().normalize()

        const cProj = Collision.projectCircle(normal, circle)
        const pProj = Collision.projectPolygon(normal, polygon)


        if (cProj.min >= pProj.max || pProj.min >= cProj.max) {
            return undefined;
        }

        const axisDepth = Math.min(cProj.max - pProj.min, pProj.max - cProj.min);

        if (axisDepth < returnedDepth) {
            returnedDepth = axisDepth;
            returnedNormal = normal;
        }
        if (circle.pos.sub(polygon.pos).dot(returnedNormal) > 0) {
            returnedNormal = returnedNormal.inv()
        }
        return new CollisionManifold(
            circle,
            polygon,
            returnedNormal,
            returnedDepth,
            Vec2.ZERO,
            Vec2.ZERO,
            0
        )
    }

    private static closestPointOnPolygon(point: Vec2, polygon: Polygon) {
        let closestPoint = polygon.transformedPoints[0]
        let dist = Number.MAX_VALUE

        for (let polygonPoint of polygon.transformedPoints) {
            let newDist = polygonPoint.distance(point)
            if (newDist < dist) {
                newDist = dist
                closestPoint = polygonPoint
            }
        }
        return closestPoint
    }


    private static intersectCircles(circle1: Circle, circle2: Circle) {

        const dist = circle1.pos.distance(circle2.pos)
        const radiusSum = circle1.radius + circle2.radius
        if (dist > radiusSum) {
            return undefined
        }

        let normal = circle1.pos.sub(circle2.pos)
        let depth = radiusSum - dist


        if (circle1.pos.sub(circle2.pos).dot(normal) > 0) {
            normal = normal.inv()
        }

        return new CollisionManifold(
            circle1,
            circle2,
            normal,
            depth,
            Vec2.ZERO,
            Vec2.ZERO,
            0
        )
    }

}

export class CollisionManifold {
    body1: Body;
    body2: Body;
    normal: Vec2;
    depth: number;
    contact1: Vec2;
    contact2: Vec2;
    contactCount: number;

    constructor(body1: Body,
                body2: Body,
                normal: Vec2,
                depth: number,
                contact1: Vec2,
                contact2: Vec2,
                contactCount: number) {
        this.body1 = body1;
        this.body2 = body2;
        this.normal = normal;
        this.depth = depth;
        this.contact1 = contact1;
        this.contact2 = contact2;
        this.contactCount = contactCount;
    }

}