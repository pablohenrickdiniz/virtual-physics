function FormaGeometrica(centro, cor, borda, angulo) {
	console.log("criando forma geométrica");
	this.centro = !(centro instanceof Ponto) ? new Ponto(10, 10) : centro;
	this.centro.setDono(this);
	this.cor = cor == undefined ? 'white' : cor;
	this.borda = !(borda instanceof Borda) ? new Borda('black', 1) : borda;
	this.angulo = isNaN(angulo) ? 0 : angulo;
	this.antigoAngulo = this.angulo;
	this.dono = null;
	this.camada = 1;
	this.id = idGenerator.getId();

	this.getCor = function() {
		console.log("pegando cor da forma geométrica");
		return this.cor;
	};

	this.getBorda = function() {
		console.log("pegando borda da forma geométrica");
		return this.borda;
	};

	this.getAngulo = function() {
		console.log("pegando angulo da forma geométrica");
		return this.angulo;
	};

	this.getAntigoAngulo = function() {
		console.log("pegando antigo angulo");
		return this.antigoAngulo;
	};

	this.getCentro = function() {
		console.log("pegando o centro da forma");
		return this.centro;
	};

	this.setCor = function(cor) {
		console.log("setando cor da forma");
		if (cor != this.cor) {
			this.cor = cor;
		}
	};

	this.setBorda = function(borda) {
		console.log("setando borda da forma");
		if (borda instanceof Borda) {
			this.borda = borda;
		}
	};

	this.setAngulo = function(angulo) {
		console.log("setando angulo da forma");
		if (!isNaN(angulo)) {
			while (angulo > 360) {
				angulo = angulo % 360;
			}
			if (angulo != this.angulo) {
				this.antigoAngulo = this.angulo;
				this.angulo = angulo;
			}
		}
	};

	this.setCentro = function(centro) {
		console.log("setando centro da forma");
		if (centro instanceof Ponto) {
			if (this.centro.getX() != centro.getX()
					|| this.centro.getY() != centro.getY()) {
				this.centro = centro;
			}
		}
	};

	this.setDono = function(dono) {
		console.log("setando dono da forma");
		this.dono = dono;
	};

	this.getDono = function() {
		console.log("pegando dono da forma");
		return this.dono;
	};

	this.getCamada = function() {
		console.log("pegando camada da forma");
		return this.camada;
	};

	this.setCamada = function(camada) {
		console.log("setando camada da forma");
		this.camada = camada;
	};

	this.getId = function() {
		console.log("pegando id da forma");
		return this.id;
	};
}
