function Ponto(x, y) {
	console.log("criando ponto");
	this.dono = null;
	this.x = isNaN(x) ? 0 : x;
	this.y = isNaN(y) ? 0 : y;
	this.antigoX = this.x;
	this.antigoY = this.y;

	this.getX = function() {
		console.log("pegando posição x do ponto");
		return this.x;
	};

	this.getY = function() {
		console.log("pegando posição y do ponto");
		return this.y;
	};

	this.getAntigoX = function() {
		console.log("pegando antiga posição x do ponto");
		return this.antigoX;
	};

	this.getAntigoY = function() {
		console.log("pegando antiga posição y do ponto");
		return this.antigoY;
	};

	this.setX = function(x) {
		console.log("setando posição x do ponto");
		if (!isNaN(x) && x != this.x) {
			this.antigoX = this.x;
			this.x = x;
			if (this.dono != null) {
				this.dono.atualizarPontos();
			}
		}
	};

	this.setY = function(y) {
		console.log("setando posição y do ponto");
		if (!isNaN(y) && y != this.y) {
			this.antigoY = this.y;
			this.y = y;
			if (this.dono != null) {
				this.dono.atualizarPontos();
			}
		}
	};

	this.setDono = function(dono) {
		console.log("setando dono do ponto");
		if (dono instanceof FormaGeometrica) {
			this.dono = dono;
		}
	};

	this.getDono = function() {
		console.log("pegando dono do ponto");
		return this.dono;
	};

	this.girar = function(graus) {
		console.log("girando ponto");
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
		console.log("invertendo ponto horizontalmente");
		var centro = new Ponto(0, 0);
		if (this.dono instanceof FormaGeometrica) {
			centro = this.dono.getCentro();
		}

		var distance = centro.getX() - this.x;
		this.x = centro.getX() + distance;
	};

	this.inverterVerticalmente = function() {
		console.log("invertendo ponto verticalmente");
		var centro = new Ponto(0, 0);
		if (this.dono instanceof FormaGeometrica) {
			centro = this.dono.getCentro();
		}

		var distance = centro.getY() - this.y;
		this.y = centro.getY() + distance;
	};
}

function obterPontoMedio(pontoA, pontoB) {
	console.log("obtendo ponto médio");
	return new Ponto((pontoA.getX() + pontoB.getX()) / 2,
			(pontoA.getY() + pontoB.getY()) / 2);
}

function obterDistancia(pontoA, pontoB) {
	console.log("obtendo distância entre dois pontos");
	var xmax = Math.max(pontoA.getX(), pontoB.getX());
	var ymax = Math.max(pontoA.getY(), pontoB.getY());
	var xmin = Math.min(pontoA.getX(), pontoB.getX());
	var ymin = Math.min(pontoA.getY(), pontoB.getY());
	var catetoA = xmax - xmin;
	var catetoB = ymax - ymin;
	return Math.sqrt(Math.pow(catetoA, 2) + Math.pow(catetoB, 2));
}
