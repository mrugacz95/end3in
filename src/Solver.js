export class Solver {
    solve(mat, b, iterations) {
        // Ax = b
        let x = [];
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
    };

    getUpper(mat) {
        let upper = [];
        let lower = [];
        for (let row = 0; row < mat.length; row++) {
            let newLowerRow = [];
            let newUpperRow = [];
            for (let col = 0; col < max[row].length; col++) {
                if (row >= col) {
                    newUpperRow.push(mat[row][col]);
                    newLowerRow.push(0)
                } else {
                    newUpperRow.push(0);
                    newLowerRow.push(mat[row][col]);
                }
            }
            upper.push(newUpperRow);
            lower.push(newLowerRow);
        }
        return {'lower': lower, 'upper': upper};
    }
}