const {Collision} = require("../src/Collision");
const {Rectangle} = require("../src/Body");

test('checks AABB collision detection when not colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, -1, 0)
    const b2 = new Rectangle(1, 1, 1, 0)

    const result = Collision.areColliding(b1, b2)

    expect(result).toBe(false)
})

test('checks AABB collision detection when colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, -0.25, 0.25)
    const b2 = new Rectangle(1, 1, 0.25, -0.25)

    const result = Collision.areColliding(b1, b2)

    expect(result).not.toBe(false)
})

test('checks AABB collision detection when rotated and colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, -0.5, 0.5, 1, false, Math.PI / 4)
    const b2 = new Rectangle(1, 1, 0.5, -0.5, 1, false, Math.PI / 4)

    const result = Collision.areColliding(b1, b2)

    expect(result).not.toBe(false)
})

test('checks SAT collision detection when not colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, -1, 0)
    const b2 = new Rectangle(1, 1, 1, 0)

    const result = Collision.calculateSAT(b1, b2)

    expect(result).toBe(false)
})

test('checks SAT collision detection when colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, -0.25, 0.25)
    const b2 = new Rectangle(1, 1, 0.25, -0.25)

    const result = Collision.calculateSAT(b1, b2)

    expect(result).not.toBe(false)
})

test('checks SAT collision detection when rotated and not colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, -0.5, 0.5, 1, false, Math.PI / 4)
    const b2 = new Rectangle(1, 1, 0.5, -0.5, 1, false, Math.PI / 4)

    const result = Collision.calculateSAT(b1, b2)

    expect(result).toBe(false)
})

test('checks SAT mtv when colliding', () => {
    // given
    const b1 = new Rectangle(1, 1, 0, 0,)
    const b2Size = 3 * Math.sqrt(2) / 4
    const b2 = new Rectangle(b2Size, b2Size, 0, 1, 1, false, Math.PI / 4)

    const result = Collision.calculateSAT(b1, b2)

    expect(result.length).toBe(0.25)
    expect(result.normal.toArray()).toEqual([-0, 1])
})