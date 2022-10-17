const  { Solver } = require('../src/Solver')

function expectToBeCloseToArray(actual, expected) {
    expect(actual.length).toBe(expected.length)
    actual.forEach((x, i) =>
        expect(x).toBeCloseTo(expected[i])
    )
}

test('checks solver correctness', () => {
    let mat = [[16, 3], [7, -11]];
    let b = [11, 13];
    let x = Solver.solve(mat, b, 6);

    expectToBeCloseToArray(x, [0.8122, -0.6650]);
});

test('checks solver correctness on bigger example', () => {
    let mat = [[4, -1, -1], [-2, 6, 1], [-1, 1, 7]];
    let b = [3, 9, -6];
    let x = Solver.solve(mat, b, 6);

    expectToBeCloseToArray(x, [1, 2, -1]);
});

