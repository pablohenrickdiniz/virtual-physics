Circulo.prototype = new Arco();

function Circulo(centro, raio) {
	console.log("criando circulo");
	Arco.call(this, centro, raio, 0, 360);

	this.getQuadradoCircunscrito = function() {
		console.log("pegando quadrado circunscrito do circulo");
		return new Retangulo(this.centro, this.raio * 2, this.raio * 2);
	};

	this.getArea = function() {
		console.log("pegando área do circulo");
		Math.PI * Math.pow(this.raio, 2);
	};
};