Retangulo.prototype = new Poligono();
function Retangulo(centro, largura, altura) {
	Poligono.call(this, centro);
	this.largura = isNaN(largura) || largura <= 0 ? 10: largura;
	this.altura =  isNaN(altura) || altura <= 0 ? 10: altura;

	this.getLargura = function() {
		return this.largura;
	};

	this.getAltura = function() {
		return this.altura;
	};

	this.setLargura = function(largura) {
		if (!isNaN(largura) && largura != this.largura && largura > 0) {
			this.largura = largura;
			this.atualizarPontos();
		}

	};

	this.setAltura = function(altura) {
		if (!isNaN(altura) && altura != this.altura && largura > 0) {
			this.altura = altura;
			this.atualizarPontos();
		}
	};

	this.atualizarPontos = function() {
		var pontos = new Array();
		var x = this.centro.getX();
		var y = this.centro.getY();
		var pa = new Ponto(x - (this.largura * 0.5), y - (this.altura * 0.5));
		var pb = new Ponto(x + (this.largura * 0.5), y - (this.altura * 0.5));
		var pc = new Ponto(x + (this.largura * 0.5), y + (this.altura * 0.5));
		var pd = new Ponto(x - (this.largura * 0.5), y + (this.altura * 0.5));
		pontos.push(pa);
		pontos.push(pb);
		pontos.push(pc);
		pontos.push(pd);
		this.setPontos(pontos);
	};

	this.getArea = function() {
		return this.largura * this.altura;
	};

	this.atualizarPontos();
}
