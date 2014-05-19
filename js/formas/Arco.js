Arco.prototype = new FormaGeometrica();

function Arco(centro, raio, anguloInicial, anguloFinal) {
	FormaGeometrica.call(this, centro, 'white', new Borda('black', 1), 0);

	this.raio = isNaN(raio) ? 10 : raio;
	this.anguloInicial = isNaN(anguloInicial) ? 0 : anguloInicial;
	this.anguloFinal = isNaN(anguloFinal) ? 180 : anguloFinal;

	while (this.anguloInicial > 360) {
		this.anguloInicial = this.anguloInicial % 360;
	}

	while (this.anguloFinal > 360) {
		this.anguloFinal = this.anguloFinal % 360;
	}

	this.getRaio = function() {
		return this.raio;
	};

	this.getAnguloInicial = function() {
		return this.anguloInicial;
	};

	this.getAnguloFinal = function() {
		return this.anguloFinal;
	};

	this.setAnguloInicial = function(anguloInicial) {
		if (!isNaN(anguloInicial)) {
			while (anguloInicial > 360) {
				anguloInicial = anguloInicial % 360;
			}
			this.anguloInicial = anguloInicial;
		}
	};

	this.setAnguloFinal = function(anguloFinal) {
		if (!isNaN(anguloFinal)) {
			while (angulo > 360) {
				anguloFinal = anguloFinal % 360;
			}
			this.anguloFinal = anguloFinal;
		}
	};

	this.setRaio = function(raio) {
		if (!isNaN(raio)) {
			this.raio = raio;
		}
	};
}
