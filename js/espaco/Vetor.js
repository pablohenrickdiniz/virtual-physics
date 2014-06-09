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

	this.obterAngulo = function() {
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

Vetor.obterAnguloVetores = function(vetorA, vetorB){
	var pe = obterProdutoEscalar(vetorA, vetorB);
	var na = vetorA.obterNorma();
	var nb = vetorB.obterNorma();
	return converterParaGraus(Math.acos(pe / (na * nb)));
};

Vetor.obterProdutoEscalar = function(vetorA, vetorB){
	var vax = vetorA.getX();
	var vbx = vetorB.getX();
	var vay = vetorA.getY();
	var vby = vetorB.getY();
	return (vax * vbx) + (vay * vby);
};

Vetor.multiplicar = function(vetor, escalar){
	vetor.setX(vetor.getX()*escalar);
	vetor.setY(vetor.getY()*escalar);
};

Vetor.somar = function(vetorA, vetorB){
	var vax = vetorA.getX();
	var vbx = vetorB.getX();
	var vay = vetorA.getY();
	var vby = vetorB.getY();
	return new Vetor(vax + vbx, vay + vby);
};

Vetor.somarComprimento = function(vetor, comprimento){
	var vx = vetor.getX();
	var vy = vetor.getY();
	var total = vx+vy;
	var cx = comprimento*(((vx*100)/total)/100);
	var cy = comprimento*(((vy*100)/total)/100);
	vetor.setX(vx+cx);
	vetor.setY(vy+cy);
};


