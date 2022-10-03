const Vec2 = require("./Vector");
const Body = require("./Body");
const Graphics = {}

module.exports = Graphics;

(function () {
    Graphics.started = false;

    Graphics.create = function (width, height, engine, debug = false, scale  = 60, cameraPos = Vec2.create(3, 3), clickCallback = function () {
    }) {
        this.engine = engine
        this.debug = debug
        this.canvas = document.createElement('canvas')
        document.body.appendChild(this.canvas)
        let self = this
        document.addEventListener("click",
            function (event) {
                let worldPos = self.clientToWorldPos(Vec2.create(event.clientX, event.clientY))
                clickCallback(worldPos)
            });
        this.ctx = this.canvas.getContext('2d');
        this.scale = scale;
        this.cameraPos = cameraPos;
        this.width = 10 * this.scale;
        this.height = 10 * this.scale;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.dt = 1 / 60;
        return Object.assign({}, this)
    }

    Graphics.start = function () {
        this.started = true;
        this.setInterval()
    };

    Graphics.setInterval = function () {
        if (!this.started) {
            return
        }
        const self = this;
        setTimeout(function () {
            self.drawBodies(self.engine.gameObjects)
            self.setInterval()
        }, 1000 * this.dt);
    }

    Graphics.stop = function () {
        this.started = false;
    }

    Graphics.drawBodies = function (bodies = this.engine.gameObjects) {
        this.clear()
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(this.cameraPos.x, this.cameraPos.y);
        for (let body of bodies) {
            this.drawBody(this.ctx, body, this.debug)
        }
        this.ctx.restore()
    }

    Graphics.clear = function () {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
    };

    Graphics.drawBody = function (ctx, body, debug) {
        if (body.type === Body.Type.Polygon) {
            ctx.beginPath();
            for (let i = 0; i < body.points.length + 1; i++) {
                let next = body.points[i % body.points.length]
                    .rotate(body.rot)
                    .transpose(body.pos.x, body.pos.y);
                if (i === 0) {
                    ctx.moveTo(next.x, next.y);
                } else {
                    ctx.lineTo(next.x, next.y)
                }
            }
            ctx.fillStyle = body.color;
            ctx.fill();
            if (debug) {
                for (let axis of body.axes()) {
                    let mid = axis.p1.add(axis.p2).scale(0.5).rotate(body.rot).add(body.pos);
                    let norm = axis.axis.rotate(body.rot).normal();
                    ctx.lineWidth = 1 / this.scale;
                    ctx.strokeStyle = "#7a7a7a";
                    ctx.beginPath();
                    ctx.moveTo(mid.x, mid.y);
                    ctx.lineTo(mid.x + norm.x, mid.y + norm.y);
                    ctx.stroke()
                }

            }
        } else if (body.type === Body.Type.Circle) {
            ctx.lineWidth = 1 / this.scale;
            ctx.beginPath();
            ctx.arc(body.pos.x, body.pos.y, body.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    Graphics.clientToWorldPos = function (clientPos) {
        const {top, left} = this.canvas.getBoundingClientRect()
        return Vec2.create(clientPos.x, clientPos.y)
            .sub(Vec2.create(top, left))
            .scale(1 / this.scale)
            .sub(this.cameraPos);
    }

    Graphics.worldToCanvasPosition = function (worldPos) {
        return worldPos.scale(this.scale)
    }
})()