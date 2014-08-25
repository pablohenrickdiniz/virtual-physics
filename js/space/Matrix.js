function Matrix(linhas, colunas){
	this.linhas  = isNaN(linhas)?3:parseInt(linhas);
	this.colunas = isNaN(colunas)?3:parseInt(colunas);
	this.determinante = null;
	this.cofatora   = null;
	this.transposta  = null;
	this.cofatora     = null;
	this.inversa      = null;
	this.mat = new Array();

	for(var i = 0; i < this.linhas;i++){
		this.mat[i] = new Array();
		for(var j = 0; j < this.colunas;j++){
			this.mat[i][j] = 0;
		}
	}

	this.getValor = function(linha, coluna){
		if(linha >= 0 && linha < this.linhas && coluna >= 0 && coluna < this.colunas){
			return this.mat[linha][coluna];
		}
		else{
			throw new TypeError('Indice de matriz inválido:['+linha+']['+coluna+']');;
		}
	};

	this.setValor = function(linha, coluna, valor){
		if(linha >= 0 && linha < this.linhas && coluna >= 0 && coluna < this.colunas){
			if(!isNaN(valor)){
				this.mat[linha][coluna] = valor;
				this.determinante = null;
			}
			else{
				throw new TypeError("O valor passado como parâmetro deve ser um numero");
			}
		}
		else{
			throw new TypeError('Indice de matriz inválido:['+linha+']['+coluna+']');;
		}
	};

	this.setLinha = function(linha, values){
		if(linha >= 0 && linha < this.linhas){
			if(values instanceof Array && values.length == this.colunas){
				this.mat[linha] = values;
				this.determinante = null;
			}
			else{
				throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
			}
		}
		else{
			throw new TypeError("Indice de linha invalido["+linha+"]");
		}
	};

	this.setColuna = function(coluna, values){
		if(coluna >= 0 && coluna < this.colunas){
			if(values instanceof Array && values.length == this.linhas){
				for(var i = 0; i < this.mat.length;i++){
					this.mat[i][coluna] = values[i];
				}
				this.determinante = null;
			}
			else{
				throw new TypeError("A quantidade de colunas deve ser a mesma da matriz");
			}
		}
		else{
			throw new TypeError("Indice de coluna invalido[i]["+coluna+"]");
		}
	};

	this.getLinha = function(linha){
		if(linha >= 0 && linha <= this.linhas){
			return this.mat[linha];
		}
		else{
			throw new TypeError("Indice de linha inválido["+linha+"]");
		}
	};

	this.getColuna = function(coluna){
		if(coluna >= 0 && coluna <= this.colunas){
			var aux = new Array();
			for(var i = 0; i < this.mat.length;i++){
				aux[i] = this.mat[i][coluna];
			}
			return aux;
		}
		else{
			throw new TypeError("Indice de linha invalido["+linha+"]");
		}
	};

	this.obterCofator = function(linha, coluna){
		if(linha >= 0 && linha < this.linhas && coluna >= 0 && coluna < this.colunas){
			return Math.pow(-1,linha+coluna)*this.obterSubMatriz(linha,coluna).obterDeterminante()
		}
		else{
			throw new TypeError("Indice inexistente["+linha+"]["+coluna+"]");
		}
	};

	this.obterSubMatriz = function(linha, coluna){
		if(linha >= 0 && linha < this.linhas && coluna >= 0 && coluna < this.colunas){
			var subOrdem = this.linhas-1;
			var subMat = new Matriz(subOrdem, subOrdem);
			var subi = 0;
			var subj = 0;
			for(var i = 0; i < this.mat.length;i++){
				if(i != linha){
					for(var j = 0; j < this.mat[i].length;j++){
						if(j != coluna){
							subMat.setValor(subi, subj, this.mat[i][j]);
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
			throw new TypeError("Indice inexistente["+linha+"]["+coluna+"]");
		}
	};

	this.obterMatrizCofatora = function(){
		if(this.cofatora == null){
			this.cofatora = new Matriz(this.linhas, this.colunas);
			for(var i = 0; i < this.linhas;i++){
				for(var j = 0; j < this.colunas;j++){
					this.cofatora.setValor(i,j,this.obterCofator(i,j));
				}
			}
		}
		return this.cofatora;
	};

	this.obterMatrizTransposta = function(){
		if(this.transposta == null){
			this.transposta = new Matriz(this.colunas, this.linhas);
			for(var i = 0; i < this.mat.length;i++){
				var linha = this.getLinha(i);
				this.transposta.setColuna(i,linha);
			}
		}
		return this.transposta;
	};

	this.obterMatrizAdjunta = function(){
		if(this.adjunta == null){
			this.adjunta = this.obterMatrizCofatora().obterMatrizTransposta();
		}
		return this.adjunta;
	};


	this.obterMatrizInversa = function(){
		if(this.inversa == null){
			if(this.obterDeterminante() != 0){
				this.inversa = multiplicarPorEscalar(this.obterMatrizAdjunta(),1/this.obterDeterminante());
			}
			else{
				console.log("A matriz não possui matriz inversa");
			}
		}
		return this.inversa;
	};

	this.obterDeterminante = function(){
		if(this.determinante == null){
			if(this.linhas == this.colunas){
				if(this.linhas == 1){
					this.determinante = this.getValor(0,0);
				}
				else if(this.linhas <= 3){
					this.determinante = this.obterDeterminanteSarrus();
				}
				else{
					this.determinante = this.obterDeterminanteLaplace();
				}
			}
			else{
				throw new TypeError("Não é possivel calcular a determinate porque a matriz nao e quadrada:"+this.linhas+","+this.colunas);
			}
		}
		return this.determinante;
	};

	this.obterDeterminanteLaplace = function(){
		var i = parseInt(Math.floor(Math.random()*this.linhas));
		var det = 0;
		for(var j = 0; j < this.mat[i].length;j++){
			det += this.mat[i][j]*this.obterCofator(i,j);
		}
		return det;
	};

	this.obterDeterminanteSarrus = function(){
		var soma = 0;
		if(this.colunas == 2){
			soma = this.getValor(0,0)*this.getValor(1,1)-this.getValor(0,1)*this.getValor(1,0);
		}
		else{
			for(var j = 0; j < 3;j++){
				var da = 0;
				var aux = 1;
				for(jAux = j,i = 0, count=0; count < 3;jAux++,i++,count++){
					jAux = jAux>=this.colunas?0:jAux;
					i    = i>=this.linhas?0:i;
					aux*=this.getValor(i,jAux);
				}

				da = aux;
				aux = 1;

				for(jAux = j, i = 0, count = 0; count < 3;jAux--,i++,count++){
					jAux = jAux<0?this.colunas-1:jAux;
					i    = i>=this.linhas?0:i;
					aux*=this.getValor(i,jAux);
				}

				soma += (da-aux);
			}
		}
		return soma;
	};

	this.getLinhas = function(){
		return this.linhas;
	};

	this.getColunas = function(){
		return this.colunas;
	};

	this.load = function(matriz){
		for(i in matriz){
			for(j in matriz[i]){
				this.setValor(i, j, matriz[i][j]);
			}
		}
	};

	this.toString = function(){
		var str = "";
		for(var i = 0; i < this.mat.length;i++){
			str +="\n";
			for(var j = 0; j < this.mat[i].length;j++){
				str += "["+this.getValor(i,j)+"]";
			}

		}
		return str;
	};
}



Matriz.sum = function(matrizA, matrizB){
	if(matrizA instanceof Matriz && matrizB instanceof Matriz){
		if(matrizA.getLinhas() == matrizB.getLinhas() && matrizA.getColunas() == matrizB.getColunas()){
			var mal = matrizA.getLinhas();
			var mbc = matrizB.getColunas();
			var mat = new Matriz(mal, mbc);
			for(var i = 0; i < mal;i++){
				for(var j = 0; j < mbc;j++){
					mat.setValor(i,j,matrizA.getValor(i,j)+matrizB.getValor(i,j));
				}
			}
			return mat;
		}
		else{
			throw new TypeError("As matrizes a serem somadas devem ser de mesma ordem");
		}
	}
};

Matriz.subtrair = function(matrizA, matrizB){
	if(matrizA instanceof Matriz && matrizB instanceof Matriz){
		if(matrizA.getLinhas() == matrizB.getLinhas() && matrizA.getColunas() == matrizB.getColunas()){
			var mal = matrizA.getLinhas();
			var mbc = matrizB.getColunas();
			var mat = new Matriz(mal, mbc);
			for(var i = 0; i < mal;i++){
				for(var j = 0; j < mbc;j++){
					mat.setValor(i,j,matrizA.getValor(i,j)-matrizB.getValor(i,j));
				}
			}
			return mat;
		}
		else{
			throw new TypeError("As matrizes a serem subtraídas devem ser de mesma ordem");
		}
	}
};


Matriz.multiplicarPorEscalar = function(matriz, escalar){
	if(matriz instanceof Matriz && !isNaN(escalar)){
		var mat = new Matriz(matriz.getLinhas(), matriz.getColunas());
		for(var i = 0; i < matriz.getLinhas();i++){
			for(var j = 0; j < matriz.getColunas();j++){
				mat.setValor(i,j, matriz.getValor(i,j)*escalar);
			}
		}
		return mat;
	}
};

Matriz.multiplicarMatrizes = function(matrizA, matrizB){
	if(matrizA instanceof Matriz && matrizB instanceof Matriz){
		if(matrizA.getColunas() == matrizB.getLinhas()){
			var mat = new Matriz(matrizA.getLinhas(), matrizB.getColunas());
			for(var i = 0; i < matrizA.getLinhas();i++){
				for(var j = 0; j < matrizB.getColunas();j++){
					var linha  = matrizA.getLinha(i);
					var coluna = matrizB.getColuna(j);
					var soma = 0;
					for(var k =0; k < linha.length;k++){
						soma+= linha[k]*coluna[k];
					}
					mat.setValor(i,j, soma);
				}
			}
			return mat;
		}
		else{
			throw new TypeError("O numero de colunas da matriz A deve ser igual o numero de linhas da matriz B");
		}
	}
};