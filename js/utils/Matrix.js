function Matrix(rows, cols) {
    var self = this;
    self.rows = isNaN(rows) ? 3 : parseInt(rows);
    self.cols = isNaN(cols) ? 3 : parseInt(cols);
    self.determinant = null;
    self.cofactor = null;
    self.transpose = null;
    self.adjunct = null;
    self.inverse = null;
    self.mat = [];

    for (var i = 0; i < self.rows; i++) {
        self.mat[i] = [];
        for (var j = 0; j < self.cols; j++) {
            self.mat[i][j] = 0;
        }
    }

    self.getValue = function (row, col) {
        var self = this;
        if (row >= 0 && row < self.rows && col >= 0 && col < self.cols) {
            return self.mat[row][col];
        }
        else {
            throw new TypeError('Indice de matriz inválido:[' + row + '][' + col + ']');
        }
    };

    self.setValue = function (row, col, value) {
        var self = this;
        if (row >= 0 && row < self.rows && col >= 0 && col < self.cols) {
            if (!isNaN(value)) {
                self.mat[row][col] = value;
                self.determinant = null;
            }
            else {
                throw new TypeError("O valor passado como parâmetro deve ser um numero");
            }
        }
        else {
            throw new TypeError('Indice de matriz inválido:[' + row + '][' + col + ']');
        }
    };

    self.setRow = function (row, values) {
        var self = this;
        if (row >= 0 && row < self.rows) {
            if (values instanceof Array && values.length == self.cols) {
                self.mat[row] = values;
                self.determinant = null;
            }
            else {
                throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
            }
        }
        else {
            throw new TypeError("Indice de linha invalido[" + row + "]");
        }
    };

    self.setCol = function (col, values) {
        var self = this;
        if (col >= 0 && col < self.cols) {
            if (values instanceof Array && values.length == self.rows) {
                for (var i = 0; i < self.mat.length; i++) {
                    self.mat[i][col] = values[i];
                }
                self.determinant = null;
            }
            else {
                throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
            }
        }
        else {
            throw new TypeError("Indice de coluna invalido[i][" + col + "]");
        }
    };

    self.getRow = function (row) {
        var self = this;
        if (row >= 0 && row <= self.rows) {
            return self.mat[row];
        }
        return null;
    };

    self.getCol = function (col) {
        var self = this;
        if (col >= 0 && col <= self.cols) {
            var aux = [];
            for (var i = 0; i < self.mat.length; i++) {
                aux[i] = self.mat[i][col];
            }
            return aux;
        }
        return null;
    };

    self.obterCofator = function (row, col) {
        var self = this;
        if (row >= 0 && row < self.rows && col >= 0 && col < self.cols) {
            return Math.pow(-1, row + col) * self.obterSubMatriz(row, col).determinant()
        }
        else {
            throw new TypeError("Indice inexistente[" + row + "][" + col + "]");
        }
    };

    self.obterSubMatriz = function (row, col) {
        var self = this;
        if (row >= 0 && row < self.rows && col >= 0 && col < self.cols) {
            var subOrdem = self.rows - 1;
            var subMat = new Matrix(subOrdem, subOrdem);
            var subi = 0;
            var subj = 0;
            for (var i = 0; i < self.mat.length; i++) {
                if (i != row) {
                    for (var j = 0; j < self.mat[i].length; j++) {
                        if (j != col) {
                            subMat.setValue(subi, subj, self.mat[i][j]);
                            subj++;
                            if (subj == subOrdem) {
                                subj = 0;
                                subi++;
                            }
                        }
                    }
                }
            }
            return subMat;
        }
        else {
            throw new TypeError("Indice inexistente[" + row + "][" + col + "]");
        }
    };

    self.cofactor = function () {
        var self = this;
        if (self.cofactor == null) {
            self.cofactor = new Matrix(self.rows, self.cols);
            for (var i = 0; i < self.rows; i++) {
                for (var j = 0; j < self.cols; j++) {
                    self.cofactor.setValue(i, j, self.obterCofator(i, j));
                }
            }
        }
        return self.cofactor;
    };

    self.transpose = function () {
        var self = this;
        if (self.transpose == null) {
            self.transpose = new Matrix(self.cols, self.rows);
            for (var i = 0; i < self.mat.length; i++) {
                var linha = self.getRow(i);
                self.transpose.setCol(i, linha);
            }
        }
        return self.transpose;
    };

    self.adjunct = function () {
        var self = this;
        if (self.adjunct == null) {
            self.adjunct = self.cofactor().transpose();
        }
        return self.adjunct;
    };


    self.inverse = function () {
        var self = this;
        if (self.inverse == null) {
            if (self.determinant() != 0) {
                self.inverse = Matrix.scale(self.adjunct(), 1 / self.determinant());
            }
            else {
                console.log("A matriz não possui matriz inversa");
            }
        }
        return self.inverse;
    };

    self.determinant = function () {
        var self = this;
        if (self.determinant == null) {
            if (self.rows == self.cols) {
                if (self.rows == 1) {
                    self.determinant = self.getValue(0, 0);
                }
                else if (self.rows <= 3) {
                    self.determinant = self.determinantBySarrus();
                }
                else {
                    self.determinant = self.determinantByLaplace();
                }
            }
            else {
                throw new TypeError("Não é possivel calcular a determinate porque a matriz nao e quadrada:" + self.rows + "," + self.cols);
            }
        }
        return self.determinant;
    };

    self.determinantByLaplace = function () {
        var self = this;
        var i = parseInt(Math.floor(Math.random() * self.rows));
        var det = 0;
        for (var j = 0; j < self.mat[i].length; j++) {
            det += self.mat[i][j] * self.obterCofator(i, j);
        }
        return det;
    };

    self.determinantBySarrus = function () {
        var self = this;
        var sum = 0;
        if (self.cols == 2) {
            sum = self.getValue(0, 0) * self.getValue(1, 1) - self.getValue(0, 1) * self.getValue(1, 0);
        }
        else {
            for (var j = 0; j < 3; j++) {
                var da = 0;
                var aux = 1;
                for (var jAux = j, i = 0, count = 0; count < 3; jAux++, i++, count++) {
                    jAux = jAux >= self.cols ? 0 : jAux;
                    i = i >= self.rows ? 0 : i;
                    aux *= self.getValue(i, jAux);
                }

                da = aux;
                aux = 1;

                for (jAux = j, i = 0, count = 0; count < 3; jAux--, i++, count++) {
                    jAux = jAux < 0 ? self.cols - 1 : jAux;
                    i = i >= self.rows ? 0 : i;
                    aux *= self.getValue(i, jAux);
                }

                sum += (da - aux);
            }
        }
        return sum;
    };

    self.load = function (matrix) {
        var self = this;
        for (i in matrix) {
            for (j in matrix[i]) {
                self.setValue(i, j, matrix[i][j]);
            }
        }
    };

    self.toString = function () {
        var self = this;
        var str = "";
        for (var i = 0; i < self.mat.length; i++) {
            str += "\n";
            for (var j = 0; j < self.mat[i].length; j++) {
                str += "[" + self.getValue(i, j) + "]";
            }

        }
        return str;
    };
}

Matrix.sum = function (matrixA, matrixB) {
    if (matrixA instanceof Matrix && matrixB instanceof Matrix) {
        if (matrixA.rows == matrixB.rows && matrixA.cols == matrixB.cols) {
            var mal = matrixA.rows;
            var mbc = matrixB.cols;
            var mat = new Matrix(mal, mbc);
            var i;
            var j;
            for (i = 0; i < mal; i++) {
                for (j = 0; j < mbc; j++) {
                    mat.setValue(i, j, matrixA.getValue(i, j) + matrixB.getValue(i, j));
                }
            }
            return mat;
        }
    }
    return null;
};

Matrix.subtrair = function (matrixA, matrixB) {
    if (matrixA instanceof Matrix && matrixB instanceof Matrix) {
        if (matrixA.rows == matrixB.cols && matrixA.rows == matrixB.cols) {
            var mal = matrixA.rows;
            var mbc = matrixB.cols;
            var mat = new Matrix(mal, mbc);
            var i;
            var j;
            for (i = 0; i < mal; i++) {
                for (j = 0; j < mbc; j++) {
                    mat.setValue(i, j, matrixA.getValue(i, j) - matrixB.getValue(i, j));
                }
            }
            return mat;
        }
    }
    return null;
};

Matrix.scale = function (matrix, scalar) {
    if (matrix instanceof Matrix && !isNaN(scalar)) {
        var mat = new Matrix(matrix.rows, matrix.cols);
        var i;
        var j;
        for (i = 0; i < matrix.rows; i++) {
            for (j = 0; j < matrix.cols; j++) {
                mat.setValue(i, j, matrix.getValue(i, j) * scalar);
            }
        }
        return mat;
    }
    return null;
};

Matrix.multiplicarMatrizes = function (matrixA, matrixB) {
    if (matrixA instanceof Matrix && matrixB instanceof Matrix) {
        if (matrixA.cols == matrixB.rows) {
            var mat = new Matrix(matrixA.rows, matrixB.cols);
            var i;
            var j;
            var linha;
            var coluna;
            var soma = 0;
            var k;
            for (i = 0; i < matrixA.rows; i++) {
                for(j = 0; j < matrixB.cols; j++) {
                    linha = matrixA.getRow(i);
                    coluna = matrixB.getCol(j);
                    soma = 0;
                    for (k = 0; k < linha.length; k++) {
                        soma += linha[k] * coluna[k];
                    }
                    mat.setValue(i, j, soma);
                }
            }
            return mat;
        }
    }
    return null;
};