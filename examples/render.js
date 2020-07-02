console.log(end3in)
let engine = new end3in.Engine(document.getElementById('demo_element'))
engine.draw()

let v = new end3in.Vec2(1,0)
v = v.rotate(0.785398163)
console.log(v)