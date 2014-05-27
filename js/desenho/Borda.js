function Borda(cor, espessura) {
	this.cor = cor;
	this.espessura = isNaN(espessura) ? 1 : espessura;
	this.lineDash  = new Array();
	this.lineCap   = 'butt';

	this.getCor = function() {
		return this.cor;
	};

	this.getEspessura = function() {
		return this.espessura;
	};

	this.getLineDash = function(){
		return this.lineDash;
	};
	
	this.getLineCap = function(){
		return this.lineCap;
	};
	
	this.setCor = function(cor) {
		this.cor = cor;
	};

	this.setEspessura = function(espessura) {
		if (!isNaN(espessura)) {
			this.espessura = espessura;
		}
	};
	
	this.setLineDash = function(values){
		this.lineDash = values;
	};
	
	this.setLineCap = function(lineCap){
		this.lineCap = lineCap;
	};
}

Borda.BUTT  = 'butt';
Borda.ROUND = 'round';
Borda.SQUARE = 'square';