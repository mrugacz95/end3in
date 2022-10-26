import { Body } from "./Body";
import { Vec2 } from "./Vector"
import { Collision, CollisionManifold, MTV } from "./Collision";
import { Solver } from "./Solver";
import { ContactPoints } from "./ContactPoints";

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
            if (this.solver === 'translation') {
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
        const broadColliding = this.broadPhrase()
        this.narrowPhrase(broadColliding)


    }

    broadPhrase(): number[][] {
        let collidingBodies: number[][] = []
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
        for (let [body1idx, body2idx] of broadColliding) {
            const body1 = this.gameObjects[body1idx]
            const body2 = this.gameObjects[body2idx]
            let collisionMTV = Collision.calculateSAT(body1, body2);
            if (collisionMTV !== undefined) {
                this.separateBodies(collisionMTV)
                let contactPoints = new ContactPoints(body1, body2)
                const collisionManifold = new CollisionManifold(
                    collisionMTV,
                    contactPoints
                )
                this.resolveCollision(collisionManifold)
            }
        }
    }


    resolveCollision(collisionManifold: CollisionManifold) {
        const body1: Body = collisionManifold.body1
        const body2: Body = collisionManifold.body2



        const normal = collisionManifold.normal

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

    separateBodies(mtv: MTV) {
        let body1 = mtv.body1
        let body2 = mtv.body2
        let normal = mtv.normal.normalize()
        if (body2.isStatic) {
            body1.pos = body1.pos.add(normal.scale(-mtv.depth))
        } else if (body1.isStatic) {
            body2.pos = body2.pos.add(normal.scale(mtv.depth))
        } else {
            body2.pos = body2.pos.add(normal.scale(mtv.depth / 2))
            body1.pos = body1.pos.add(normal.scale(-mtv.depth / 2))
        }
    }
}