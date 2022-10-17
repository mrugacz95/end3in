const { Vec2 } = require("./Vector");
const Body = require("./Body");

export class Graphics {
    started = false;

    constructor(width, height, engine, debug = false, scale = 60, cameraPos = new Vec2(3, 3), clickCallback = function () {
    }) {
        this.engine = engine
        this.debug = debug
        this.canvas = document.createElement('canvas')
        document.body.appendChild(this.canvas)
        let self = this
        document.addEventListener("click",
            function (event) {
                let worldPos = self.clientToWorldPos(new Vec2(event.clientX, event.clientY))
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
    }

    start() {
        this.started = true;
        this.setInterval()
    };

    setInterval() {
        if (!this.started) {
            return
        }
        const self = this;
        setTimeout(function () {
            self.drawBodies(self.engine.gameObjects)
            self.setInterval()
        }, 1000 * this.dt);
    }

    stop() {
        this.started = false;
    }

    drawBodies(bodies = this.engine.gameObjects) {
        this.clear()
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.ctx.translate(this.cameraPos.x, this.cameraPos.y);
        for (let body of bodies) {
            this.drawBody(this.ctx, body, this.debug)
        }
        this.ctx.restore()
    }

    clear() {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
    };

    drawBody(ctx, body, debug) {
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
                for (let axis of body.transformedAxes) {
                    let mid = axis.axis.scale(0.5).add(axis.p1);
                    let norm = axis.axis.normal();
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

    clientToWorldPos(clientPos) {
        const {top, left} = this.canvas.getBoundingClientRect()
        return new Vec2(clientPos.x, clientPos.y)
            .sub(new Vec2(top, left))
            .scale(1 / this.scale)
            .sub(this.cameraPos);
    }

    worldToCanvasPosition(worldPos) {
        return worldPos.scale(this.scale)
    }
}