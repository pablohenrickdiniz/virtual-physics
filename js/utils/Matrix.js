function Matrix(rows, cols){
	this.rows  = isNaN(rows)?3:parseInt(rows);
	this.cols = isNaN(cols)?3:parseInt(cols);
	this.determinant = null;
	this.cofactor     = null;
	this.transpose   = null;
	this.adjunct      = null;
	this.inverse      = null;
	this.mat = [];
	
	for(var i = 0; i < this.rows;i++){
		this.mat[i] = [];
		for(var j = 0; j < this.cols;j++){
			this.mat[i][j] = 0;
		}
	}
	
	this.getValue = function(row, col){
		if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
			return this.mat[row][col];
		}
		else{
			throw new TypeError('Indice de matriz inválido:['+row+']['+col+']');;
		}
	};
	
	this.setValue = function(row, col, value){
		if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
			if(!isNaN(value)){
				this.mat[row][col] = value;
				this.determinant = null;
			}
			else{
				throw new TypeError("O valor passado como parâmetro deve ser um numero");
			}
		}
		else{
			throw new TypeError('Indice de matriz inválido:['+row+']['+col+']');;
		}
	};
	
	this.setRow = function(row, values){
		if(row >= 0 && row < this.rows){
			if(values instanceof Array && values.length == this.cols){
				this.mat[row] = values;
				this.determinant = null;
			}
			else{
				throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
			}
		}
		else{
			throw new TypeError("Indice de linha invalido["+row+"]");
		}
	};
	
	this.setCol = function(col, values){
		if(col >= 0 && col < this.cols){
			if(values instanceof Array && values.length == this.rows){
				for(var i = 0; i < this.mat.length;i++){
					this.mat[i][col] = values[i];
				}
				this.determinant = null;
			}
			else{
				throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
			}
		}
		else{
			throw new TypeError("Indice de coluna invalido[i]["+col+"]");
		}
	};
	
	this.getRow = function(row){
		if(row >= 0 && row <= this.rows){
			return this.mat[row];
		}
	};
	
	this.getCol = function(col){
		if(col >= 0 && col <= this.cols){
			var aux = [];
			for(var i = 0; i < this.mat.length;i++){
				aux[i] = this.mat[i][col];
			}
			return aux;
		}
	};
	
	this.obterCofator = function(row, col){
		if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
			return Math.pow(-1,row+col)*this.obterSubMatriz(row,col).determinant()
		}
		else{
			throw new TypeError("Indice inexistente["+row+"]["+col+"]");
		}
	};
	
	this.obterSubMatriz = function(row, col){
		if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
			var subOrdem = this.rows-1;
			var subMat = new Matrix(subOrdem, subOrdem);
			var subi = 0;
			var subj = 0;
			for(var i = 0; i < this.mat.length;i++){
				if(i != row){
					for(var j = 0; j < this.mat[i].length;j++){
						if(j != col){
							subMat.setValue(subi, subj, this.mat[i][j]);
							subj++;
							if(subj == subOrdem){
								subj=0;
								subi++;
							}
						}
					}
				}
			}
			return subMat;
		}
		else{
			throw new TypeError("Indice inexistente["+row+"]["+col+"]");
		}
	};
	
	this.cofactor = function(){
		if(this.cofactor == null){
			this.cofactor = new Matrix(this.rows, this.cols);
			for(var i = 0; i < this.rows;i++){
				for(var j = 0; j < this.cols;j++){
					this.cofactor.setValue(i,j,this.obterCofator(i,j));
				}
			}
		}
		return this.cofactor;
	};
	
	this.transpose = function(){
		if(this.transpose == null){
			this.transpose = new Matrix(this.cols, this.rows);
			for(var i = 0; i < this.mat.length;i++){
				var linha = this.getRow(i);
				this.transpose.setCol(i,linha);
			}
		}
		return this.transpose;
	};
	
	this.adjunct = function(){
		if(this.adjunct == null){
			this.adjunct = this.cofactor().transpose();
		}
		return this.adjunct;
	};
	
	
	this.inverse = function(){
		if(this.inverse == null){
			if(this.determinant() != 0){
				this.inverse = multiplicarPorEscalar(this.adjunct(),1/this.determinant());
			}
			else{
				console.log("A matriz não possui matriz inversa");
			}
		}
		return this.inverse;
	};
	
	this.determinant = function(){
		if(this.determinant == null){
			if(this.rows == this.cols){
				if(this.rows == 1){
					this.determinant = this.getValue(0,0);
				}
				else if(this.rows <= 3){
					this.determinant = this.determinantBySarrus();
				}
				else{
					this.determinant = this.determinantByLaplace();
				}
			}
			else{
				throw new TypeError("Não é possivel calcular a determinate porque a matriz nao e quadrada:"+this.rows+","+this.cols);
			}
		}
		return this.determinant;
	};
	
	this.determinantByLaplace = function(){
		var i = parseInt(Math.floor(Math.random()*this.rows));
		var det = 0;
		for(var j = 0; j < this.mat[i].length;j++){
			det += this.mat[i][j]*this.obterCofator(i,j);
		}
		return det;
	};
	
	this.determinantBySarrus = function(){
		var sum = 0;
		if(this.cols == 2){
			sum = this.getValue(0,0)*this.getValue(1,1)-this.getValue(0,1)*this.getValue(1,0);
		}
		else{
			for(var j = 0; j < 3;j++){
				var da = 0;
				var aux = 1;
				for(var jAux = j,i = 0, count=0; count < 3;jAux++,i++,count++){
					jAux = jAux>=this.cols?0:jAux;
					i    = i>=this.rows?0:i;
					aux*=this.getValue(i,jAux);
				}
				
				da = aux;
				aux = 1;
				
				for(jAux = j, i = 0, count = 0; count < 3;jAux--,i++,count++){
					jAux = jAux<0?this.cols-1:jAux;
					i    = i>=this.rows?0:i;
					aux*=this.getValue(i,jAux);
				}
				
				sum += (da-aux);
			}
		}
		return sum;
	};

	this.load = function(matrix){
		for(i in matrix){
			for(j in matrix[i]){
				this.setValue(i, j, matrix[i][j]);
			}
		}
	};
	
	this.toString = function(){
		var str = "";
		for(var i = 0; i < this.mat.length;i++){
			str +="\n";
			for(var j = 0; j < this.mat[i].length;j++){
				str += "["+this.getValue(i,j)+"]";
			}
			
		}
		return str;
	};
}

Matrix.sum = function(matrixA, matrixB){
	if(matrixA instanceof Matrix && matrixB instanceof Matrix){
		if(matrixA.rows == matrixB.rows && matrixA.cols == matrixB.cols){
			var mal = matrixA.rows;
			var mbc = matrixB.cols;
			var mat = new Matrix(mal, mbc);
			for(var i = 0; i < mal;i++){
				for(var j = 0; j < mbc;j++){
					mat.setValue(i,j,matrixA.getValue(i,j)+matrixB.getValue(i,j));
				}
			}
			return mat;
		}
	}
};

Matrix.subtrair = function(matrixA, matrixB){
	if(matrixA instanceof Matrix && matrixB instanceof Matrix){
		if(matrixA.rows == matrixB.cols && matrixA.rows == matrixB.cols){
			var mal = matrixA.rows;
			var mbc = matrixB.cols;
			var mat = new Matrix(mal, mbc);
			for(var i = 0; i < mal;i++){
				for(var j = 0; j < mbc;j++){
					mat.setValue(i,j,matrixA.getValue(i,j)-matrixB.getValue(i,j));
				}
			}
			return mat;
		}
	}
};

Matrix.scale = function(matrix, scalar){
	if(matrix instanceof Matrix && !isNaN(scalar)){
		var mat = new Matrix(matrix.rows, matrix.cols);
		for(var i = 0; i < matrix.rows;i++){
			for(var j = 0; j < matrix.cols;j++){
				mat.setValue(i,j, matrix.getValue(i,j)*scalar);
			}
		}
		return mat;
	}
};

Matrix.multiplicarMatrizes = function(matrixA, matrixB){
	if(matrixA instanceof Matrix && matrixB instanceof Matrix){
		if(matrixA.cols == matrixB.rows){
			var mat = new Matrix(matrixA.rows, matrixB.cols);
			for(var i = 0; i < matrixA.rows;i++){
				for(var j = 0; j < matrixB.cols;j++){
					var linha  = matrixA.getRow(i);
					var coluna = matrixB.getCol(j);
					var soma = 0;
					for(var k =0; k < linha.length;k++){
						soma+= linha[k]*coluna[k];
					}
					mat.setValue(i,j, soma);
				}
			}
			return mat;
		}
	}
};