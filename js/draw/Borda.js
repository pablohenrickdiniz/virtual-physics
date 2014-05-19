function Borda(cor, espessura) {
	console.log("criando borda");
	this.cor = cor;
	this.espessura = isNaN(espessura) ? 1 : espessura;

	this.getCor = function() {
		console.log("pegando cor da borda");
		return this.cor;
	};

	this.getEspessura = function() {
		console.log("pegando espessura da borda");
		return this.espessura;
	};

	this.setCor = function(cor) {
		console.log("setando cor da borda");
		this.cor = cor;
	};

	this.setEspessura = function(espessura) {
		console.log("setando espessura da borda");
		if (!isNaN(espessura)) {
			this.espessura = espessura;
		}
	};
}