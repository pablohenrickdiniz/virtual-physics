function Borda(cor, espessura) {
	this.cor = cor;
	this.espessura = isNaN(espessura) ? 1 : espessura;

	this.getCor = function() {
		return this.cor;
	};

	this.getEspessura = function() {
		return this.espessura;
	};

	this.setCor = function(cor) {
		this.cor = cor;
	};

	this.setEspessura = function(espessura) {
		if (!isNaN(espessura)) {
			this.espessura = espessura;
		}
	};
}