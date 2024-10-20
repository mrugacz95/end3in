import { Graphics } from '../src/Graphics';
import { Vec2 } from '../src/Vector';
import { expect, test } from '@jest/globals';

test('should calculate world pos from client pos', () => {
    const graphics = new Graphics({
        width: 100,
        height: 200,
        scale: 10,
        cameraPos: new Vec2(3, 6),
        engine: null
    });


    const canvasPos = graphics.worldToCanvasPosition(new Vec2(10, 10));

    expect(canvasPos.toArray()).toEqual(new Vec2(130, 160).toArray());
});


test('should calculate world pos from client pos', () => {
    const graphics = new Graphics({
        width: 100,
        height: 200,
        scale: 10,
        cameraPos: new Vec2(3, 6),
        engine: null
    });

    const canvasPos = graphics.clientToWorldPos(new Vec2(130, 160));

    expect(canvasPos.toArray()).toEqual(new Vec2(10, 10).toArray());
});