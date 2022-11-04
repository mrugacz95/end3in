import { Engine } from "./Engine";

import { Vec2 } from "./Vector";
import { Body, Circle, Polygon } from "./Body";

interface GraphicsParameters {
    width: number;
    height: number;
    engine: Engine;
    debug?: boolean;
    scale: number;
    cameraPos: Vec2;
    clickCallback?: ((_: Vec2) => void);
}

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

    constructor(
        {
            width,
            height,
            engine,
            debug = false,
            scale = 60,
            cameraPos = new Vec2(3, 3),
            clickCallback = null
        }: GraphicsParameters) {
        this.width = width
        this.height = height
        this.engine = engine
        this.debug = debug
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        document.body.appendChild(this.canvas)
        this.addClickCallback(clickCallback)
        this.ctx = this.canvas.getContext('2d');
        this.scale = scale;
        this.cameraPos = cameraPos;
        this.width = 10 * this.scale;
        this.height = 10 * this.scale;
        this.dt = 1 / 60;
    }

    start() {
        this.started = true;
        this.setInterval()
    }

    setInterval() {
        if (!this.started) {
            return
        }
        setTimeout(() => {
            this.drawBodies(this.engine.gameObjects)
            this.setInterval()
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
        for (const body of bodies) {
            this.drawBody(body, this.debug)
        }
        this.ctx.restore()
    }

    clear() {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
        this.ctx.fillStyle = "#000000";
    }

    drawBody(body: Body, debug: boolean) {
        if (body instanceof Polygon) {
            this.ctx.beginPath();
            const axes = body.transformedAxes
            for (let i = 0; i < axes.length; i++) {
                if (i == 0) {
                    this.ctx.moveTo(axes[i].p1.x, axes[i].p1.y);
                }
                this.ctx.lineTo(axes[i].p2.x, axes[i].p2.y)
            }
            this.ctx.fillStyle = body.color;
            this.ctx.fill();
            if (debug) {
                for (const axis of body.transformedAxes) {
                    const mid = axis.axis.scale(0.5).add(axis.p1);
                    const norm = axis.axis.normal();
                    this.ctx.lineWidth = 1 / this.scale;
                    this.ctx.strokeStyle = "#7a7a7a";
                    this.ctx.beginPath();
                    this.ctx.moveTo(mid.x, mid.y);
                    this.ctx.lineTo(mid.x + norm.x, mid.y + norm.y);
                    this.ctx.stroke()
                }
                let axis = body.transformedAxes[0]
                const mid = axis.axis.scale(0.5).add(axis.p1)
                this.ctx.beginPath();
                this.ctx.moveTo(mid.x, mid.y);
                this.ctx.lineTo(body.pos.x, body.pos.y);
                this.ctx.stroke()
            }
        } else if (body instanceof Circle) {
            this.ctx.lineWidth = 1 / this.scale;
            this.ctx.fillStyle = body.color;
            this.ctx.beginPath();
            this.ctx.arc(body.pos.x, body.pos.y, body.radius, 0, 2 * Math.PI);
            this.ctx.fill();
            if (this.debug) {
                this.ctx.strokeStyle = "#7a7a7a";
                this.ctx.lineWidth = 3 / this.scale;
                this.ctx.beginPath();
                this.ctx.moveTo(body.pos.x, body.pos.y);
                const radius = body.pos.add(new Vec2(1, 0).rotate(body.rot).scale(body.radius))
                this.ctx.lineTo(radius.x, radius.y);
                this.ctx.stroke()
            }
        }
    }

    addClickCallback(clickCallback?: ((_: Vec2) => void)) {
        if (clickCallback) {
            document.addEventListener("click", (event: MouseEvent) => {
                const worldPos = this.clientToWorldPos(new Vec2(event.clientX, event.clientY))
                clickCallback(worldPos)
            });
        }
    }

    clientToWorldPos(clientPos: Vec2) {
        const {top, left} = this.canvas.getBoundingClientRect()
        return clientPos
            .sub(new Vec2(top, left))
            .scale(1 / this.scale)
            .sub(this.cameraPos);
    }

    worldToCanvasPosition(worldPos: Vec2) {
        return worldPos
            .add(this.cameraPos)
            .scale(this.scale)
    }
}