/**
 * Created by Aluno on 30/04/14.
 */
function Vetor(x, y) {
	this.x = x;
	this.y = y;
	this.norma = null;

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.setX = function(x) {
		if (!isNaN(x)) {
			this.x = x;
			this.norma = null;
		}
	};

	this.setY = function(y) {
		if (!isNaN(y)) {
			this.y = y;
			this.norma = null;
		}
	};

	this.normalizar = function() {
		var comprimento = this.obterNorma();
		this.x = this.x / comprimento;
		this.y = his.y / comprimento;
	};

	this.obterNorma = function() {
		if (isNaN(this.norma)) {
			this.norma = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		}
		return this.norma;
	};
}

function obterAnguloVetores(vetorA, vetorB) {
	return converterParaGraus(Math.acos(obterProdutoEscalar(vetorA, vetorB)
			/ vetorA.obterNorma() * vetorB.obterNorma()));
}

function obterProdutoEscalar(vetorA, vetorB) {
	return vetorA.getX() * vetorB.getX() + vetorA.getY() * vetorB.getY();
}

function somaVetor(vetorA, vetorB) {
	return new Vetor(vetorA.getX() + vetorB.getX(), vetorA.getY() + vetorB.getY());
}
