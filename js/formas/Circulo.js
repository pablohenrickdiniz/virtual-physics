Circulo.prototype = new Arco();

function Circulo(centro, raio) {
	Arco.call(this, centro, raio, 0, 360);

	this.getQuadradoCircunscrito = function() {
		return new Retangulo(this.centro, this.raio * 2, this.raio * 2);
	};

	this.getArea = function() {
		Math.PI * Math.pow(this.raio, 2);
	};
	
	this.girar = function(graus, origem) {
		if (!isNaN(graus)) {
			while (graus > 360) {
				graus = graus % 360;
			}
			if(origem instanceof Ponto){
				this.centro.girar(graus,origem);
			}
		}
	};
};