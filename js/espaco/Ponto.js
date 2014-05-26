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
		}
	};

	this.setY = function(y) {
		if (!isNaN(y) && y != this.y) {
			this.antigoY = this.y;
			this.y = y;
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

	this.girar = function(graus, centro) {
		var radianos = converterParaRadianos(graus);
		if (!(centro instanceof Ponto)) {
		    centro = new Ponto(0,0);
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

	this.inverterHorizontalmente = function(centro) {
		if (!(centro instanceof Ponto)) {
			centro = new Ponto(0, 0);
		}

		var distance = centro.getX() - this.x;
		this.x = centro.getX() + distance;
	};

	this.inverterVerticalmente = function(centro) {
		if (!(centro instanceof Ponto)) {
			centro = new Ponto(0, 0);
		}

		var distance = centro.getY() - this.y;
		this.y = centro.getY() + distance;
	};
	
	this.toString = function(){
		return "ponto("+this.x+","+this.y+")";
	};
}

function obterPontoMedio(pontoA, pontoB) {
	var pax = pontoA.getX();
	var pay = pontoA.getY();
	var pbx = pontoB.getX();
	var pby = pontoB.getY();
	return new Ponto((pax + pbx) / 2, (pay + pby) / 2);
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
