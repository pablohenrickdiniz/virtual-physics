Trapezio.prototype = new Poligono();
function Trapezio(centro,baseInferior, baseSuperior, altura){
	Poligono.call(this, centro);
	
	this.baseInferior = isNaN(baseInferior) || baseInferior <= 0?20:baseInferior;
	this.baseSuperior = isNaN(baseSuperior) || baseInferior <= 0?15:baseSuperior;
	this.altura = isNaN(altura) || altura <= 0 ? 10: altura;
	
	this.getBaseInferior = function(){
		return this.baseInferior;
	};
	
	this.getBaseSuperior = function(){
		return this.baseSuperior;
	};
	
	this.getAltura = function(){
		return this.altura;
	};
	
	this.setBaseInferior = function(baseInferior){
		if(!isNaN(baseInferior) && baseInferior != this.baseInferior && baseInferior > 0){
			this.baseInferior = baseInferior;
			this.atualizarPontos();
		}
	};
	
	this.setBaseSuperior = function(baseSuperior){
		if(!isNaN(baseSuperior) && baseSuperior != this.baseSuperior && baseSuperior > 0){
			this.baseSuperior = baseSuperior;
			this.atualizarPontos();
		}
	};
	
	this.setAltura = function(altura){
		if (!isNaN(altura) && altura != this.altura && altura > 0){
			this.altura = altura;
			this.atualizarPontos();
		}
	};
	

	this.atualizarPontos = function() {
		var pontos = new Array();
		var x = this.centro.getX();
		var y = this.centro.getY();
		var pa = new Ponto(x - (this.baseSuperior * 0.5), y - (this.altura * 0.5));
		var pb = new Ponto(x + (this.baseSuperior * 0.5), y - (this.altura * 0.5));
		var pc = new Ponto(x + (this.baseInferior * 0.5), y + (this.altura * 0.5));
		var pd = new Ponto(x - (this.baseInferior * 0.5), y + (this.altura * 0.5));
		pontos.push(pa);
		pontos.push(pb);
		pontos.push(pc);
		pontos.push(pd);
		this.setPontos(pontos);
	};
	
	this.atualizarPontos();
}