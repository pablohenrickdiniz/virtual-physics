/**
 * Created by Aluno on 30/04/14.
 */
function Vetor(x, y) {
	this.x = x;
	this.y = y;
	this.angulo = null;
	this.norma  = null;
	this.cor    = new Color(0,0,0);
	
	
	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.setX = function(x) {
		if (!isNaN(x)) {
			this.x = x;
			this.norma  = null;
			this.angulo = null;
		}
	};

	this.setY = function(y) {
		if (!isNaN(y)) {
			this.y = y;
			this.norma  = null;
			this.angulo = null;
		}
	};

	this.normalizar = function() {
		var comprimento = this.obterNorma();
		this.x = this.x / comprimento;
		this.y = this.y / comprimento;
	};

	this.obterNorma = function() {
		if (this.norma == null) {
			this.norma = obterHipotenusa(this.x, this.y);
		}
		return this.norma;
	};

	this.obterAnguloVetor = function() {
		if(this.angulo == null){
			this.angulo = obterAngulo(this.x, this.y);
		}
		return this.angulo;
	};

	this.inverterSentido = function() {
		this.x *= -1;
		this.y *= -1;
		this.angulo = null;
	};
	
	this.setCor = function(cor){
		this.cor = cor;
	};
	
	this.getCor = function(){
		return this.cor;
	};
	
	this.obterXProporcional = function(y){
		return (this.x/this.y)*y;
	};
	
	this.obterYProporcional = function(x){
		return (this.y/this.x)*x;
	};
}

function obterAngulo(x, y) {
	var xabs = Math.abs(x);
	var yabs = Math.abs(y);
	if (x < 0 && y > 0) {
		return converterParaGraus(Math.atan(xabs / yabs));
	} else if (x < 0 && y < 0) {
		return 90 + converterParaGraus(Math.atan(yabs / xabs));
	} else if (x > 0 && y < 0) {
		return 180 + converterParaGraus(Math.atan(xabs / yabs));
	} else if (x > 0 && y > 0) {
		return 270 + converterParaGraus(Math.atan(yabs / xabs));
	}
}

function obterHipotenusa(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
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

function multiplicarVetor(vetor, escalar){
	vetor.setX(vetor.getX()*escalar);
	vetor.setY(vetor.getY()*escalar);
}

function somaVetor(vetorA, vetorB) {
	var vax = vetorA.getX();
	var vbx = vetorB.getX();
	var vay = vetorA.getY();
	var vby = vetorB.getY();
	return new Vetor(vax + vbx, vay + vby);
}

function somaComprimento(vetor, comprimento){
	var vx = vetor.getX();
	var vy = vetor.getY();
	
	var total = vx+vy;
	var cx = comprimento*(((vx*100)/total)/100);
	var cy = comprimento*(((vy*100)/total)/100);
	vetor.setX(vx+cx);
	vetor.setY(vy+cy);
}
