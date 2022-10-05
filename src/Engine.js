require('./Collision');
require('./Solver');

const Engine = {};

module.exports = Engine;

(function () {

    Engine.create = function (debug = false, solver = 'impulse') {
        this.solver = solver;
        this.dt = 1 / 60; // take dt from elapsed time
        this.debug = debug;
        this.g = -9.81;
        this.gameObjects = [];
        this.newBodyId = 0;
        this.joints = [];
        return Object.assign({}, this)
    };

    Engine.start = function () {
        let self = this;
        window.setInterval(function () {
            self.update.call(self)
        }, 1000 * self.dt);
    };

    Engine.update = function () {
        for (let obj of this.gameObjects) {
            if (obj.mInv !== 0) {
                obj.applyAcceleration(0, this.g, 0, engine.dt);
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

    Engine.addBody = function (body) {
        body.bodyId = this.newBodyId;
        this.newBodyId += 1;
        this.gameObjects.push(body);
    };

    Engine.addAllBodies = function (bodies) {
        for (let body of bodies) {
            this.addBody(body)
        }
    };

    Engine.translationSolver = function (){
        for (let i = 0 ; i < engine.gameObjects.length; i++) {
            for (let j = i + 1 ; j < engine.gameObjects.length; j++) {
                const body1 = engine.gameObjects[i]
                const body2 = engine.gameObjects[j]
                if (!Collision.areColliding(body1, body2)) {
                    continue;
                }
                if (body1.type === Body.Type.Polygon){
                    if (body2.type === Body.Type.Polygon) {
                        let mtv = Collision.calculateSAT(body1, body2);
                        if (mtv !== false) {
                            body1.pos = body1.pos.add(mtv.normal.normalize().scale(-mtv.length / 2))
                            body2.pos = body2.pos.add(mtv.normal.normalize().scale(mtv.length / 2))
                        }
                    }
                    else {
                        // todo
                    }
                }
                else {
                    // todo
                }
            }
        }
    }

    Engine.impulseSolver = function () {
        for (let body1 of this.gameObjects) {
            for (let body2 of this.gameObjects) {
                if (body2.bodyId >= body1.bodyId) {
                    continue;
                }
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
                    incident.applyImpulse(indVector,
                        mtv.penetratingPoint);
                    reference.applyImpulse(refVector,
                        mtv.referencePoint);
                }
            }
        }
    };
    Engine.addJoint = function (joint) {
        this.joints.push(joint)
    };
    Engine.addAllJoints = function (joints) {
        for (let joint of joints) {
            this.addJoint(joint);
        }
    };

    Engine.constraintSolver = function () {
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
}());