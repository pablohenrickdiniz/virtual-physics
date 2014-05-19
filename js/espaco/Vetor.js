/**
 * Created by Aluno on 30/04/14.
 */
function Vetor(x, y) {
	console.log("criando vetor...");
	this.x = x;
	this.y = y;
	this.norma = null;

	this.getX = function() {
		console.log("pegando x do vetor");
		return this.x;
	};

	this.getY = function() {
		console.log("pegando y do vetor");
		return this.y;
	};

	this.setX = function(x) {
		console.log("mudando x do vetor");
		if (!isNaN(x)) {
			this.x = x;
			this.norma = null;
		}
	};

	this.setY = function(y) {
		console.log("mudando y do vetor");
		if (!isNaN(y)) {
			this.y = y;
			this.norma = null;
		}
	};

	this.normalizar = function() {
		console.log("normalizando vetor");
		var comprimento = this.obterNorma();
		this.x = this.x / comprimento;
		this.y = his.y / comprimento;
	};

	this.obterNorma = function() {
		console.log("obtendo norma do vetor");
		if (isNaN(this.norma)) {
			this.norma = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		}
		return this.norma;
	};
}

function obterAnguloVetores(vetorA, vetorB) {
	console.log("obtendo angulo entre vetores");
	return converterParaGraus(Math.acos(obterProdutoEscalar(vetorA, vetorB)
			/ vetorA.obterNorma() * vetorB.obterNorma()));
}

function obterProdutoEscalar(vetorA, vetorB) {
	console.log("obtendo produto escalar entre vetores");
	return vetorA.getX() * vetorB.getX() + vetorA.getY() * vetorB.getY();
}

function somaVetor(vetorA, vetorB) {
	console.log("somando vetores");
	return new Vetor(vetorA.getX() + vetorB.getX(), vetorA.getY()
			+ vetorB.getY());
}
