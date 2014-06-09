function FormaGeometrica(centro, cor, borda, angulo) {
	this.centro = !(centro instanceof Ponto) ? new Ponto(10, 10) : centro;
	this.centro.setDono(this);
	this.cor = cor == undefined ? new Color(255,255,255) : cor;
	this.borda = !(borda instanceof Borda) ? new Borda(new Color(0,0,0), 1) : borda;
	this.sombra = null;
	this.angulo = isNaN(angulo) ? 0 : angulo;
	this.antigoAngulo = this.angulo;
	this.dono = null;
	this.camada = 1;
	this.id = idGenerator.getId();
	this.drawType = "CANVAS";
	
	this.getCor = function() {
		return this.cor;
	};

	this.getBorda = function() {
		return this.borda;
	};

	this.getAngulo = function() {
		return this.angulo;
	};

	this.getAntigoAngulo = function() {
		return this.antigoAngulo;
	};

	this.getCentro = function() {
		return this.centro;
	};

	this.setCor = function(cor) {
		if (cor != this.cor) {
			this.cor = cor;
		}
	};

	this.setBorda = function(borda) {
		if (borda instanceof Borda) {
			this.borda = borda;
		}
	};

	this.setAngulo = function(angulo) {
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
		if (centro instanceof Ponto) {
			if (this.centro.getX() != centro.getX()|| this.centro.getY() != centro.getY()) {
				this.centro = centro;
				this.centro.setDono(this);
			}
		}
	};

	this.setDono = function(dono) {
		this.dono = dono;
	};
	
	this.setSombra = function(sombra){
		if(sombra instanceof Sombra){
			this.sombra = sombra;
		}
	};
	
	this.getSombra = function(){
		return this.sombra;
	};
	
	this.getDono = function() {
		return this.dono;
	};

	this.getCamada = function() {
		return this.camada;
	};

	this.setCamada = function(camada) {
		this.camada = camada;
	};
	
	this.getId = function() {
		return this.id;
	};
}
