import { Solver } from '../src/Solver';
import {expect, test} from '@jest/globals';

function expectToBeCloseToArray(actual: number[], expected: number[]) {
    expect(actual.length).toBe(expected.length);
    actual.forEach((x, i) =>
        expect(x).toBeCloseTo(expected[i])
    );
};

test('checks solver correctness', () => {
    const mat = [[16, 3], [7, -11]];
    const b = [11, 13];
    const x = Solver.solve(mat, b, 6);

    expectToBeCloseToArray(x, [0.8122, -0.6650]);
});

test('checks solver correctness on bigger example', () => {
    const mat = [[4, -1, -1], [-2, 6, 1], [-1, 1, 7]];
    const b = [3, 9, -6];
    const x = Solver.solve(mat, b, 6);

    expectToBeCloseToArray(x, [1, 2, -1]);
});

