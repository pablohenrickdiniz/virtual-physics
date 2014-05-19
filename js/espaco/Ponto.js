function Ponto(x, y) {
	this.dono = null;
	this.x = isNaN(x) ? 0 : x;
	this.y = isNaN(y) ? 0 : y;
	this.antigoX = this.x;
	this.antigoY = this.y;

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.getAntigoX = function() {
		return this.antigoX;
	};

	this.getAntigoY = function() {
		return this.antigoY;
	};

	this.setX = function(x) {
		if (!isNaN(x) && x != this.x) {
			this.antigoX = this.x;
			this.x = x;
			if (this.dono != null) {
				this.dono.atualizarPontos();
			}
		}
	};

	this.setY = function(y) {
		if (!isNaN(y) && y != this.y) {
			this.antigoY = this.y;
			this.y = y;
			if (this.dono != null) {
				this.dono.atualizarPontos();
			}
		}
	};

	this.setDono = function(dono) {
		if (dono instanceof FormaGeometrica) {
			this.dono = dono;
		}
	};

	this.getDono = function() {
		return this.dono;
	};

	this.girar = function(graus) {
		var radianos = converterParaRadianos(graus);
		var centro = new Ponto(0, 0);
		if (this.dono instanceof FormaGeometrica) {
			centro = this.dono.getCentro();
		}
		var xf = (((this.x - centro.getX()) * Math.cos(radianos)) - ((this.y - centro
				.getY()) * Math.sin(radianos)))
				+ centro.getX();
		var yf = (((this.y - centro.getY()) * Math.cos(radianos)) + ((this.x - centro
				.getX()) * Math.sin(radianos)))
				+ centro.getY();
		this.x = xf;
		this.y = yf;
	};

	this.inverterHorizontalmente = function() {
		var centro = new Ponto(0, 0);
		if (this.dono instanceof FormaGeometrica) {
			centro = this.dono.getCentro();
		}

		var distance = centro.getX() - this.x;
		this.x = centro.getX() + distance;
	};

	this.inverterVerticalmente = function() {
		var centro = new Ponto(0, 0);
		if (this.dono instanceof FormaGeometrica) {
			centro = this.dono.getCentro();
		}

		var distance = centro.getY() - this.y;
		this.y = centro.getY() + distance;
	};
}

function obterPontoMedio(pontoA, pontoB) {
	return new Ponto((pontoA.getX() + pontoB.getX()) / 2, (pontoA.getY() + pontoB.getY()) / 2);
}

function obterDistancia(pontoA, pontoB) {
	var xmax = Math.max(pontoA.getX(), pontoB.getX());
	var ymax = Math.max(pontoA.getY(), pontoB.getY());
	var xmin = Math.min(pontoA.getX(), pontoB.getX());
	var ymin = Math.min(pontoA.getY(), pontoB.getY());
	var catetoA = xmax - xmin;
	var catetoB = ymax - ymin;
	return Math.sqrt(Math.pow(catetoA, 2) + Math.pow(catetoB, 2));
}
