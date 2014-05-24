function Desenho(centro) {
	this.formas = new Array();
	this.centro = !(centro instanceof Ponto) ? new Ponto(0, 0) : centro;

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
			this.formas[i].girar(graus, origem);
		}
	};

	this.setAngulo = function(angulo, origem) {
		for (var i = 0; i < this.formas.length; i++) {
			this.formas[i].setAngulo(angulo, origem);
		}
	};

	this.transladar = function(x, y) {
		for ( var i = 0; i < this.formas.length; i++) {
			this.formas[i].transladar(x, y);
		}
	};
	
	this.moverPara = function(x, y) {
		var cx = this.centro.getX();
		var cy = this.centro.getY();
		this.centro.setX(x);
		this.centro.setY(y);
		for ( var i = 0; i < this.formas.length; i++) {
			var fx = this.formas[i].getCentro().getX();
			var fy = this.formas[i].getCentro().getY();
			var dxc = fx-cx;
			var dyc = fy-cy;
			this.formas[i].moverPara(x+dxc,y+dyc);
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