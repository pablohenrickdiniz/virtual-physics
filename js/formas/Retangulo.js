Retangulo.prototype = new Poligono();
function Retangulo(centro, largura, altura) {
	console.log("criando retângulo");
	Poligono.call(this, centro);
	this.largura = largura == undefined || isNaN(largura) || largura < 1 ? 10
			: largura;
	this.altura = altura == undefined || isNaN(altura) || altura < 1 ? 10
			: altura;

	this.getLargura = function() {
		console.log("pegando largura do retângulo");
		return this.largura;
	};

	this.getAltura = function() {
		console.log("pegando altura do retângulo");
		return this.altura;
	};

	this.setLargura = function(largura) {
		console.log("setando largura do retângulo");
		if (!isNaN(largura)) {
			this.largura = largura;
			this.atualizarPontos();
		}

	};

	this.setAltura = function(altura) {
		console.log("setando altura do retângulo");
		if (!isNaN(altura)) {
			this.altura = altura;
			this.atualizarPontos();
		}
	};

	this.atualizarPontos = function() {
		console.log("atualizando pontos do retângulo");
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
		console.log("pegando área  do retângulo");
		return this.largura * this.altura;
	};

	this.atualizarPontos();
}
