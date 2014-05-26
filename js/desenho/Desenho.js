function Desenho(centro) {
	this.formas = new Array();
	this.centro = !(centro instanceof Ponto) ? new Ponto(0, 0) : centro;
	this.angulo = 0;
	this.addForma = function(formaGeometrica) {
		if (formaGeometrica instanceof FormaGeometrica) {
			this.formas.push(formaGeometrica);
		}
	};

	this.removeForma = function(formaGeometrica) {
		if (formaGeometrica instanceof FormaGeometrica) {
			this.formas.remove(formaGeometrica);
		}
	};

	this.getFormas = function() {
		return this.formas;
	};

	this.setFormas = function(formas) {
		if (formas instanceof Array) {
			this.formas = formas;
		}
	};

	this.girar = function(graus, origem) {
		if (!(origem instanceof Ponto)) {
			origem = this.centro;
		} else {
			this.centro.girar(graus, origem);
		}

		for ( var i = 0; i < this.formas.length; i++) {
			this.formas[i].setAngulo(graus, origem);
		}
	};

	this.setAngulo = function(angulo, origem) {
		if (!isNaN(angulo)) {
			while (angulo > 360 || angulo < -360) {
				angulo = angulo % 360;
			}
			this.girar(this.angulo*-1, origem);
			this.girar(angulo, origem);
			this.angulo = angulo;
		}
	};

	this.transladar = function(x, y) {
		for ( var i = 0; i < this.formas.length; i++) {
			this.formas[i].transladar(x, y);
		}
		this.centro.setX(this.centro.getX()+x);
	    this.centro.setY(this.centro.getY()+y);
	};

	this.moverPara = function(x, y) {
		var dx = this.centro.getX()-x;
		var dy = this.centro.getY()-y;
		this.centro.setX(x);
		this.centro.setY(y);
		for(var i = 0; i < this.formas.length;i++){
			this.formas[i].transladar(-dx,-dy);
		}
	};

	this.setCentro = function(centro) {
		if (centro instanceof Ponto) {
			this.centro = centro;
		}
	};

	this.getCentro = function() {
		return this.centro;
	};

}