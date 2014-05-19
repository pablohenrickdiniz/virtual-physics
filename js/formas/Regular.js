FormaRegular.prototype = new Poligono();
function FormaRegular(centro, raio, pontas, espessura, angulo) {
	Poligono.call(this, centro, angulo);
	this.raio = isNaN(raio) || raio < 0 ? 10 : raio;
	this.pontas = isNaN(pontas) || pontas < 3 ? 3 : pontas;
	this.espessura = isNaN(espessura) || espessura < 1 ? 1 : espessura;

	this.getRaio = function() {
		return this.raio;
	};

	this.getPontas = function() {
		return this.pontas;
	};

	this.getEspessura = function() {
		return this.espessura;
	};

	this.setRaio = function(raio) {
		if (!isNaN(raio)) {
			this.raio = raio;
			this.atualizarPontos();
		}
	};

	this.setPontas = function(pontas) {
		if (!isNaN(pontas)) {
			pontas = parseInt(pontas);
			this.pontas = pontas;
			this.atualizarPontos();
		}
	};

	this.setEspessura = function(espessura) {
		if (!isNaN(espessura)) {
			this.espessura = espessura;
			this.atualizarPontos();
		}
	};

	this.setAngulo = function(angulo) {
		if (!isNaN(angulo)) {
			while (angulo > 360) {
				angulo = angulo % 360;
			}
			this.angulo = angulo;
			this.atualizarPontos();
		}
	};

	this.atualizarPontos = function() {
		var ga = (360 / this.pontas);
		var gb = (360 / this.pontas) / 2;
		var pontos = new Array();

		var pa = new Ponto(this.centro.getX(), this.centro.getY() - this.raio
				* this.espessura);
		var pb = new Ponto(this.centro.getX(), this.centro.getY() - this.raio);
		pa.setDono(this);
		pb.setDono(this);
		pa.girar(this.angulo);
		pb.girar(this.angulo + gb);

		pontos.push(pa);
		pontos.push(pb);

		for (var i = 1; i < this.pontas; i++) {
			pa = new Ponto(pa.getX(), pa.getY());
			pb = new Ponto(pb.getX(), pb.getY());
			pa.setDono(this);
			pb.setDono(this);
			pa.girar(ga);
			pb.girar(ga);
			pontos.push(pa);
			pontos.push(pb);
		}

		this.setPontos(pontos);
	};

	this.getQuadradoCircunscrito = function() {
		return new Retangulo(this.centro, this.raio * 2, this.raio * 2);
	};

	this.getArea = function() {
		return this.espessura * this.raio;
	};
	this.atualizarPontos();
}
