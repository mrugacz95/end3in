/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Vec2 = {};

module.exports = Vec2;

(function () {
    Vec2.create = function (x, y) {
        this.x = x;
        this.y = y;
        return Object.assign({}, this)
    };


    Vec2.transpose = function (x, y) {
        return Vec2.create(this.x + x, this.y + y)
    };

    Vec2.rotate = function (theta) {
        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        return Vec2.create(rotatedX, rotatedY);
    };

    Vec2.copy = function () {
        return Vec2.create(this.x, this.y)
    };

    Vec2.scale = function (s) {
        return Vec2.create(this.x * s, this.y * s);
    };

    Vec2.sqrtMagnitude = function () {
        return Math.sqrt(this.magnitude());
    };

    Vec2.magnitude = function () {
        return this.x * this.x + this.y * this.y;
    };

    Vec2.sub = function (other) {
        return Vec2.create(this.x - other.x, this.y - other.y);
    };

    Vec2.normalize = function () {
        let len = this.sqrtMagnitude();
        return Vec2.create(this.x / len, this.y / len)
    };

    Vec2.dot = function (other) {
        return this.x * other.x - this.y * other.y;
    };

    Vec2.cross = function (other) {
        return this.x * other.y - this.y * other.x;
    };


    Vec2.normal = function () {
        return Vec2.create(-this.y, this.x);
    };

    Vec2.add = function (other) {
        return Vec2.create(this.x + other.x, this.y + other.y);
    };

    Vec2.div = function (divider) {
        return Vec2.create(this.x / divider, this.y / divider);
    }
}());

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);

var Collision = {};

module.exports = Collision;

(function () {
    Collision.areColliding = function (body1, body2) {
        var b1X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        var b1Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        var b2X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        var b2Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);
        for (let point of body1.points) {
            let p = point.copy().rotate(body1.rot).transpose(body1.pos.x, body1.pos.y);
            b1X = Vec2.create(Math.min(b1X.x, p.x), Math.max(b1X.y, p.x));
            b1Y = Vec2.create(Math.min(b1Y.x, p.y), Math.max(b1Y.y, p.y));
        }
        for (let point of body2.points) {
            let p = point.copy().rotate(body2.rot).transpose(body2.pos.x, body2.pos.y);
            b2X = Vec2.create(Math.min(b2X.x, p.x), Math.max(b2X.y, p.x));
            b2Y = Vec2.create(Math.min(b2Y.x, p.y), Math.max(b2Y.y, p.y));
        }
        return b1X.x < b2X.y &&
            b1X.y > b2X.x &&
            b1Y.x < b2Y.y &&
            b1Y.y > b2Y.x;

    };

    Collision.calculateSAT = function (body1, body2, options = {}) {
        let context = !options.debug || options.context;
        let debug = options.debug || false;

        function projectPoint(axis, point, body) {
            return point.copy().rotate(body.rot).transpose(body.pos.x, body.pos.y).cross(axis);
        }

        function projectBody(axis, body) {
            let min = Number.MAX_VALUE;
            let minPoint;
            let max = -Number.MAX_VALUE;
            let maxPoint;
            for (let point of body.points) {
                let projection = projectPoint(axis, point, body);
                if (min > projection) {
                    min = projection;
                    minPoint = point.copy();
                }
                if (max < projection) {
                    max = projection;
                    maxPoint = point.copy();
                }
            }
            return {"min": min, "max": max, "minPoint": minPoint, "maxPoint": maxPoint};
        }

        function drawNormal(normal) {
            context.strokeStyle = "#000";
            context.lineWidth = 1;
            normal = normal.copy().normal();
            context.beginPath();
            let axisStart = normal.copy().scale(-10 * engine.scale);
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.copy().scale(10 * engine.scale);
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        function drawProjection(normal, body, proj, color, width) {
            context.strokeStyle = color;
            context.lineWidth = width;
            normal = normal.copy().normal();
            context.beginPath();
            let axisStart = normal.copy().scale(proj.max * -engine.scale);
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.copy().scale(proj.min * -engine.scale);
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        let mtvAxis = null;
        let mtvLength = Number.MAX_VALUE;
        let refP1;
        let refP2;
        let incP1;
        let incP2;
        let incidentBody;
        let referenceBody;
        for (let bodies of [[body1, body2], [body2, body1]]) {
            let body = bodies[0];
            let other = bodies[1];
            for (let axisWithPoints of body.axes()) {
                let axis = axisWithPoints.axis;

                let normal = axis.rotate(body.rot).normalize();
                let bProj = projectBody(normal, body);
                let oProj = projectBody(normal, other);
                if (debug) {
                    drawNormal(normal);
                    drawProjection(normal, body, bProj, "#FF0000", 10);
                    drawProjection(normal, other, oProj, "#00FF00", 8);
                }
                // check overlap
                if (bProj.max <= oProj.min ||
                    bProj.min >= oProj.max) {
                    return false
                }
                let overlap = 0;

                if (bProj.min < oProj.min) {
                    overlap = bProj.max - oProj.min;
                } else {
                    overlap = oProj.max - bProj.min;
                }
                if (overlap < mtvLength) {
                    mtvLength = overlap;
                    mtvAxis = normal;
                    referenceBody = body;
                    refP1 = axisWithPoints.p1.copy();
                    refP2 = axisWithPoints.p2.copy();
                    incidentBody = other;
                    incP1 = oProj.minPoint.copy();
                    incP2 = oProj.maxPoint.copy();

                }
            }
        }
        let penetratingPointInWorld = incP2
            .rotate(incidentBody.rot)
            .transpose(incidentBody.pos.x, incidentBody.pos.y);
        let penetratingPoint;
        if (referenceBody.isInside(penetratingPointInWorld)) {
            penetratingPoint = incP2;
        } else {
            penetratingPoint = incP1;
        }
        let edgePoint = penetratingPoint
            .rotate(incidentBody.rot)
            .transpose(incidentBody.pos.x, incidentBody.pos.y)
            .add(mtvAxis.normal().scale(mtvLength))
            .transpose(-referenceBody.pos.x, -referenceBody.pos.y);
        penetratingPoint = penetratingPoint
            .rotate(incidentBody.rot);

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
}());

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

end3in = {};

end3in.Vector = __webpack_require__(0);
end3in.Body = __webpack_require__(3);
end3in.Engine = __webpack_require__(4);
end3in.Collision = __webpack_require__(1);
end3in.Solver = __webpack_require__(5);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);

var Body = {};

module.exports = Body;

(function () {

    Body.rect = function (width, height, x, y, options = {}) {
        this.pos = Vec2.create(x, y);
        this.rot = options.rot || 0.0;
        this.points = [Vec2.create(-width / 2, -height / 2),
            Vec2.create(width / 2, -height / 2),
            Vec2.create(width / 2, height / 2),
            Vec2.create(-width / 2, height / 2)];
        this.width = width;
        this.height = height;
        this.v = Vec2.create(0, 0);
        this.omega = 0.0;
        this.arbiters = [];
        if (options.isStatic) {
            this.m = 0;
            this.mInv = 0;
            this.IInv = 0;
        } else {
            this.m = 900 * this.width * this.height;
            this.mInv = 1.0 / this.m;
            this.IInv = 12.0 / (this.m * (this.width * this.width + this.height + this.height));
        }
        if (options.color) {
            this.color = options.color
        } else {
            this.color = "#000000"
        }
        return Object.assign({}, this)
    };

    Body.polygon = function (vertices, x, y, options = {}) {
        this.pos = Vec2.create(x, y);
        this.rot = options.rot || 0.0;
        this.points = [];
        let meanX = vertices.map((o) => o[0]).reduce((p, c) => p + c, 0) / vertices.length;
        let meanY = vertices.map((o) => o[1]).reduce((p, c) => p + c, 0) / vertices.length;
        for (let pair of vertices) {
            this.points.push(Vec2.create(pair[0] - meanX, pair[1] - meanY));
        }
        this.v = Vec2.create(0, 0);
        this.omega = 0.0;
        if (options.isStatic) {
            this.m = 0;
            this.mInv = 0;
            this.IInv = 0;
        } else {
            this.m = 0;
            var last = this.points[this.points.length - 1];
            for (let point of this.points) {
                this.m += (last.x * point.y) - (last.y * point.x);
                last = point
            }
            this.m = 900 * Math.abs(this.m / 2.0);
            // aprox with circle
            this.mInv = 1.0 / this.m;
            this.IInv = (Math.max.apply(Math, this.points.map((v) => (v.sqrtMagnitude()))));
            this.IInv = 2 / (this.m * this.IInv * this.IInv);
        }
        if (options.color) {
            this.color = options.color
        } else {
            this.color = "#000000"
        }
        return Object.assign({}, this)
    };

    Body.draw = function (ctx, debug) {
        ctx.beginPath();
        for (let i = 0; i < this.points.length + 1; i++) {
            let next = this.points[i % this.points.length]
                .rotate(this.rot)
                .transpose(this.pos.x, this.pos.y);
            if (i === 0) {
                ctx.moveTo(next.x, next.y);
            } else {
                ctx.lineTo(next.x, next.y)
            }
        }
        ctx.fillStyle = this.color;
        ctx.fill();
        if (debug) {
            for (axis of this.axes()) {
                let mid = axis.p1.add(axis.p2).scale(0.5).rotate(this.rot).add(this.pos);
                let norm = axis.axis.rotate(this.rot).normal();
                ctx.lineWidth = 1 / engine.scale;
                ctx.strokeStyle = "#7a7a7a";
                ctx.beginPath();
                ctx.moveTo(mid.x, mid.y);
                ctx.lineTo(mid.x + norm.x, mid.y + norm.y);
                ctx.stroke()
            }

        }

    };

    Body.update = function (dt) {
        this.pos.x += this.v.x * dt;
        this.pos.y += this.v.y * dt;
        this.rot += this.omega * dt;
    };

    Body.applyForce = function (fx, fy, px, py, dt) {
        px = px - this.pos.x;
        py = py - this.pos.y;
        let tau = px * fy - py * fx;
        let ax = fx * this.mInv;
        let ay = fy * this.mInv;
        this.applyAcceleration(ax, ay, tau, dt)
    };

    Body.applyAcceleration = function (ax, ay, tau, dt) {
        let alpha = tau * this.IInv;
        this.v.x += ax * dt;
        this.v.y -= ay * dt;
        this.omega += alpha * dt;
    };

    Body.applyImpulse = function (P, r) {
        this.v.x -= P.x * this.mInv;
        this.v.y -= P.y * this.mInv;
        this.omega -= this.IInv * r.cross(P);
    };

    Body.axes = function () {
        let result = [];
        for (let i = 0; i < this.points.length; i++) {
            let first = this.points[i].copy();
            let second = this.points[(i + 1) % this.points.length].copy();
            result.push({"axis": first.copy().sub(second), "p1": first, "p2": second})
        }
        return result;
    };

    Body.isInside = function (point) {
        for (a of this.axes()) {
            let p1 = a.p1.rotate(this.rot).transpose(this.pos.x, this.pos.y);
            let p2 = a.p2.rotate(this.rot).transpose(this.pos.x, this.pos.y);
            let s = p1.sub(p2);
            let d = s.cross(point.sub(p2));
            if (d > 0) return false;
        }
        return true;
    };
}());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

var Engine = {};

module.exports = Engine;

(function () {

    Engine.create = function (debug = false, solver = 'impulse') {
        this.canvas = document.getElementById('canvas');
        this.solver = solver;
        this.ctx = canvas.getContext('2d');
        this.scale = 60;
        this.cameraPos = Vec2.create(3, 3);
        this.dt = 1 / 60;
        this.width = 10 * this.scale;
        this.height = 10 * this.scale;
        this.debug = debug;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.g = -9.81;
        this.gameObjects = [];
        this.newBodyId = 0;
        return Object.assign({}, this)
    };

    Engine.start = function () {
        self = this;
        window.setInterval(function () {
            self.update.call(self)
        }, 1000 * self.dt);
    };

    Engine.clear = function () {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
    };

    Engine.update = function () {
        this.clear();
        for (let obj of this.gameObjects) {
            if (obj.mInv !== 0) {
                obj.applyAcceleration(0, this.g, 0, engine.dt);
            }
        }
        if (this.solver === 'impulse') {
            this.impulseSolver();
        }
        for (let obj of this.gameObjects) {
            obj.update(this.dt);
        }
        this.draw();
    };

    Engine.draw = function () {
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(this.cameraPos.x, this.cameraPos.y);
        for (let obj of this.gameObjects) {
            obj.draw(this.ctx, this.debug);
        }
        this.ctx.restore()
    };

    Engine.addBody = function (body) {
        body.bodyId = this.newBodyId;
        this.newBodyId += 1;
        this.gameObjects.push(body);
    };

    Engine.impulseSolver = function () {
        for (let body1 of this.gameObjects) {
            for (let body2 of this.gameObjects) {
                if (body2.bodyId >= body1.bodyId) {
                    continue;
                }
                if (!Collision.areColliding(body1, body2)) {
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

                    var k = mtv.penetratingBody.mInv + mtv.referenceBody.mInv;
                    k += mtv.penetratingBody.IInv * (rn1 * rn1);
                    k += mtv.referenceBody.IInv * (rn2 * rn2);


                    let slop = 0.02;
                    let bias = 0.2 / this.dt * Math.max(mtv.length - slop, 0);
                    let P = (relativeVelocity + sign * bias) / k;

                    P = mtv.normal.scale(P).normal();

                    let refVector = P.scale(sign);
                    let indVector = P.scale(-1 * sign);
                    incident.arbiters.push({'vec': indVector, 'point': mtv.penetratingPoint});
                    reference.arbiters.push({'vec': refVector, 'point': mtv.referencePoint});
                    incident.applyImpulse(indVector,
                        mtv.penetratingPoint);
                    reference.applyImpulse(refVector,
                        mtv.referencePoint);
                }
            }
        }
    };
}());

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var Solver = {};

module.exports = Solver;

(function () {
        Solver.solve = function (mat, b, iterations) {
            // Ax = b
            let x = [];
            for (let i = 0; i < mat.length; i++) {
                x.push(0);
            }
            for (let iter = 0; iter < iterations; iter++) {
                for (let i = 0; i < mat.length; i++) {
                    let sum = b[i];
                    for (let j = 0; j < mat[i].length; j++) {
                        if (j !== i) {
                            sum -= x[j] * mat[i][j];
                        }
                    }
                    x[i] = sum / mat[i][i];
                }
            }
            return x;
        };
        Solver.getUpper = function (mat) {
            let upper = [];
            let lower = [];
            for (let row = 0; row < mat.length; row++) {
                let newLowerRow = [];
                let newUpperRow = [];
                for (let col = 0; col < max[row].length; col++) {
                    if (row >= col) {
                        newUpperRow.push(mat[row][col]);
                        newLowerRow.push(0)
                    } else {
                        newUpperRow.push(0);
                        newLowerRow.push(mat[row][col]);
                    }
                }
                upper.push(newUpperRow);
                lower.push(newLowerRow);
            }
            return {'lower': lower, 'upper': upper};
        }


    }
    ()
)
;

/***/ })
/******/ ]);