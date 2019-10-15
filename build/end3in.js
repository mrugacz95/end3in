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

eval("__webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n\nvar Body = {};\n\nmodule.exports = Body;\n\n(function () {\n\n    Body.rect = function (width, height, x, y, options = {}) {\n\n        this.pos = Vec2.create(x, y);\n        this.rot = options.rot || 0.0;\n        this.points = [Vec2.create(-width / 2, -height / 2),\n            Vec2.create(width / 2, -height / 2),\n            Vec2.create(width / 2, height / 2),\n            Vec2.create(-width / 2, height / 2)];\n        this.width = width;\n        this.height = height;\n        this.vx = 0;\n        this.vy = 0;\n        this.omega = 0.0;\n        if (options.isStatic) {\n            this.m = 0;\n            this.mInv = 0;\n            this.IInv = 0;\n        } else {\n            this.m = 0.9 * this.width * this.height;\n            this.mInv = 1.0 / this.m;\n            this.IInv = this.m * (this.width * this.width + this.height + this.height) / 12;\n        }\n        if (options.color) {\n            this.color = options.color\n        } else {\n            this.color = \"#000000\"\n        }\n        return Object.assign({}, this)\n    };\n    Body.draw = function (ctx, scale) {\n        ctx.beginPath();\n        for (let i = 0; i < this.points.length + 1; i++) {\n            let next = this.points[i % this.points.length]\n                .copy()\n                .rotate(this.rot)\n                .scale(scale)\n                .transpose(this.pos.x * scale, this.pos.y * scale);\n            if (i === 0) {\n                ctx.moveTo(next.x, next.y);\n            } else {\n                ctx.lineTo(next.x, next.y)\n            }\n        }\n        ctx.fillStyle = this.color;\n        ctx.fill()\n\n    };\n\n    Body.update = function (dt) {\n        this.pos.x += this.vx * dt;\n        this.pos.y += this.vy * dt;\n        this.rot += this.omega * dt;\n    };\n\n    Body.applyForce = function (fx, fy, px, py, dt) {\n        px = px - this.pos.x;\n        py = py - this.pos.y;\n        let tau = px * fy - py * fx;\n        let ax = fx * this.mInv;\n        let ay = fy * this.mInv;\n        this.applyAcceleration(ax, ay, tau, dt)\n    };\n\n    Body.applyAcceleration = function (ax, ay, tau, dt) {\n        let alpha = tau * this.IInv;\n        this.vx += ax * dt;\n        this.vy -= ay * dt;\n        this.omega += alpha * dt;\n    };\n\n    Body.axes = function () {\n        let result = [];\n        for (let i = 0; i < this.points.length; i++) {\n            let first = this.points[i].copy().rotate(this.rot);\n            let second = this.points[(i + 1) % this.points.length].copy().rotate(this.rot);\n            let normal = first.sub(second);\n            result.push(normal)\n        }\n        return result;\n    }\n}());\n\n//# sourceURL=webpack:///./src/Body.js?");

/***/ }),

/***/ "./src/Collision.js":
/*!**************************!*\
  !*** ./src/Collision.js ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\n\nvar Collision = {};\n\nmodule.exports = Collision;\n\n(function () {\n    Collision.areColliding = function (body1, body2) {\n        // AABB test\n        var b1X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n        var b1Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n        var b2X = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n        var b2Y = Vec2.create(Number.MAX_VALUE, Number.MIN_VALUE);\n        for (let point of body1.points) {\n            let p = point.copy().rotate(body1.rot).transpose(body1.pos.x, body1.pos.y);\n            b1X = Vec2.create(Math.min(b1X.x, p.x), Math.max(b1X.y, p.x));\n            b1Y = Vec2.create(Math.min(b1Y.x, p.y), Math.max(b1Y.y, p.y));\n        }\n        for (let point of body2.points) {\n            let p = point.copy().rotate(body2.rot).transpose(body2.pos.x, body2.pos.y);\n            b2X = Vec2.create(Math.min(b2X.x, p.x), Math.max(b2X.y, p.x));\n            b2Y = Vec2.create(Math.min(b2Y.x, p.y), Math.max(b2Y.y, p.y));\n        }\n        return b1X.x < b2X.y &&\n            b1X.y > b2X.x &&\n            b1Y.x < b2Y.y &&\n            b1Y.y > b2Y.x;\n\n    };\n\n    Collision.calculateSAT = function (body1, body2) {\n        function project(axis, body) {\n            let min = Number.MAX_VALUE;\n            let max = -Number.MAX_VALUE;\n            for (let point of body.points) {\n                let projection = point.copy().rotate(body.rot).transpose(body.pos.x, body.pos.y).dot(axis);\n                min = Math.min(min, projection);\n                max = Math.max(max, projection);\n            }\n            return Vec2.create(min, max);\n        }\n\n        for (let axis of body1.axes()) {\n            let normal = axis.normal().normalize();\n            let b1Proj = project(normal, body1);\n            let b2Proj = project(normal, body2);\n            if (b1Proj.y < b2Proj.x ||\n                b1Proj.x > b2Proj.y) {\n                return false\n            }\n        }\n        for (let axis of body2.axes()) {\n            let normal = axis.normal().normalize();\n            let b1Proj = project(normal, body1);\n            let b2Proj = project(normal, body2);\n            if (b1Proj.y < b2Proj.x ||\n                b1Proj.x > b2Proj.y) {\n                return false\n            }\n        }\n        return true;\n    }\n}());\n\n//# sourceURL=webpack:///./src/Collision.js?");

/***/ }),

/***/ "./src/Engine.js":
/*!***********************!*\
  !*** ./src/Engine.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("var Engine = {};\n\nmodule.exports = Engine;\n\n(function () {\n\n    Engine.create = function () {\n        this.canvas = document.getElementById('canvas');\n        this.ctx = canvas.getContext('2d');\n        this.scale = 60;\n\n        this.width = 10 * this.scale;\n        this.height = 10 * this.scale;\n\n        this.canvas.width = this.width;\n        this.canvas.height = this.height;\n\n        this.gameObjects = [];\n        return Object.assign({}, this)\n    };\n\n    Engine.start = function () {\n        self = this;\n        window.setInterval(function () {\n            self.update.call(self)\n        }, 16);\n    };\n\n    Engine.clear = function () {\n        this.ctx.fillStyle = \"#FFFFFF\";\n        this.ctx.fillRect(0, 0, this.width, this.height);\n        this.ctx.fillStyle = \"#000000\";\n    };\n\n    Engine.update = function () {\n        this.clear();\n        let obj;\n        for (obj of this.gameObjects) {\n            obj.applyForce(0, -9.81 * obj.m, obj.pos.x, obj.pos.y, 16 / 1000);\n        }\n        for (obj of this.gameObjects) {\n            obj.update(16 / 1000);\n        }\n        for (obj of this.gameObjects) {\n            obj.draw(this.ctx, this.scale);\n        }\n    };\n\n    Engine.addBody = function (body) {\n        this.gameObjects.push(body);\n    };\n}());\n\n//# sourceURL=webpack:///./src/Engine.js?");

/***/ }),

/***/ "./src/Vector.js":
/*!***********************!*\
  !*** ./src/Vector.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

eval("Vec2 = {};\n\nmodule.exports = Vec2;\n\n(function () {\n    Vec2.create = function (x, y) {\n        this.x = x;\n        this.y = y;\n        return Object.assign({}, this)\n    };\n\n\n    Vec2.transpose = function (x, y) {\n        this.x += x;\n        this.y += y;\n        return this\n    };\n\n    Vec2.rotate = function (theta) {\n        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);\n        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);\n        this.x = rotatedX;\n        this.y = rotatedY;\n        return this\n    };\n\n    Vec2.copy = function () {\n        return Vec2.create(this.x, this.y)\n    };\n\n    Vec2.scale = function (s) {\n        this.x *= s;\n        this.y *= s;\n        return this\n    };\n\n    Vec2.sqrtMagnitude = function () {\n        return Math.sqrt(this.magnitude());\n    };\n\n    Vec2.magnitude = function () {\n        return this.x * this.x + this.y * this.y;\n    };\n\n    Vec2.sub = function (other) {\n        this.x -= other.x;\n        this.y -= other.y;\n        return this;\n    };\n\n    Vec2.normalize = function () {\n        let len = this.sqrtMagnitude();\n        this.x /= len;\n        this.y /= len;\n        return this\n    };\n\n    Vec2.dot = function (other) {\n        return this.x * other.y - this.y * other.x;\n    };\n\n\n    Vec2.normal = function () {\n        return Vec2.create(-this.y, this.x);\n    };\n\n    Vec2.add = function(other){\n        this.x += other.x;\n        this.y += other.y;\n        return this;\n    }\n}());\n\n//# sourceURL=webpack:///./src/Vector.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("end3in = {};\n\nend3in.Vector = __webpack_require__(/*! ./Vector */ \"./src/Vector.js\");\nend3in.Body = __webpack_require__(/*! ./Body */ \"./src/Body.js\");\nend3in.Engine = __webpack_require__(/*! ./Engine */ \"./src/Engine.js\");\nend3in.Collision = __webpack_require__(/*! ./Collision */ \"./src/Collision.js\");\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });