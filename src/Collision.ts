import {Body, Circle, Polygon} from "./Body";
import {Vec2} from "./Vector";
import {ContactPoints} from "./ContactPoints";

export class Collision {
    static areAABBColliding(body1: Body, body2: Body) {
        return body1.AABB.collides(body2.AABB)
    }

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
        for (const point of body.transformedPoints) {
            const projection = point.dot(axis);
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

    static calculateSAT(body1: Body, body2: Body): MTV {

        let collisionManifold: MTV = undefined

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

        return collisionManifold
    }

    private static intersectPolygons(body1: Polygon, body2: Polygon) {
        let collisionNormal = null;
        let depth = Number.MAX_VALUE;
        for (const body of [body1, body2]) {
            for (const axisWithPoints of body.transformedAxes) {
                const axis = axisWithPoints.axis;

                const normal = axis.normalize().normal();
                const bProj = Collision.projectPolygon(normal, body1);
                const oProj = Collision.projectPolygon(normal, body2);

                // check overlap
                if (bProj.max <= oProj.min ||
                    bProj.min >= oProj.max) {
                    return undefined
                }
                const overlap = Math.min(
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
        return new MTV(
            body1,
            body2,
            collisionNormal,
            depth,
        )
    }

    private static intersectCirclePolygon(circle: Circle, polygon: Polygon): MTV {
        let returnedNormal: Vec2 = null
        let returnedDepth: number = Number.MAX_VALUE

        for (const {axis: axis} of polygon.transformedAxes) {
            const normal = axis.normal().normalize()

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

        const closestPoint = Collision.closestPointOnPolygon(circle.pos, polygon)
        const normal = closestPoint.sub(circle.pos).normalize()

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
        return new MTV(
            circle,
            polygon,
            returnedNormal,
            returnedDepth,
        )
    }

    private static closestPointOnPolygon(point: Vec2, polygon: Polygon) {
        let closestPoint = polygon.transformedPoints[0]
        let dist = Number.MAX_VALUE

        for (const polygonPoint of polygon.transformedPoints) {
            const newDist = polygonPoint.distance(point)

            if (newDist < dist) {
                dist = newDist
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
        const depth = radiusSum - dist

        if (circle1.pos.sub(circle2.pos).dot(normal) > 0) {
            normal = normal.inv()
        }

        return new MTV(
            circle1,
            circle2,
            normal,
            depth,
        )
    }

}

export class MTV {
    /**
     * Minimum translation vector
     */
    body1: Body;
    body2: Body;
    normal: Vec2;
    depth: number;

    constructor(body1: Body, body2: Body, normal: Vec2, depth: number) {
        this.body1 = body1;
        this.body2 = body2;
        this.normal = normal;
        this.depth = depth;
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

    constructor(mtv: MTV,
                contactPoints: ContactPoints) {
        this.body1 = mtv.body1;
        this.body2 = mtv.body2;
        this.normal = mtv.normal;
        this.depth = mtv.depth;
        this.contact1 = contactPoints.contactPoint1;
        this.contact2 = contactPoints.contactPoint2;
        this.contactCount = contactPoints.contactCount;
    }

}