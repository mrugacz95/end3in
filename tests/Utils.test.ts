import { Utils } from "../src/Utlis";
import { Vec2 } from "../src/Vector";
import {expect, test} from '@jest/globals';

test('should return first end of segment', () => {
    const segA = new Vec2(0, 0);
    const segB = new Vec2(0, 1);
    const p = new Vec2(0, -1);

    const closest = Utils.closestPointOnSegment(p, segA, segB);

    expect(closest.toArray()).toEqual(segA.toArray());
});

test('should return second end of segment', () => {
    const segA = new Vec2(0, 0);
    const segB = new Vec2(0, 1);
    const p = new Vec2(0, 10);

    const closest = Utils.closestPointOnSegment(p, segA, segB);

    expect(closest.toArray()).toEqual(segB.toArray());
});

test('should return middle of segment', () => {
    const segA = new Vec2(0, 0);
    const segB = new Vec2(0, 1);
    const p = new Vec2(10, 0.5);

    const closest = Utils.closestPointOnSegment(p, segA, segB);

    expect(closest.toArray()).toEqual(new Vec2(0, 0.5).toArray());
});