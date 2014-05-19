function Reta(pontoA, pontoB){
	this.pontoA = pontoA;
	this.pontoB = pontoB;
	this.pontoM = null;
	this.tamanho = null;

	this.getPontoMedio = function() {
		if (!(this.pontoM instanceof Ponto)) {
			this.pontoM = obterPontoMedio(this.pontoA, this.pontoB);
		}
		return this.pontoM;
	};

	this.getTamanho = function() {
		if (isNaN(this.tamanho)) {
			this.tamanho = obterDistancia(this.pontoA, this.pontoB);
		}
		return this.tamanho;
	};

	this.setPontoA = function(pontoA) {
		this.pontoA = pontoA;
		this.tamanho = null;
		this.pontoM = null;
	};

	this.setPontoB = function(pontoB) {
		this.pontoB = pontoB;
		this.tamanho = null;
		this.pontoM = null;
	};

	this.getPontoA = function() {
		return this.pontoA;
	};

	this.getPontoB = function() {
		return this.pontoB;
	};
}

function obterMenorReta() {
	var reta = null;
	if (arguments.length >= 2) {
		reta = new Reta(arguments[0], arguments[1]);
		for (var i = 0; i < arguments.length; i++) {
			for (var j = i + 1; j < arguments.length; j++) {
				var aux = new Reta(arguments[i], arguments[j]);
				if (aux.getTamanho() < reta.getTamanho()) {
					reta = aux;
				}
			}
		}
	}
	return reta;
}