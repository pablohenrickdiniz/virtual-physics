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
		this.y = this.y / comprimento;
	};

	this.obterNorma = function() {
		if (this.norma == null) {
			this.norma = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		}
		return this.norma;
	};

	this.obterAngulo = function() {
		var x = Math.abs(this.x);
		var y = Math.abs(this.y);

		if (this.x < 0 && this.y > 0) {
			return converterParaGraus(Math.atan(x / y));
		} else if (this.x < 0 && this.y < 0) {
			return 90 + converterParaGraus(Math.atan(y / x));
		} else if (this.x > 0 && this.y < 0) {
			return 180 + converterParaGraus(Math.atan(x / y));
		} else if (this.x > 0 && this.y > 0) {
			return 270 + converterParaGraus(Math.atan(y / x));
		}
	};
}

function obterAnguloVetores(vetorA, vetorB) {
	var pe = obterProdutoEscalar(vetorA, vetorB);
	var na = vetorA.obterNorma();
	var nb = vetorB.obterNorma();
	return converterParaGraus(Math.acos(pe / (na * nb)));
}

function obterProdutoEscalar(vetorA, vetorB) {
	var vax = vetorA.getX();
	var vbx = vetorB.getX();
	var vay = vetorA.getY();
	var vby = vetorB.getY();
	return (vax * vbx) + (vay * vby);
}

function somaVetor(vetorA, vetorB) {
	var vax = vetorA.getX();
	var vbx = vetorB.getX();
	var vay = vetorA.getY();
	var vby = vetorB.getY();
	return new Vetor(vax + vbx, vay + vby);
}
