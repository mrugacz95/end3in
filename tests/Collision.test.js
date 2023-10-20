const {Collision} = require("../src/Collision");
const {Rectangle, Circle} = require("../src/Body");
const {Vec2} = require("../src/Vector");

const TEST_MASS = 1

test('checks AABB collision detection when two rectangles not colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, TEST_MASS, true)
    b1.pos = new Vec2(-1, 0)
    const b2 = new Rectangle(1, 1, TEST_MASS, true)
    b1.pos = new Vec2(1, 0)

    const result = Collision.areAABBColliding(b1, b2)

    expect(result).toBe(false)
})

test('checks AABB collision detection when two rectangles colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, TEST_MASS, true)
    b1.pos = new Vec2(-0.25, 0.25)
    const b2 = new Rectangle(1, 1, TEST_MASS, true)
    b2.pos = new Vec2(0.25, -0.25)

    const result = Collision.areAABBColliding(b1, b2)

    expect(result).not.toBe(false)
})

test('checks AABB collision detection when two rectangles rotated and colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, TEST_MASS, true)
    b1.pos = new Vec2(-0.5, 0.5,)
    b1.rot = Math.PI / 4
    const b2 = new Rectangle(1, 1, TEST_MASS, true)
    b2.pos = new Vec2(0.5, -0.5,)
    b2.rot = Math.PI / 4

    const result = Collision.areAABBColliding(b1, b2)

    expect(result).not.toBe(false)
})

test('checks AABB collision detection when circle and rectangle not colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, TEST_MASS, true)
    b1.pos = new Vec2(-1, 0)
    const b2 = new Circle(1, 1, true)
    b2.pos = new Vec2(1, 0)

    const result = Collision.areAABBColliding(b1, b2)

    expect(result).toBe(false)
})

test('checks AABB collision detection when circle and rectangle colliding', () => {
    // given
    const b1 = new Circle(0.5)
    b1.pos = new Vec2(0, 0)
    const b2 = new Rectangle(1, 1, TEST_MASS, true)
    b2.pos = new Vec2(-1, 0)
    b2.rot = Math.PI / 4

    const result = Collision.areAABBColliding(b1, b2)

    expect(result).toBe(true)
})

test('checks AABB collision detection when two circles colliding', () => {
    // given
    const b1 = new Circle(0.5, 0, 0)
    const b2 = new Circle(0.5, 0.99, 0.99)

    const result = Collision.areAABBColliding(b1, b2)

    expect(result).toBe(true)
})

test('checks AABB collision detection when two circles not colliding', () => {
    // given
    const b1 = new Circle(0.5, 1, true)
    b1.pos = new Vec2(0, 0)
    const b2 = new Circle(0.5, 1, true)
    b2.pos = new Vec2(1.5, 0.25)

    const result = Collision.areAABBColliding(b1, b2)

    expect(result).toBe(false)
})

test('checks SAT collision detection when two rectangles not colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, 1, true)
    b1.pos = new Vec2(-1, 0)
    const b2 = new Rectangle(1, 1, 1, true)
    b2.pos = new Vec2(1, 0)

    const result = Collision.calculateSAT(b1, b2)

    expect(result).toBe(undefined)
})

test('checks SAT collision detection when two rectangles colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, TEST_MASS, true)
    b1.pos = new Vec2(-0.25, 0.25)
    const b2 = new Rectangle(1, 1, TEST_MASS, true)
    b2.pos = new Vec2(0.25, -0.25)

    const result = Collision.calculateSAT(b1, b2)

    expect(result).not.toBe(false)
})

test('checks SAT collision detection when two rectangles rotated and not colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, 1, false)
    b1.pos = new Vec2(-0.5, 0.5)
    b1.rot = Math.PI / 4
    const b2 = new Rectangle(1, 1, 1, false)
    b2.pos = new Vec2(0.5, -0.5,)
    b2.rot = Math.PI / 4

    const result = Collision.calculateSAT(b1, b2)

    expect(result).toBe(undefined)
})

test('checks SAT depth when colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, TEST_MASS, true)
    b1.pos = new Vec2(0, 0)
    const b2Size = 3 * Math.sqrt(2) / 4
    const b2 = new Rectangle(b2Size, b2Size, TEST_MASS, false)
    b2.pos = new Vec2(0, 1)
    b2.rot = Math.PI / 4

    const result = Collision.calculateSAT(b1, b2)

    expect(result.depth).toBe(0.25)
    expect(result.normal.toArray()).toEqual([-0, 1])
})

test('checks SAT collision detection when circle and rectangle not colliding', () => {
    // given
    const b1 = new Circle(0.5, TEST_MASS, true)
    b1.pos = new Vec2(0, 0)
    const b2 = new Rectangle(1, 1,  TEST_MASS, true )
    b2.pos = new Vec2(-1, 1)
    b2.rot = Math.PI / 4

    const result = Collision.calculateSAT(b1, b2)

    expect(result).toBe(undefined)
})

test('checks SAT collision detection when circle and rectangle colliding with corner', () => {
    // given
    const b1 = new Circle(0.5, TEST_MASS, true)
    b1.pos = new Vec2(0, 0)
    const overlap = 0.1
    const b2 = new Rectangle(1, 1, TEST_MASS, true)
    b2.pos = new Vec2( 0, -1 + overlap)

    const result = Collision.calculateSAT(b1, b2)

    expect(result.depth).toBeCloseTo(overlap)
    expect(result.normal.normalize().toArray()).toEqual(new Vec2(0, -1).normalize().toArray())
})

test('checks SAT collision detection when circle and rectangle colliding with edge', () => {
    // given
    const overlap = 0.1
    const b1 = new Circle(0.5, TEST_MASS, true)
    b1.pos = new Vec2(0, 0)
    const b2 = new Rectangle(1, 1, TEST_MASS, true)
    b2.pos = new Vec2(0.5, -1 + overlap)

    const result = Collision.calculateSAT(b1, b2)

    expect(result.depth).toBeCloseTo(overlap)
    expect(result.normal.normalize().toArray()).toEqual(new Vec2(0, -1).normalize().toArray())
})

test('checks SAT collision detection when two circles colliding', () => {
    // given
    const circlesRadius = 0.5
    const c1 = new Circle(circlesRadius)
    c1.pos = new Vec2(0, 0)
    const overlap = 0.1
    const circlesDist = circlesRadius * 2 - overlap

    const c2 = new Circle(circlesRadius, TEST_MASS, true)
    c2.pos = new Vec2(1, 1).normalize().scale(circlesDist)

    const result = Collision.calculateSAT(c1, c2)

    expect(result.depth).toBeCloseTo(overlap)
    expect(result.normal.normalize().toArray()).toEqual(new Vec2(1, 1).normalize().toArray())
})