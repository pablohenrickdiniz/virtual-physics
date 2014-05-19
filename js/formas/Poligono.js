Poligono.prototype = new FormaGeometrica();

function Poligono(centro, angulo) {
	FormaGeometrica.call(this, centro, 'white', new Borda('black', 1), angulo);

	this.pontoMinimo = null;
	this.pontoMaximo = null;
	this.pontos = new Array();

	this.getPontos = function() {
		return this.pontos;
	};

	this.getPonto = function(index) {
		return this.pontos[index];
	};

	this.setPontos = function(pontos) {
		if (pontos instanceof Array) {
			this.pontoMinimo = null;
			this.pontoMaximo = null;
			this.pontos = pontos;
			for (var i = 0; i < this.pontos.length; i++) {
				this.pontos[i].setDono(this);
				this.pontos[i].girar(this.angulo);
				this.setMinAndMaxValues(this.pontos[i]);
			}
		}
	};

	this.addPonto = function(ponto) {
		if (ponto instanceof Ponto) {
			ponto.setDono(this);
			ponto.girar(this.angulo);
			this.pontos.push(ponto);
			this.setMinAndMaxValues(ponto);
		}
	};

	this.setPonto = function(index, ponto) {
		if (ponto instanceof Ponto && isNaN(index)) {
			index = parseInt(index);
			ponto.setDono(this);
			ponto.girar(this.angulo);
			this.pontos[index] = ponto;
			this.setMinAndMaxValues(ponto);
		}
	};

	this.setMinAndMaxValues = function(ponto) {
		if (ponto instanceof Ponto) {
			if (this.pontoMinimo == null && this.pontoMaximo == null) {
				this.pontoMinimo = new Ponto(ponto.getX(), ponto.getY());
				this.pontoMaximo = new Ponto(ponto.getX(), ponto.getY());
			} else {
				this.pontoMinimo.setX(Math.min(this.pontoMinimo.getX(), ponto
						.getX()));
				this.pontoMinimo.setY(Math.min(this.pontoMinimo.getY(), ponto
						.getY()));
				this.pontoMaximo.setX(Math.max(this.pontoMaximo.getX(), ponto
						.getX()));
				this.pontoMaximo.setY(Math.max(this.pontoMaximo.getY(), ponto
						.getY()));
			}
		}
	};

	this.atualizarCentro = function() {
		this.centro
				.setX((this.pontoMinimo.getX() + this.pontoMaximo.getX()) * 0.5);
		this.centro
				.setY((this.pontoMinimo.getY() + this.pontoMaximo.getY()) * 0.5);
	};

	this.girar = function(graus) {
		if (!isNaN(graus)) {
			while (graus > 360) {
				graus = graus % 360;
			}

			this.pontoMinimo = null;
			this.pontoMaximo = null;
			for (var i = 0; i < this.pontos.length; i++) {
				this.pontos[i].girar(graus);
				this.setMinAndMaxValues(this.pontos[i]);
			}
		}
	};

	this.inverterHorizontalMente = function() {
		for ( var index in this.pontos) {
			this.pontos[index].inverterHorizontalMente();
			this.setMinAndMaxValues(this.pontos[index]);
		}
	};

	this.inverterVerticalmente = function() {
		for ( var index in this.pontos) {
			this.pontos[index].inverterVerticalmente();
			this.setMinAndMaxValues(this.pontos[index]);
		}
	};

	this.getQuadradoCircunscrito = function() {
		var centro = new Ponto(this.centro.getX(), this.centro.getY());
		var largura = this.pontoMaximo.getX() - this.pontoMinimo.getX();
		var altura = this.pontoMaximo.getY() - this.pontoMinimo.getY();
		var caixa = new Retangulo(centro, largura, altura);
		return caixa;
	};

	this.getCentro = function() {
		return this.centro;
	};

	this.setAngulo = function(angulo) {
		if (!isNaN(angulo)) {
			angulo = Math.abs(angulo);
			while (angulo > 360) {
				angulo = angulo % 360;
			}
			if (this.angulo > angulo) {
				this.girar((this.angulo - angulo) * -1);
			} else if (angulo > this.angulo) {
				this.girar(angulo - this.angulo);
			}
		}
	};

	this.setCentro = function(centro) {
		if (centro instanceof Ponto) {
			if (this.centro.getX() != centro.getX()
					|| this.centro.getY() != centro.getY()) {
				var x = this.centro.getX() - centro.getX();
				var y = this.centro.getY() - centro.getY();
				for (var i = 0; i < this.pontos.length; i++) {
					this.pontos[i].setX(this.pontos[i].getX() + x);
					this.pontos[i].setY(this.pontos[i].getY() + y);
				}
				this.pontoMinimo.setX(this.pontoMinimo.getX() + x);
				this.pontoMinimo.setY(this.pontoMinimo.getY() + y);
				this.pontoMaximo.setX(this.pontoMaximo.getX() + x);
				this.pontoMaximo.setY(this.pontoMaximo.getY() + y);
				this.centro = centro;
			}
		}
	};
}
