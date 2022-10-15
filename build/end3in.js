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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Body.js":
/*!*********************!*\
  !*** ./src/Body.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n\nvar Body = {};\n\nmodule.exports = Body;\n\n(function () {\n\n    Body.rect = function (width, height, x, y, options = {}) {\n        this.pos = Vec2.create(x, y);\n        this.rot = options.rot || 0.0;\n        this.points = [Vec2.create(-width / 2, -height / 2),\n            Vec2.create(width / 2, -height / 2),\n            Vec2.create(width / 2, height / 2),\n            Vec2.create(-width / 2, height / 2)];\n        this.width = width;\n        this.height = height;\n        this.v = Vec2.create(0, 0);\n        this.omega = 0.0;\n        if (options.isStatic) {\n            this.m = 0;\n            this.mInv = 0;\n            this.IInv = 0;\n        } else {\n            this.m = 900 * this.width * this.height;\n            this.mInv = 1.0 / this.m;\n            this.IInv = 12.0 / (this.m * (this.width * this.width + this.height + this.height));\n        }\n        if (options.color) {\n            this.color = options.color\n        } else {\n            this.color = this.randomColor()\n        }\n        this.isStatic = options.isStatic || false;\n        this.type = 'polygon';\n        return Object.assign({}, this)\n    };\n\n    Body.randomColor = function () {\n        var letters = '0123456789ABCDEF';\n        var color = '#';\n        for (var i = 0; i < 6; i++) {\n            color += letters[Math.floor(Math.random() * 16)];\n        }\n        return color;\n    };\n\n    Body.polygon = function (vertices, x, y, options = {}) {\n        this.pos = Vec2.create(x, y);\n        this.rot = options.rot || 0.0;\n        this.points = [];\n        let meanX = vertices.map((o) => o[0]).reduce((p, c) => p + c, 0) / vertices.length;\n        let meanY = vertices.map((o) => o[1]).reduce((p, c) => p + c, 0) / vertices.length;\n        for (let pair of vertices) {\n            this.points.push(Vec2.create(pair[0] - meanX, pair[1] - meanY));\n        }\n        this.v = Vec2.create(0, 0);\n        this.omega = 0.0;\n        if (options.isStatic) {\n            this.m = 0;\n            this.mInv = 0;\n            this.IInv = 0;\n        } else {\n            let area = 0;\n            let last = this.points[this.points.length - 1];\n            for (let point of this.points) {\n                area += (last.x * point.y) - (last.y * point.x);\n                last = point\n            }\n            area /= 2.0;\n            this.m = 900 * Math.abs(area);\n            // aprox with circle\n            this.mInv = 1.0 / this.m;\n            const maxR = (Math.max.apply(Math, this.points.map((v) => (v.sqrtMagnitude()))));\n            this.IInv = 2 / (this.m * maxR * maxR);\n        }\n        if (options.color) {\n            this.color = options.color\n        } else {\n            this.color = this.randomColor()\n        }\n        this.isStatic = options.isStatic || false;\n        this.type = 'polygon';\n        return Object.assign({}, this)\n    };\n\n    Body.regularPolygon = function (num_of_vertices, radius, x, y, options = {}) {\n        let positions = [];\n        for (let i = 0; i < num_of_vertices; i++) {\n            let pos_x = Math.cos(2.0 * Math.PI / num_of_vertices * i) * radius;\n            let pos_y = Math.sin(2.0 * Math.PI / num_of_vertices * i) * radius;\n            positions.push([pos_x, pos_y])\n        }\n        return Body.polygon(positions, x, y, options)\n    };\n\n    Body.circle = function (x, y, radius, options = {}) {\n        this.pos = Vec2.create(x, y);\n        this.rot = 0.0;\n        this.v = Vec2.create(0, 0);\n        this.omega = 0.0;\n        this.IInv = 0;\n        if (options.isStatic) {\n            this.m = 0;\n            this.mInv = 0;\n        } else {\n            let area = 2 * Math.PI * radius * radius;\n            this.m = 900 * area;\n            // aprox with circle\n            this.mInv = 1.0 / this.m;\n            this.IInv = 2 / (this.m * radius * radius);\n        }\n        if (options.color) {\n            this.color = options.color\n        } else {\n            this.color = this.randomColor()\n        }\n        this.isStatic = options.isStatic || false;\n        this.type = 'circle';\n        this.radius = radius;\n        return Object.assign({}, this)\n    };\n\n    Body.draw = function (ctx, debug) {\n        if (this.type === 'polygon') {\n            ctx.beginPath();\n            for (let i = 0; i < this.points.length + 1; i++) {\n                let next = this.points[i % this.points.length]\n                    .rotate(this.rot)\n                    .transpose(this.pos.x, this.pos.y);\n                if (i === 0) {\n                    ctx.moveTo(next.x, next.y);\n                } else {\n                    ctx.lineTo(next.x, next.y)\n                }\n            }\n            ctx.fillStyle = this.color;\n            ctx.fill();\n            if (debug) {\n                for (axis of this.axes()) {\n                    let mid = axis.p1.add(axis.p2).scale(0.5).rotate(this.rot).add(this.pos);\n                    let norm = axis.axis.rotate(this.rot).normal();\n                    ctx.lineWidth = 1 / engine.scale;\n                    ctx.strokeStyle = \"#7a7a7a\";\n                    ctx.beginPath();\n                    ctx.moveTo(mid.x, mid.y);\n                    ctx.lineTo(mid.x + norm.x, mid.y + norm.y);\n                    ctx.stroke()\n                }\n\n            }\n        } else if (this.type === 'circle') {\n            ctx.lineWidth = 1 / engine.scale;\n            ctx.beginPath();\n            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);\n            ctx.stroke();\n        }\n\n    };\n\n    Body.update = function (dt) {\n        this.pos.x += this.v.x * dt;\n        this.pos.y += this.v.y * dt;\n        this.rot += this.omega * dt;\n    };\n\n    Body.applyForce = function (fx, fy, px, py, dt) {\n        px = px - this.pos.x;\n        py = py - this.pos.y;\n        let tau = px * fy - py * fx;\n        let ax = fx * this.mInv;\n        let ay = fy * this.mInv;\n        this.applyAcceleration(ax, ay, tau, dt)\n    };\n\n    Body.applyAcceleration = function (ax, ay, tau, dt) {\n        let alpha = tau * this.IInv;\n        this.v.x += ax * dt;\n        this.v.y -= ay * dt;\n        this.omega += alpha * dt;\n    };\n\n    Body.applyImpulse = function (P, r) {\n        if (this.isStatic) {\n            return\n        }\n        this.v.x -= P.x * this.mInv;\n        this.v.y -= P.y * this.mInv;\n        this.omega -= this.IInv * r.cross(P);\n    };\n\n    Body.axes = function () {\n        let result = [];\n        for (let i = 0; i < this.points.length; i++) {\n            let first = this.points[i].copy();\n            let second = this.points[(i + 1) % this.points.length].copy();\n            result.push({\"axis\": first.copy().sub(second), \"p1\": first, \"p2\": second})\n        }\n        return result;\n    };\n\n    Body.isInside = function (point) {\n        for (a of this.axes()) {\n            let p1 = a.p1.rotate(this.rot).transpose(this.pos.x, this.pos.y);\n            let p2 = a.p2.rotate(this.rot).transpose(this.pos.x, this.pos.y);\n            let s = p1.sub(p2);\n            let d = s.cross(point.sub(p2));\n            if (d > 0) return false;\n        }\n        return true;\n    };\n}());\n\n//# sourceURL=webpack:///./src/Body.js?");

/***/ }),

/***/ "./src/Collision.js":
/*!**************************!*\
  !*** ./src/Collision.js ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n\nvar Collision = {};\n\nmodule.exports = Collision;\n\n(function () {\n    Collision.areColliding = function (body1, body2) {\n        if(body1.type !== body2.type){return false} // TODO add more calculations\n        if(body1.type === 'polygon') {\n            var b1X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n            var b1Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n            var b2X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n            var b2Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n            for (let point of body1.points) {\n                let p = point.copy().rotate(body1.rot).transpose(body1.pos.x, body1.pos.y);\n                b1X = Vec2.create(Math.min(b1X.x, p.x), Math.max(b1X.y, p.x));\n                b1Y = Vec2.create(Math.min(b1Y.x, p.y), Math.max(b1Y.y, p.y));\n            }\n            for (let point of body2.points) {\n                let p = point.copy().rotate(body2.rot).transpose(body2.pos.x, body2.pos.y);\n                b2X = Vec2.create(Math.min(b2X.x, p.x), Math.max(b2X.y, p.x));\n                b2Y = Vec2.create(Math.min(b2Y.x, p.y), Math.max(b2Y.y, p.y));\n            }\n            return b1X.x < b2X.y &&\n                b1X.y > b2X.x &&\n                b1Y.x < b2Y.y &&\n                b1Y.y > b2Y.x;\n        } else if (body1.type === 'circle'){\n            return body1.pos.sub(body2.pos).sqrtMagnitude() < body1.radious + body2.radious;\n        }\n    };\n\n    Collision.calculateSAT = function (body1, body2, options = {}) {\n        if(body1.type === 'circle' || body2.type === 'circle') return null; // TODO add more calculations\n        let context = !options.debug || options.context;\n        let debug = options.debug || false;\n\n        function projectPoint(axis, point, body) {\n            return point.copy().rotate(body.rot).transpose(body.pos.x, body.pos.y).cross(axis);\n        }\n\n        function projectBody(axis, body) {\n            let min = Number.MAX_VALUE;\n            let minPoint;\n            let max = -Number.MAX_VALUE;\n            let maxPoint;\n            for (let point of body.points) {\n                let projection = projectPoint(axis, point, body);\n                if (min > projection) {\n                    min = projection;\n                    minPoint = point.copy();\n                }\n                if (max < projection) {\n                    max = projection;\n                    maxPoint = point.copy();\n                }\n            }\n            return {\"min\": min, \"max\": max, \"minPoint\": minPoint, \"maxPoint\": maxPoint};\n        }\n\n        function drawNormal(normal) {\n            context.strokeStyle = \"#000\";\n            context.lineWidth = 1;\n            normal = normal.copy().normal();\n            context.beginPath();\n            let axisStart = normal.copy().scale(-10 * engine.scale);\n            context.moveTo(axisStart.x, axisStart.y);\n            let axisEnd = normal.copy().scale(10 * engine.scale);\n            context.lineTo(axisEnd.x, axisEnd.y);\n            context.stroke();\n        }\n\n        function drawProjection(normal, body, proj, color, width) {\n            context.strokeStyle = color;\n            context.lineWidth = width;\n            normal = normal.copy().normal();\n            context.beginPath();\n            let axisStart = normal.copy().scale(proj.max * -engine.scale);\n            context.moveTo(axisStart.x, axisStart.y);\n            let axisEnd = normal.copy().scale(proj.min * -engine.scale);\n            context.lineTo(axisEnd.x, axisEnd.y);\n            context.stroke();\n        }\n\n        let mtvAxis = null;\n        let mtvLength = Number.MAX_VALUE;\n        let refP1;\n        let refP2;\n        let incP1;\n        let incP2;\n        let incidentBody;\n        let referenceBody;\n        for (let bodies of [[body1, body2], [body2, body1]]) {\n            let body = bodies[0];\n            let other = bodies[1];\n            for (let axisWithPoints of body.axes()) {\n                let axis = axisWithPoints.axis;\n\n                let normal = axis.rotate(body.rot).normalize();\n                let bProj = projectBody(normal, body);\n                let oProj = projectBody(normal, other);\n                if (debug) {\n                    drawNormal(normal);\n                    drawProjection(normal, body, bProj, \"#FF0000\", 10);\n                    drawProjection(normal, other, oProj, \"#00FF00\", 8);\n                }\n                // check overlap\n                if (bProj.max <= oProj.min ||\n                    bProj.min >= oProj.max) {\n                    return false\n                }\n                let overlap = 0;\n\n                if (bProj.min < oProj.min) {\n                    overlap = bProj.max - oProj.min;\n                } else {\n                    overlap = oProj.max - bProj.min;\n                }\n                if (overlap < mtvLength) {\n                    mtvLength = overlap;\n                    mtvAxis = normal;\n                    referenceBody = body;\n                    refP1 = axisWithPoints.p1.copy();\n                    refP2 = axisWithPoints.p2.copy();\n                    incidentBody = other;\n                    incP1 = oProj.minPoint.copy();\n                    incP2 = oProj.maxPoint.copy();\n\n                }\n            }\n        }\n        let penetratingPointInWorld = incP2\n            .rotate(incidentBody.rot)\n            .transpose(incidentBody.pos.x, incidentBody.pos.y);\n        let penetratingPoint;\n        if (referenceBody.isInside(penetratingPointInWorld)) {\n            penetratingPoint = incP2;\n        } else {\n            penetratingPoint = incP1;\n        }\n        let edgePoint = penetratingPoint\n            .rotate(incidentBody.rot)\n            .transpose(incidentBody.pos.x, incidentBody.pos.y)\n            .add(mtvAxis.normal().scale(mtvLength))\n            .transpose(-referenceBody.pos.x, -referenceBody.pos.y);\n        penetratingPoint = penetratingPoint\n            .rotate(incidentBody.rot);\n\n        return {\n            'normal': mtvAxis,\n            'length': mtvLength,\n            'penetratingBody': incidentBody,\n            'refP1': refP1,\n            'refP2': refP2,\n            'referenceBody': referenceBody,\n            'referencePoint': edgePoint,\n            'penetratingPoint': penetratingPoint\n        };\n    }\n}());\n\n//# sourceURL=webpack:///./src/Collision.js?");

/***/ }),

/***/ "./src/Engine.js":
/*!***********************!*\
  !*** ./src/Engine.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./Collision */ \"./src/Collision.js\");\n__webpack_require__(/*! ./Solver */ \"./src/Solver.js\");\n\nvar Engine = {};\n\nmodule.exports = Engine;\n\n(function () {\n\n    Engine.create = function (debug = false, solver = 'impulse') {\n        this.canvas = document.getElementById('canvas');\n        this.solver = solver;\n        this.ctx = canvas.getContext('2d');\n        this.scale = 60;\n        this.cameraPos = Vec2.create(3, 3);\n        this.dt = 1 / 60;\n        this.width = 10 * this.scale;\n        this.height = 10 * this.scale;\n        this.debug = debug;\n        this.canvas.width = this.width;\n        this.canvas.height = this.height;\n        this.g = -9.81;\n        this.gameObjects = [];\n        this.newBodyId = 0;\n        this.joints = [];\n        return Object.assign({}, this)\n    };\n\n    Engine.start = function () {\n        self = this;\n        window.setInterval(function () {\n            self.update.call(self)\n        }, 1000 * self.dt);\n    };\n\n    Engine.clear = function () {\n        this.ctx.fillStyle = \"#FFFFFF\";\n        this.ctx.fillRect(0, 0, this.width, this.height);\n        this.ctx.fillStyle = \"#000000\";\n    };\n\n    Engine.update = function () {\n        this.clear();\n        for (let obj of this.gameObjects) {\n            if (obj.mInv !== 0) {\n                obj.applyAcceleration(0, this.g, 0, engine.dt);\n            }\n        }\n        if (this.solver === 'impulse') {\n            this.impulseSolver();\n        } else if (this.solver === 'constraint') {\n            this.constraintSolver();\n        }\n        for (let obj of this.gameObjects) {\n            obj.update(this.dt);\n        }\n        this.draw();\n    };\n\n    Engine.draw = function () {\n        this.ctx.save();\n        this.ctx.scale(this.scale, this.scale);\n        this.ctx.translate(this.cameraPos.x, this.cameraPos.y);\n        for (let obj of this.gameObjects) {\n            obj.draw(this.ctx, this.debug);\n        }\n        this.ctx.restore()\n    };\n\n    Engine.addBody = function (body) {\n        body.bodyId = this.newBodyId;\n        this.newBodyId += 1;\n        this.gameObjects.push(body);\n    };\n\n    Engine.addAllBodies = function (bodies) {\n        for (let body of bodies) {\n            this.addBody(body)\n        }\n    };\n\n    Engine.impulseSolver = function () {\n        for (let body1 of this.gameObjects) {\n            for (let body2 of this.gameObjects) {\n                if (body2.bodyId >= body1.bodyId) {\n                    continue;\n                }\n                if (!Collision.areColliding(body1, body2)) {\n                    continue;\n                }\n                if (body1.type === 'circle' && body1.type === 'circle') { //TODO add more cases\n                    continue;\n                }\n                let mtv = Collision.calculateSAT(body1, body2);\n                if (mtv) {\n                    let incident = mtv.penetratingBody;\n                    let reference = mtv.referenceBody;\n                    // V + omega × r\n                    let penetratingVelocity = mtv.penetratingBody.v\n                        .add(mtv.penetratingPoint\n                            .normal()\n                            .scale(mtv.penetratingBody.omega))\n                        .cross(mtv.normal);\n                    let referenceVelocity = mtv.referenceBody.v\n                        .add(mtv.referencePoint\n                            .normal()\n                            .scale(mtv.referenceBody.omega))\n                        .cross(mtv.normal);\n\n                    let relativeVelocity = penetratingVelocity - referenceVelocity;\n                    let sign = Math.sign(relativeVelocity);\n                    relativeVelocity = Math.abs(relativeVelocity);\n\n                    let rn1 = mtv.penetratingPoint.cross(mtv.normal);\n                    let rn2 = mtv.referencePoint.cross(mtv.normal);\n\n                    var k = mtv.penetratingBody.mInv + mtv.referenceBody.mInv;\n                    k += mtv.penetratingBody.IInv * (rn1 * rn1);\n                    k += mtv.referenceBody.IInv * (rn2 * rn2);\n\n\n                    let slop = 0.02;\n                    let bias = 0.2 / this.dt * Math.max(mtv.length - slop, 0);\n                    let P = (relativeVelocity + sign * bias) / k;\n\n                    P = mtv.normal.scale(P).normal();\n\n                    let refVector = P.scale(sign);\n                    let indVector = P.scale(-1 * sign);\n                    incident.applyImpulse(indVector,\n                        mtv.penetratingPoint);\n                    reference.applyImpulse(refVector,\n                        mtv.referencePoint);\n                }\n            }\n        }\n    };\n    Engine.addJoint = function (joint) {\n        this.joints.push(joint)\n    };\n    Engine.addAllJoints = function (joints) {\n        for (let joint of joints) {\n            this.addJoint(joint);\n        }\n    };\n\n    Engine.constraintSolver = function () {\n        for (let i = 0; i < 4; i++) {\n            for (let c of this.joints) {\n                let J = [];\n                let pA = c.local1Anchor.rotate(c.body1.rot).transpose(c.body1.pos);\n                let pB = c.local1Anchor.rotate(c.body2.rot).transpose(c.body2.pos);\n                J.push(2 * (pA.x - pB.x),\n                    2 * (pA.y - pB.y),\n                    // 2 * pA.sub(pB).scale(-1).cross(pA.sub(c.body1.pos)),\n                    2 * (pB.x - pA.x),\n                    2 * (pB.y - pA.y),\n                    // 2 * pA.sub(pB).scale(-1).cross(pB.sub(c.body1.pos)),\n                );\n                let bias = (0.2 / this.dt) * pA.sub(pB).sqrtMagnitude();\n                // let lambda = -\n            }\n        }\n    };\n}());\n\n//# sourceURL=webpack:///./src/Engine.js?");

/***/ }),

/***/ "./src/Joint.js":
/*!**********************!*\
  !*** ./src/Joint.js ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n\nvar Joint = {};\n\nmodule.exports = Joint;\n\n(function () {\n    Joint.create = function (body1, body2, position) {\n        this.body1 = body1;\n        this.body2 = body2;\n        this.local1Anchor = position.sub(body1.pos).rotate(body1.rot);\n        this.local2Anchor = position.sub(body2.pos).rotate(body2.rot);\n        return Object.assign({}, this)\n    }\n}());\n\n//# sourceURL=webpack:///./src/Joint.js?");

/***/ }),

/***/ "./src/Solver.js":
/*!***********************!*\
  !*** ./src/Solver.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("var Solver = {};\n\nmodule.exports = Solver;\n\n(function () {\n        Solver.solve = function (mat, b, iterations) {\n            // Ax = b\n            let x = [];\n            for (let i = 0; i < mat.length; i++) {\n                x.push(0);\n            }\n            for (let iter = 0; iter < iterations; iter++) {\n                for (let i = 0; i < mat.length; i++) {\n                    let sum = b[i];\n                    for (let j = 0; j < mat[i].length; j++) {\n                        if (j !== i) {\n                            sum -= x[j] * mat[i][j];\n                        }\n                    }\n                    x[i] = sum / mat[i][i];\n                }\n            }\n            return x;\n        };\n        Solver.getUpper = function (mat) {\n            let upper = [];\n            let lower = [];\n            for (let row = 0; row < mat.length; row++) {\n                let newLowerRow = [];\n                let newUpperRow = [];\n                for (let col = 0; col < max[row].length; col++) {\n                    if (row >= col) {\n                        newUpperRow.push(mat[row][col]);\n                        newLowerRow.push(0)\n                    } else {\n                        newUpperRow.push(0);\n                        newLowerRow.push(mat[row][col]);\n                    }\n                }\n                upper.push(newUpperRow);\n                lower.push(newLowerRow);\n            }\n            return {'lower': lower, 'upper': upper};\n        }\n\n\n    }\n    ()\n)\n;\n\n//# sourceURL=webpack:///./src/Solver.js?");

/***/ }),

/***/ "./src/Vector.js":
/*!***********************!*\
  !*** ./src/Vector.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("Vec2 = {};\n\nmodule.exports = Vec2;\n\n(function () {\n    Vec2.create = function (x, y) {\n        this.x = x;\n        this.y = y;\n        return Object.assign({}, this)\n    };\n\n\n    Vec2.transpose = function (x, y) {\n        return Vec2.create(this.x + x, this.y + y)\n    };\n\n    Vec2.rotate = function (theta) {\n        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);\n        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);\n        return Vec2.create(rotatedX, rotatedY);\n    };\n\n    Vec2.copy = function () {\n        return Vec2.create(this.x, this.y)\n    };\n\n    Vec2.scale = function (s) {\n        return Vec2.create(this.x * s, this.y * s);\n    };\n\n    Vec2.sqrtMagnitude = function () {\n        return Math.sqrt(this.magnitude());\n    };\n\n    Vec2.magnitude = function () {\n        return this.x * this.x + this.y * this.y;\n    };\n\n    Vec2.sub = function (other) {\n        return Vec2.create(this.x - other.x, this.y - other.y);\n    };\n\n    Vec2.normalize = function () {\n        let len = this.sqrtMagnitude();\n        return Vec2.create(this.x / len, this.y / len)\n    };\n\n    Vec2.dot = function (other) {\n        return this.x * other.x - this.y * other.y;\n    };\n\n    Vec2.cross = function (other) {\n        return this.x * other.y - this.y * other.x;\n    };\n\n\n    Vec2.normal = function () {\n        return Vec2.create(-this.y, this.x);\n    };\n\n    Vec2.add = function (other) {\n        return Vec2.create(this.x + other.x, this.y + other.y);\n    };\n\n    Vec2.div = function (divider) {\n        return Vec2.create(this.x / divider, this.y / divider);\n    };\n\n    Vec2.pseudoCross = function (value) {\n        return Vec2.create(-value * this.x, value * this.y)\n    }\n}());\n\n//# sourceURL=webpack:///./src/Vector.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("end3in = {};\n\nend3in.Vector = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\nend3in.Body = __webpack_require__(/*! ./Body */ \"./src/Body.js\");\nend3in.Engine = __webpack_require__(/*! ./Engine */ \"./src/Engine.js\");\nend3in.Collision = __webpack_require__(/*! ./Collision */ \"./src/Collision.js\");\nend3in.Solver = __webpack_require__(/*! ./Solver */ \"./src/Solver.js\");\nend3in.Joint = __webpack_require__(/*! ./Joint */ \"./src/Joint.js\");\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });