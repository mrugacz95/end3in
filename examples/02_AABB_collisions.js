var Engine = end3in.Engine,
    Rect = end3in.Rect,
    Collision = end3in.Collision,
    Vec2 = end3in.Vec2
var demo = document.getElementById('demo_element')
var engine = new Engine(demo),
    rect1 = new Rect(1.75, 1.5).position(new Vec2(2.5, 0.5)),
    rect2 = new Rect(2, 1).position(new Vec2(2.0, 2.0))

rect1.color = "#141ae6EE"
rect2.color = "#141ae6EE"

rect2.omega = Math.PI / 30

engine.addBodies(rect1, rect2);
engine.g = 0
engine.start();
document.onmousemove = function (event) {
    rect1.pos = new Vec2(event.clientX / engine.scale, event.clientY / engine.scale);
    if (Collision.areColliding(rect1, rect2)) {
        rect1.color = "#e62131EE";
    } else {
        rect1.color = "#141ae6EE";
    }
}