var demo = document.getElementById('demo_element')
var engine = new end3in.Engine(demo)

var Body = end3in.Body,
    Vec2 = end3in.Vec2,
    Polygon = end3in.Polygon
Rect = end3in.Rect

let b1 = new Body(0.0002, 1).position(new Vec2(2.0, 2.0))
b1.v = new Vec2(0.03, 0.1)
b1.omega = Math.PI

let b2 = new Body(0.0002, 1).position(new Vec2(1.0, 2.0))
b2.v = new Vec2(0.0, 0.00)
b2.omega = Math.PI / 4

let p1 = new Polygon([new Vec2(-0.3, -0.25), new Vec2(0.3, -0.25), new Vec2(0, 0.3)]).position(new Vec2(1.4, 3.0))
p1.omega = Math.PI / 30

let r1 = new Rect(0.5, 0.5).position(new Vec2(3, 2.0))
r1.omega = Math.PI / 8

// engine.g = 0
let bodies = [b1, b2, p1, r1];
engine.addBodies(...bodies)
engine.start()

function printMousePos(event) {
    let rect = event.target.getBoundingClientRect()
    let offset = new Vec2(window.scrollX + rect.left, window.scrollY + rect.top)
    let click = new Vec2(event.clientX, event.clientY).sub(offset).scale(1 / engine.scale);
    for (let body of bodies) {
        let force1 = body.pos.sub(click).normalize().scale(0.002);
        body.applyForce(force1, click, 1);
    }
}

demo.addEventListener("click", printMousePos);