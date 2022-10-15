import {Type} from "./Body";

const { Collision } = require('./Collision');
require('./Solver');

export class Engine {
    constructor(debug = false, solver = 'impulse') {
        this.solver = solver;
        this.dt = 1 / 60; // take dt from elapsed time
        this.debug = debug;
        this.g = 9.81;
        this.gameObjects = [];
        this.newBodyId = 0;
        this.joints = [];
    };

    start() {
        let self = this;
        window.setInterval(function () {
            self.update.call(self)
        }, 1000 * self.dt);
    };

    update() {
        for (let obj of this.gameObjects) {
            if (obj.isStatic !== true) {
                obj.applyAcceleration(new Vec2(0, this.g), 0, engine.dt);
            }
        }
        if (this.solver === 'impulse') {
            this.impulseSolver();
        } else if (this.solver === 'constraint') {
            this.constraintSolver();
        } else if (this.solver === 'translation') {
            this.translationSolver();
        }
        for (let obj of this.gameObjects) {
            obj.update(this.dt);
        }
    };

    addBody(body) {
        body.bodyId = this.newBodyId;
        this.newBodyId += 1;
        this.gameObjects.push(body);
    };

    addAllBodies(bodies) {
        for (let body of bodies) {
            this.addBody(body)
        }
    };

    translationSolver() {
        for (let i = 0; i < engine.gameObjects.length; i++) {
            for (let j = i + 1; j < engine.gameObjects.length; j++) {
                const body1 = engine.gameObjects[i]
                const body2 = engine.gameObjects[j]
                if (body1.isStatic && body2.isStatic) {
                    continue
                }
                if (!Collision.areColliding(body1, body2)) {
                    continue;
                }
                if (body1.type === Type.Polygon) {
                    if (body2.type === Type.Polygon) {
                        let mtv = Collision.calculateSAT(body1, body2);
                        if (mtv !== false) {
                            if (body2.isStatic) {
                                body1.pos = body1.pos.add(mtv.normal.normalize().scale(-mtv.length))
                            } else if (body1.isStatic) {
                                body2.pos = body2.pos.add(mtv.normal.normalize().scale(mtv.length))
                            } else {
                                body2.pos = body2.pos.add(mtv.normal.normalize().scale(mtv.length / 2))
                                body1.pos = body1.pos.add(mtv.normal.normalize().scale(-mtv.length / 2))
                            }

                            this.resolveCollision(body1, body2, mtv.normal)
                        }
                    } else {
                        // todo
                    }
                } else {
                    // todo
                }
            }
        }
    }

    resolveCollision(body1, body2, normal) {
        const relativeVelocity = body2.v.sub(body1.v);

        if (relativeVelocity.dot(normal) > 0) {
            return;
        }

        const e = Math.min(body1.restitution, body2.restitution);

        let j = -(1 + e) * relativeVelocity.dot(normal)
        j /= body1.massInv + body2.massInv;

        const impulse = normal.scale(j);

        body1.v = body1.v.sub(impulse.scale(body1.massInv));
        body2.v = body2.v.add(impulse.scale(body2.massInv));
    }

    impulseSolver() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = i + 1; j < this.gameObjects.length; j++) {
                let body1 = this.gameObjects[i]
                let body2 = this.gameObjects[j]
                if (!Collision.areColliding(body1, body2)) {
                    continue;
                }
                if (body1.type === Body.Type.Circle && body1.type === Body.Type.Circle) { //TODO add more cases
                    continue;
                }
                let mtv = Collision.calculateSAT(body1, body2);
                if (mtv) {
                    let incident = mtv.penetratingBody;
                    let reference = mtv.referenceBody;
                    // V + omega × r
                    let penetratingVelocity = mtv.penetratingBody.v
                        .add(mtv.penetratingPoint
                            .normal()
                            .scale(mtv.penetratingBody.omega))
                        .cross(mtv.normal);
                    let referenceVelocity = mtv.referenceBody.v
                        .add(mtv.referencePoint
                            .normal()
                            .scale(mtv.referenceBody.omega))
                        .cross(mtv.normal);

                    let relativeVelocity = penetratingVelocity - referenceVelocity;
                    let sign = Math.sign(relativeVelocity);
                    relativeVelocity = Math.abs(relativeVelocity);

                    let rn1 = mtv.penetratingPoint.cross(mtv.normal);
                    let rn2 = mtv.referencePoint.cross(mtv.normal);

                    let k = mtv.penetratingBody.mInv + mtv.referenceBody.mInv;
                    k += mtv.penetratingBody.IInv * (rn1 * rn1);
                    k += mtv.referenceBody.IInv * (rn2 * rn2);

                    let slop = 0.02;
                    let bias = 0.2 / this.dt * Math.max(mtv.length - slop, 0);
                    let P = (relativeVelocity + sign * bias) / k;

                    P = mtv.normal.scale(P).normal();

                    let refVector = P.scale(sign);
                    let indVector = P.scale(-1 * sign);
                    incident.applyImpulse(indVector);
                    reference.applyImpulse(refVector);
                }
            }
        }
    };

    addJoint(joint) {
        this.joints.push(joint)
    };

    addAllJoints(joints) {
        for (let joint of joints) {
            this.addJoint(joint);
        }
    };

    constraintSolver() {
        for (let i = 0; i < 4; i++) {
            for (let c of this.joints) {
                let J = [];
                let pA = c.local1Anchor.rotate(c.body1.rot).transpose(c.body1.pos);
                let pB = c.local1Anchor.rotate(c.body2.rot).transpose(c.body2.pos);
                J.push(2 * (pA.x - pB.x),
                    2 * (pA.y - pB.y),
                    // 2 * pA.sub(pB).scale(-1).cross(pA.sub(c.body1.pos)),
                    2 * (pB.x - pA.x),
                    2 * (pB.y - pA.y),
                    // 2 * pA.sub(pB).scale(-1).cross(pB.sub(c.body1.pos)),
                );
                let bias = (0.2 / this.dt) * pA.sub(pB).sqrtMagnitude();
                // let lambda = -
            }
        }
    };
}