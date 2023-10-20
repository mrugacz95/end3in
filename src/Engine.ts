import {Body} from "./Body";
import {Vec2} from "./Vector"
import {Collision, CollisionManifold, MTV} from "./Collision";
import {ContactPoints} from "./ContactPoints";

export class Engine {
    dt: number;
    debug: boolean;
    gameObjects: Body[];
    g: number;
    iterations: number;

    constructor(debug = false, iterations = 35) {
        this.dt = 1 / 60; // take dt from elapsed time
        this.debug = debug;
        this.g = 9.81;
        this.gameObjects = [];
        this.iterations = iterations
    }

    start() {
        window.setInterval(() => {
            this.update()
        }, 1000 * this.dt);
    }

    update() {
        for (let it = 0; it < this.iterations; it++) {
            for (const obj of this.gameObjects) {
                if (obj.isStatic !== true) {
                    obj.applyAcceleration(new Vec2(0, this.g), this.dt / this.iterations);
                }
            }
            this.translationSolver();
            for (const obj of this.gameObjects) {
                obj.update(this.dt / this.iterations);
            }
        }
    }

    addBody(body: Body) {
        this.gameObjects.push(body);
    }

    addAllBodies(bodies: Body[]) {
        for (const body of bodies) {
            this.addBody(body)
        }
    }

    translationSolver() {
        const broadColliding = this.broadPhrase()
        this.narrowPhrase(broadColliding)
    }

    broadPhrase(): number[][] {
        const collidingBodies: number[][] = []
        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = i + 1; j < this.gameObjects.length; j++) {
                const body1 = this.gameObjects[i]
                const body2 = this.gameObjects[j]
                if (body1.isStatic && body2.isStatic) {
                    continue
                }
                if (!Collision.areAABBColliding(body1, body2)) {
                    continue;
                }
                collidingBodies.push([i, j])
            }
        }
        return collidingBodies
    }

    narrowPhrase(broadColliding: number[][]) {
        for (const [body1idx, body2idx] of broadColliding) {
            const body1 = this.gameObjects[body1idx]
            const body2 = this.gameObjects[body2idx]
            const collisionMTV = Collision.calculateSAT(body1, body2);
            if (collisionMTV !== undefined) {
                this.separateBodies(collisionMTV)
                const contactPoints = new ContactPoints(body1, body2)
                const collisionManifold = new CollisionManifold(
                    collisionMTV,
                    contactPoints
                )
                this.resolveCollisionWithRotationAndFriction(collisionManifold)
            }
        }
    }

    separateBodies(mtv: MTV) {
        const body1 = mtv.body1
        const body2 = mtv.body2
        const normal = mtv.normal.normalize()
        if (body2.isStatic) {
            body1.pos = body1.pos.add(normal.scale(-mtv.depth))
        } else if (body1.isStatic) {
            body2.pos = body2.pos.add(normal.scale(mtv.depth))
        } else {
            body2.pos = body2.pos.add(normal.scale(mtv.depth / 2))
            body1.pos = body1.pos.add(normal.scale(-mtv.depth / 2))
        }
    }

    resolveCollisionWithRotationAndFriction(collisionManifold: CollisionManifold) {
        const body1: Body = collisionManifold.body1
        const body2: Body = collisionManifold.body2
        const normal: Vec2 = collisionManifold.normal.normalize()
        type Impulse = {
            impulse: Vec2;
            r1: Vec2;
            r2: Vec2;
        }
        const impulses: Impulse[] = []

        const e = Math.min(body1.restitution, body2.restitution);
        const jValues: number[] = []
        const frictionImpulses: Impulse[] = []
        const staticFriction = this.pythagoreanSolve(body1.staticFriction, body2.staticFriction)
        const dynamicFriction = this.pythagoreanSolve(body1.dynamicFriction, body2.dynamicFriction)


        const contactList = [collisionManifold.contact1, collisionManifold.contact2]
        for (let i = 0; i < collisionManifold.contactCount; i++) {
            const contactPoint = contactList[i]
            const r1 = contactPoint.sub(body1.pos)
            const r2 = contactPoint.sub(body2.pos)

            const r1Perp = r1.normal()
            const r2Perp = r2.normal()

            const angularLinearVelocityBody1 = r1Perp.scale(body1.omega)
            const angularLinearVelocityBody2 = r2Perp.scale(body2.omega)

            const relativeVelocity = body2.v.add(angularLinearVelocityBody2)
                .sub(body1.v.add(angularLinearVelocityBody1))


            const contactVelocityMag = relativeVelocity.dot(normal)

            if (contactVelocityMag > 0) {
                continue
            }

            const r1PerpDotN = r1Perp.dot(normal)
            const r2PerpDotN = r2Perp.dot(normal)

            let j: number = -(1 + e) * contactVelocityMag;
            j /= body1.massInv + body2.massInv
                + (r1PerpDotN * r1PerpDotN) * body1.inertiaInv
                + (r2PerpDotN * r2PerpDotN) * body2.inertiaInv;
            j /= collisionManifold.contactCount

            jValues.push(j)

            const impulse = normal.scale(j);
            impulses.push({
                impulse: impulse,
                r1: r1,
                r2: r2
            })
        }

        for (const {impulse: impulse, r1: r1, r2: r2} of impulses) {
            body1.v = body1.v.sub(impulse.scale(body1.massInv));
            body1.omega = body1.omega - r1.cross(impulse) * body1.inertiaInv
            body2.v = body2.v.add(impulse.scale(body2.massInv));
            body2.omega = body2.omega + r2.cross(impulse) * body2.inertiaInv
        }

        for (let i = 0; i < collisionManifold.contactCount; i++) {
            if (jValues.length <= i) break
            const contactPoint = contactList[i]
            const r1 = contactPoint.sub(body1.pos)
            const r2 = contactPoint.sub(body2.pos)

            const r1Perp = r1.normal()
            const r2Perp = r2.normal()

            const angularLinearVelocityBody1 = r1Perp.scale(body1.omega)
            const angularLinearVelocityBody2 = r2Perp.scale(body2.omega)

            const relativeVelocity = (body2.v.add(angularLinearVelocityBody2))
                .sub((body1.v.add(angularLinearVelocityBody1)))

            let tangent = relativeVelocity.sub(normal.scale(relativeVelocity.dot(normal)))

            if (tangent.isCloseTo(Vec2.ZERO)) {
                continue
            } else {
                tangent = tangent.normalize()
            }

            const r1PerpDotT = r1Perp.dot(tangent)
            const r2PerpDotT = r2Perp.dot(tangent)

            let jt: number = -relativeVelocity.dot(normal)
            jt /= body1.massInv + body2.massInv +
                (r1PerpDotT * r1PerpDotT) * body1.inertiaInv +
                (r2PerpDotT * r2PerpDotT) * body2.inertiaInv
            jt /= collisionManifold.contactCount

            const j = jValues[i]

            let frictionImpulse: Vec2
            if (Math.abs(j) < -j * staticFriction) {
                frictionImpulse = tangent.scale(jt)
            } else {
                frictionImpulse = tangent.scale(-j * dynamicFriction)
            }

            frictionImpulses.push(
                {
                    impulse: frictionImpulse,
                    r1: r1,
                    r2: r2
                }
            )
        }

        for (const {impulse: impulse, r1: r1, r2: r2} of frictionImpulses) {
            body1.v = body1.v.sub(impulse.scale(body1.massInv))
            body1.omega = body1.omega - r1.cross(impulse) * body1.inertiaInv
            body2.v = body2.v.add(impulse.scale(body2.massInv))
            body2.omega = body2.omega + r2.cross(impulse) * body2.inertiaInv
        }
    }

    pythagoreanSolve(a: number, b: number) {
        return Math.sqrt(a * a + b * b)
    }
}