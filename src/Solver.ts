export class Solver {
    static solve(mat: number[][], b: number[], iterations: number) : number[] {
        // Ax = b
        const x = [];
        for (let i = 0; i < mat.length; i++) {
            x.push(0);
        }
        for (let iter = 0; iter < iterations; iter++) {
            for (let i = 0; i < mat.length; i++) {
                let sum = b[i];
                for (let j = 0; j < mat[i].length; j++) {
                    if (j !== i) {
                        sum -= x[j] * mat[i][j];
                    }
                }
                x[i] = sum / mat[i][i];
            }
        }
        return x;
    }
}