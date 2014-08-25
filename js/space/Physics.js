function Fisica() {
	this.gravidade = 1;
	this.tempo = 100;
	this.unidadeMedida = 10;

	this.getGravidade = function() {
		return this.gravidade;
	};

	this.getTempo = function() {
		return this.tempo;
	};

	this.getUnidadeMedida = function() {
		return this.unidadeMedida;
	};

	this.setGravidade = function(gravidade) {
		if (!isNaN(gravidade)) {
			this.gravidade = gravidade;
		}
	};

	this.setTempo = function(tempo) {
		if (!isNaN(tempo)) {
			this.tempo = tempo;
		}
	};

	this.setUnidadeMedidade = function(unidadeMedida) {
		if (!isNaN(unidadeMedida)) {
			this.unidadeMedidade = unidadeMedida;
		}
	};

}
