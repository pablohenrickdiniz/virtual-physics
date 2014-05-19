Circulo.prototype = new Arco();

function Circulo(centro, raio) {
	Arco.call(this, centro, raio, 0, 360);

	this.getQuadradoCircunscrito = function() {
		return new Retangulo(this.centro, this.raio * 2, this.raio * 2);
	};

	this.getArea = function() {
		Math.PI * Math.pow(this.raio, 2);
	};
};