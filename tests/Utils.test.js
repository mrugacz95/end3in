const {Utils} = require("../src/Utlis");
const {Vec2} = require("../src/Vector")

test('should return first end of segment', () => {
    let segA = new Vec2(0, 0)
    let segB = new Vec2(0, 1)
    let p = new Vec2(0, -1)

    let closest = Utils.closestPointOnSegment(p, segA, segB)

    expect(closest.toArray()).toEqual(segA.toArray())
})

test('should return second end of segment', () => {
    let segA = new Vec2(0, 0)
    let segB = new Vec2(0, 1)
    let p = new Vec2(0, 10)

    let closest = Utils.closestPointOnSegment(p, segA, segB)

    expect(closest.toArray()).toEqual(segB.toArray())
})

test('should return middle of segment', () => {
    let segA = new Vec2(0, 0)
    let segB = new Vec2(0, 1)
    let p = new Vec2(10, 0.5)

    let closest = Utils.closestPointOnSegment(p, segA, segB)

    expect(closest.toArray()).toEqual(new Vec2(0, 0.5).toArray())
})