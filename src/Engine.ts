import { Body, Circle } from "./Body";
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

    constructor(debug = false, solver: Solver, iterations = 35) {
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
                obj.update(this.dt / this.iterations);
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
                if (!Collision.areAABBColliding(body1, body2)) {
                    continue;
                }
                let collisionManifold = Collision.calculateSAT(body1, body2);
                if (collisionManifold) {
                    if (body2.isStatic) {
                        body1.pos = body1.pos.add(collisionManifold.normal.normalize().scale(-collisionManifold.depth))
                    } else if (body1.isStatic) {
                        body2.pos = body2.pos.add(collisionManifold.normal.normalize().scale(collisionManifold.depth))
                    } else {
                        body2.pos = body2.pos.add(collisionManifold.normal.normalize().scale(collisionManifold.depth / 2))
                        body1.pos = body1.pos.add(collisionManifold.normal.normalize().scale(-collisionManifold.depth / 2))
                    }

                    this.resolveCollision(body1, body2, collisionManifold.normal)
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
                if (!Collision.areAABBColliding(body1, body2)) {
                    continue;
                }
                if (body1 instanceof Circle && body1 instanceof Circle) { //TODO add more cases
                    continue;
                }
                let collisionManifold
                    = Collision.calculateSAT(body1, body2);
                if (collisionManifold) {
                    let incident = collisionManifold.body1;
                    let reference = collisionManifold.body2;
                    // V + omega × r
                    let penetratingVelocity = collisionManifold.body1.v
                        .add(collisionManifold.contact1
                            .normal()
                            .scale(collisionManifold.body2.omega))
                        .cross(collisionManifold.normal);
                    let referenceVelocity = collisionManifold.body2.v
                        .add(collisionManifold.body2.v
                            .normal()
                            .scale(collisionManifold.body2.omega))
                        .cross(collisionManifold.normal);

                    let relativeVelocity = penetratingVelocity - referenceVelocity;
                    let sign = Math.sign(relativeVelocity);
                    relativeVelocity = Math.abs(relativeVelocity);

                    let rn1 = collisionManifold.contact1.cross(collisionManifold.normal);
                    let rn2 = collisionManifold.contact2.cross(collisionManifold.normal);

                    let k = collisionManifold.body1.massInv + collisionManifold.body2.massInv;
                    k += collisionManifold.body1.inertiaInv * (rn1 * rn1);
                    k += collisionManifold.body2.inertiaInv * (rn2 * rn2);

                    let slop = 0.02;
                    let bias = 0.2 / this.dt * Math.max(collisionManifold.depth - slop, 0);
                    let P = (relativeVelocity + sign * bias) / k;

                    let Pvec = collisionManifold.normal.scale(P).normal();

                    let refVector = Pvec.scale(sign);
                    let indVector = Pvec.scale(-1 * sign);
                    incident.applyImpulse(indVector, collisionManifold.contact1);
                    reference.applyImpulse(refVector, collisionManifold.contact2);
                }
            }
        }
    };
}