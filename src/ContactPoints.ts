import { Body, Circle, Polygon } from "./Body";
import { Vec2 } from "./Vector";
import { Utils } from "./Utlis";

export class ContactPoints {
    contactPoint1 : Vec2 = null
    contactPoint2 : Vec2 = null
    contactCount = 0

    constructor(body1: Body, body2: Body) {
        let contactPoints : Vec2[]
        if (body1 instanceof Circle) {
            if (body2 instanceof Polygon) {
                contactPoints =  ContactPoints.contactPointsCircleToPolygon(body1, body2)
            } else if (body2 instanceof Circle) {
                contactPoints =  ContactPoints.contactPointsCircleToCircle(body1, body2)
            } else {
                throw new Error(`Contact points between circle and ${body2} is not implemented yet`)
            }
        } else if (body1 instanceof Polygon) {
            if (body2 instanceof Polygon) {
                contactPoints =  ContactPoints.contactPointsPolygonToPolygon(body1, body2)
            } else if (body2 instanceof Circle) {
                contactPoints =  ContactPoints.contactPointsCircleToPolygon(body2, body1)
            } else {
                throw new Error(`Contact points between polygon and ${body2} is not implemented yet`)
            }
        } else {
            throw new Error(`Contact points between ${body1} and ${body2} is not implemented yet`)
        }
        this.contactPoint1 = contactPoints[0]
        this.contactPoint2 = contactPoints[1]
        this.contactCount = contactPoints.length
    }

    private static contactPointsCircleToCircle(circle1: Circle, circle2: Circle): Vec2[] {
        const dist = circle1.pos.sub(circle2.pos).normalize()
        const closest = circle2.pos.add(dist.scale(circle2.radius))
        return [closest]
    }

    private static contactPointsCircleToPolygon(circle: Circle, polygon: Polygon) {
        let minDist = Number.MAX_VALUE
        let closestPoint: Vec2 = undefined

        for (const axisWithPoints of polygon.transformedAxes) {
            const newClosest = Utils.closestPointOnSegment(circle.pos, axisWithPoints.p1, axisWithPoints.p2)

            const newDist = newClosest.sub(circle.pos).magnitude()
            if (newDist < minDist) {
                closestPoint = newClosest
                minDist = newDist
            }
        }

        return [closestPoint]
    }


    private static contactPointsPolygonToPolygon(body1: Polygon, body2: Polygon): Vec2[] {
        let minDist = Number.MAX_VALUE
        let closestPoint1: Vec2 = undefined
        let closestPoint2: Vec2 = undefined
        let contactCount = 0

        for (const [polygon1, polygon2] of [[body1, body2], [body2, body1]]) {
            for (const point of polygon1.transformedPoints) {
                for (const axis of polygon2.transformedAxes) {
                    const newClosest = Utils.closestPointOnSegment(point, axis.p1, axis.p2)
                    const distSq = newClosest.sub(point).magnitude()

                    if (Utils.isCloseTo(distSq, minDist)) {
                        if (!point.isCloseTo(closestPoint1)) {
                            closestPoint2 = point
                            contactCount = 2
                        }
                    } else if (distSq < minDist) {
                        contactCount = 1
                        closestPoint1 = point
                        minDist = distSq
                    }

                }
            }
        }
        switch (contactCount) {
            case 0:
                return []
            case 1:
                return [closestPoint1]
            case 2:
                return [closestPoint1, closestPoint2]
        }
    }
}