function Drawing(centro) {
	this.formas = new Array();
	this.center = !(centro instanceof Ponto) ? new Ponto(0, 0) : centro;
	this.degree = 0;
	this.addForma = function(formaGeometrica) {
		if (formaGeometrica instanceof Shape) {
			this.formas.push(formaGeometrica);
		}
	};

	this.removeForma = function(formaGeometrica) {
		if (formaGeometrica instanceof Shape) {
			this.formas.remove(formaGeometrica);
		}
	};

	this.getShapes = function() {
		return this.formas;
	};

	this.setFormas = function(formas) {
		if (formas instanceof Array) {
			this.formas = formas;
		}
	};

	this.rotate = function(graus, origem) {
		if (!(origem instanceof Ponto)) {
			origem = this.center;
		} else {
			this.center.rotate(graus, origem);
		}

		for ( var i = 0; i < this.formas.length; i++) {
			this.formas[i].setDegree(graus, origem);
		}
	};

	this.setDegree = function(angulo, origem) {
		if (!isNaN(degree)) {
			while (degree > 360 || degree < -360) {
				degree = degree % 360;
			}
			this.rotate(this.degree*-1, origem);
			this.rotate(degree, origem);
			this.degree = degree;
		}
	};

	this.translate = function(x, y) {
		for ( var i = 0; i < this.formas.length; i++) {
			this.formas[i].translate(x, y);
		}
		this.center.setX(this.center.getX()+x);
	    this.center.setY(this.center.getY()+y);
	};

	this.moveTo = function(x, y) {
		var dx = this.center.getX()-x;
		var dy = this.center.getY()-y;
		this.center.setX(x);
		this.center.setY(y);
		for(var i = 0; i < this.formas.length;i++){
			this.formas[i].translate(-dx,-dy);
		}
	};

	this.setCentro = function(centro) {
		if (centro instanceof Ponto) {
			this.center = centro;
		}
	};

	this.getCentro = function() {
		return this.center;
	};

}