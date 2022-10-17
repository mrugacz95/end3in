import { Engine } from "./Engine";

import { Vec2 } from "./Vector";
import { Body, Circle, Polygon } from "./Body";

export class Graphics {
    started = false;
    engine: Engine;
    debug: boolean;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale: number;
    width: number;
    height: number;
    dt: number;
    cameraPos: Vec2;

    constructor(width: number,
                height: number,
                engine: Engine,
                debug: boolean = false,
                scale: number = 60,
                cameraPos: Vec2 = new Vec2(3, 3),
                clickCallback =  (_: Vec2) => {}) {
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
            this.drawBody(body, this.debug)
        }
        this.ctx.restore()
    }

    clear() {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
    };

    drawBody(body: Body, debug: boolean) {
        if (body instanceof Polygon) {
            this.ctx.beginPath();
            for (let i = 0; i < body.points.length + 1; i++) {
                let next = body.points[i % body.points.length]
                    .rotate(body.rot)
                    .transpose(body.pos.x, body.pos.y);
                if (i === 0) {
                    this.ctx.moveTo(next.x, next.y);
                } else {
                    this.ctx.lineTo(next.x, next.y)
                }
            }
            this.ctx.fillStyle = body.color;
            this.ctx.fill();
            if (debug) {
                for (let axis of body.transformedAxes) {
                    let mid = axis.axis.scale(0.5).add(axis.p1);
                    let norm = axis.axis.normal();
                    this.ctx.lineWidth = 1 / this.scale;
                    this.ctx.strokeStyle = "#7a7a7a";
                    this.ctx.beginPath();
                    this.ctx.moveTo(mid.x, mid.y);
                    this.ctx.lineTo(mid.x + norm.x, mid.y + norm.y);
                    this.ctx.stroke()
                }

            }
        } else if (body instanceof Circle) {
            this.ctx.lineWidth = 1 / this.scale;
            this.ctx.beginPath();
            this.ctx.arc(body.pos.x, body.pos.y, body.radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }

    clientToWorldPos(clientPos: Vec2) {
        const {top, left} = this.canvas.getBoundingClientRect()
        return new Vec2(clientPos.x, clientPos.y)
            .sub(new Vec2(top, left))
            .scale(1 / this.scale)
            .sub(this.cameraPos);
    }

    worldToCanvasPosition(worldPos: Vec2) {
        return worldPos.scale(this.scale)
    }
}