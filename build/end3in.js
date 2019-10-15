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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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
        this.x += x;
        this.y += y;
        return this
    };

    Vec2.rotate = function (theta) {
        let rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        let rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        this.x = rotatedX;
        this.y = rotatedY;
        return this
    };

    Vec2.copy = function () {
        return Vec2.create(this.x, this.y)
    };

    Vec2.scale = function (s) {
        this.x *= s;
        this.y *= s;
        return this
    };

    Vec2.sqrtMagnitude = function () {
        return Math.sqrt(this.magnitude());
    };

    Vec2.magnitude = function () {
        return this.x * this.x + this.y * this.y;
    };

    Vec2.sub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };

    Vec2.normalize = function () {
        let len = this.sqrtMagnitude();
        this.x /= len;
        this.y /= len;
        return this
    };

    Vec2.dot = function (other) {
        return this.x * other.y - this.y * other.x;
    };


    Vec2.normal = function () {
        return Vec2.create(-this.y, this.x);
    };

    Vec2.add = function(other){
        this.x += other.x;
        this.y += other.y;
        return this;
    }
}());

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

end3in = {};

end3in.Vector = __webpack_require__(0);
end3in.Body = __webpack_require__(2);
end3in.Engine = __webpack_require__(3);
end3in.Collision = __webpack_require__(4);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);

var Body = {};

module.exports = Body;

(function () {

    Body.setDefaults = function () {

    };

    Body.rect = function (width, height, x, y, options = {}) {
        this.pos = Vec2.create(x, y);
        this.rot = options.rot || 0.0;
        this.points = [Vec2.create(-width / 2, -height / 2),
            Vec2.create(width / 2, -height / 2),
            Vec2.create(width / 2, height / 2),
            Vec2.create(-width / 2, height / 2)];
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.omega = 0.0;
        if (options.isStatic) {
            this.m = 0;
            this.mInv = 0;
            this.IInv = 0;
        } else {
            this.m = 0.9 * this.width * this.height;
            this.mInv = 1.0 / this.m;
            this.IInv = this.m * (this.width * this.width + this.height + this.height) / 12;
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
        this.vx = 0;
        this.vy = 0;
        this.omega = 0.0;
        if (options.isStatic) {
            this.m = 0;
            this.mInv = 0;
            this.IInv = 0;
        } else {
            this.m = 0;
            var last = this.points[this.points.length - 1];
            for (let point of this.points) {
                this.m += (last.x + point.y) * (last.y - point.x);
                last = point
            }
            this.m = Math.abs(this.m / 2.0);
            this.mInv = 1.0 / this.m;
            this.IInv = 2 / (this.m * Math.max.apply(this.points.map((v) => (v.length))));
        }
        if (options.color) {
            this.color = options.color
        } else {
            this.color = "#000000"
        }
        return Object.assign({}, this)
    };

    Body.draw = function (ctx, scale) {
        ctx.beginPath();
        for (let i = 0; i < this.points.length + 1; i++) {
            let next = this.points[i % this.points.length]
                .copy()
                .rotate(this.rot)
                .scale(scale)
                .transpose(this.pos.x * scale, this.pos.y * scale);
            if (i === 0) {
                ctx.moveTo(next.x, next.y);
            } else {
                ctx.lineTo(next.x, next.y)
            }
        }
        ctx.fillStyle = this.color;
        ctx.fill()

    };

    Body.update = function (dt) {
        this.pos.x += this.vx * dt;
        this.pos.y += this.vy * dt;
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
        this.vx += ax * dt;
        this.vy -= ay * dt;
        this.omega += alpha * dt;
    };

    Body.axes = function () {
        let result = [];
        for (let i = 0; i < this.points.length; i++) {
            let first = this.points[i].copy();
            let second = this.points[(i + 1) % this.points.length].copy();
            let normal = first.sub(second);
            result.push(normal)
        }
        return result;
    }
}());

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var Engine = {};

module.exports = Engine;

(function () {

    Engine.create = function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.scale = 60;
        this.cameraPos = Vec2.create(3, 3);

        this.width = 10 * this.scale;
        this.height = 10 * this.scale;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gameObjects = [];
        return Object.assign({}, this)
    };

    Engine.start = function () {
        self = this;
        window.setInterval(function () {
            self.update.call(self)
        }, 16);
    };

    Engine.clear = function () {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
    };

    Engine.update = function () {
        this.clear();
        for (let obj of this.gameObjects) {
            obj.applyForce(0, -9.81 * obj.m, obj.pos.x, obj.pos.y, 16 / 1000);
        }
        for (let obj of this.gameObjects) {
            obj.update(16 / 1000);
        }
        this.draw();
    };

    Engine.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.cameraPos.x * this.scale, this.cameraPos.y * this.scale);
        for (let obj of this.gameObjects) {
            obj.draw(this.ctx, this.scale);
        }
        this.ctx.restore()
    };

    Engine.addBody = function (body) {
        this.gameObjects.push(body);
    };
}());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);

var Collision = {};

module.exports = Collision;

(function () {
    Collision.areColliding = function (body1, body2) {
        // AABB test
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

    Collision.calculateSAT = function (body1, body2, options) {
        let context = options.context;
        let debug = options.debug || false;

        function project(axis, body) {
            let min = Number.MAX_VALUE;
            let max = -Number.MAX_VALUE;
            for (let point of body.points) {
                let projection = point.copy().rotate(body.rot).transpose(body.pos.x, body.pos.y).dot(axis);
                min = Math.min(min, projection);
                max = Math.max(max, projection);
            }
            return Vec2.create(min, max);
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

        function drawProjection(normal, body, proj, color) {
            context.strokeStyle = color;
            context.lineWidth = 8;
            normal = normal.copy().normal();
            context.beginPath();
            let axisStart = normal.copy().scale(proj.y * -engine.scale);
            context.moveTo(axisStart.x, axisStart.y);
            let axisEnd = normal.copy().scale(proj.x * -engine.scale);
            context.lineTo(axisEnd.x, axisEnd.y);
            context.stroke();
        }

        for (let body of [body1, body2]) {
            for (let axis of body.axes()) {
                let normal = axis.rotate(body.rot).normalize();
                let b1Proj = project(normal, body1);
                let b2Proj = project(normal, body2);
                if (debug) {
                    drawNormal(normal);
                    drawProjection(normal, body1, b1Proj, "#FF0000");
                    drawProjection(normal, body2, b2Proj, "#00FF00");
                }
                if (b1Proj.y <= b2Proj.x ||
                    b1Proj.x >= b2Proj.y) {
                    return false
                }
            }
        }
        return true;
    }
}());

/***/ })
/******/ ]);