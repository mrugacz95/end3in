import { Body, Circle, Polygon } from "./Body";
import { Vec2 } from "./Vector"
import { Collision } from "./Collision";
import { Solver } from "./Solver";

export class Engine {
    solver: Solver;
    dt: number;
    debug: boolean;
    gameObjects: Body[];
    g: number;
    iterations: number;

    constructor(debug = false, solver: Solver, iterations = 20) {
        this.solver = solver;
        this.dt = 1 / 60; // take dt from elapsed time
        this.debug = debug;
        this.g = 9.81;
        this.gameObjects = [];
        this.iterations = iterations
    };

    start() {
        let self = this;
        window.setInterval(function () {
            self.update.call(self)
        }, 1000 * self.dt);
    };

    update() {
        for (let it = 0; it < this.iterations; it++) {
            for (let obj of this.gameObjects) {
                if (obj.isStatic !== true) {
                    obj.applyAcceleration(new Vec2(0, this.g), 0, this.dt / this.iterations);
                }
            }
            if (this.solver === 'impulse') {
                this.impulseSolver();
            } else if (this.solver === 'translation') {
                this.translationSolver();
            }
            for (let obj of this.gameObjects) {
                obj.update(this.dt/ this.iterations);
            }
        }
    };

    addBody(body: Body) {
        this.gameObjects.push(body);
    };

    addAllBodies(bodies: Body[]) {
        for (let body of bodies) {
            this.addBody(body)
        }
    };

    translationSolver() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = i + 1; j < this.gameObjects.length; j++) {
                const body1 = this.gameObjects[i]
                const body2 = this.gameObjects[j]
                if (body1.isStatic && body2.isStatic) {
                    continue
                }
                if (!Collision.areColliding(body1, body2)) {
                    continue;
                }
                if (body1 instanceof Polygon) {
                    if (body2 instanceof Polygon) {
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
                        throw new Error("Collision is only implemented between polygon and other polygon")
                    }
                } else {
                    throw new Error("Collision with circle is not implemented yet")
                }
            }
        }
    }

    resolveCollision(body1: Body, body2: Body, normal: Vec2) {
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
                if (body1 instanceof Circle && body1 instanceof Circle) { //TODO add more cases
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

                    let k = mtv.penetratingBody.massInv + mtv.referenceBody.massInv;
                    k += mtv.penetratingBody.inertiaInv * (rn1 * rn1);
                    k += mtv.referenceBody.inertiaInv * (rn2 * rn2);

                    let slop = 0.02;
                    let bias = 0.2 / this.dt * Math.max(mtv.length - slop, 0);
                    let P = (relativeVelocity + sign * bias) / k;

                    let Pvec = mtv.normal.scale(P).normal();

                    let refVector = Pvec.scale(sign);
                    let indVector = Pvec.scale(-1 * sign);
                    incident.applyImpulse(indVector, mtv.penetratingPoint);
                    reference.applyImpulse(refVector, mtv.penetratingPoint);
                }
            }
        }
    };
}