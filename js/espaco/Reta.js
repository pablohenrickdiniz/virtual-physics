function Reta(pontoA, pontoB) {
	console.log("criando reta");
	this.pontoA = pontoA;
	this.pontoB = pontoB;
	this.pontoM = null;
	this.tamanho = null;

	this.getPontoMedio = function() {
		console.log("pegando ponto médio");
		if (!(this.pontoM instanceof Ponto)) {
			this.pontoM = obterPontoMedio(this.pontoA, this.pontoB);
		}
		return this.pontoM;
	};

	this.getTamanho = function() {
		console.log("pegando tamanho da reta");
		if (isNaN(this.tamanho)) {
			this.tamanho = obterDistancia(this.pontoA, this.pontoB);
		}
		return this.tamanho;
	};

	this.setPontoA = function(pontoA) {
		console.log("setando ponto A da reta");
		this.pontoA = pontoA;
		this.tamanho = null;
		this.pontoM = null;
	};

	this.setPontoB = function(pontoB) {
		console.log("setando ponto B da reta");
		this.pontoB = pontoB;
		this.tamanho = null;
		this.pontoM = null;
	};

	this.getPontoA = function() {
		console.log("pegando ponto A da reta");
		return this.pontoA;
	};

	this.getPontoB = function() {
		console.log("pegando ponto B da reta");
		return this.pontoB;
	};
}

function obterMenorReta() {
	console.log("pegando menor reta");
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