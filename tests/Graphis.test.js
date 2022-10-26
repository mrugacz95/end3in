const {Graphics} = require('../src/Graphics')
const {Vec2} = require('../src/Vector')
const {JSDOM} = require("jsdom")

test('should calculate world pos from client pos', () => {

    const dom = new JSDOM()
    global.document = dom.window.document
    global.window = dom.window

    let graphics = new Graphics({
        width: 100, height: 200, scale: 10, cameraPos: new Vec2(3, 6)
    })


    let canvasPos = graphics.worldToCanvasPosition(new Vec2(10, 10))

    expect(canvasPos.toArray()).toEqual(new Vec2(130,160).toArray())
})


test('should calculate world pos from client pos', () => {

    const dom = new JSDOM()
    global.document = dom.window.document
    global.window = dom.window

    let graphics = new Graphics({
        width: 100, height: 200, scale: 10, cameraPos: new Vec2(3, 6)
    })


    let canvasPos = graphics.clientToWorldPos(new Vec2(130, 160))

    expect(canvasPos.toArray()).toEqual(new Vec2(10,10).toArray())
})