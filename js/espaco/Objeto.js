function Objeto(forma) {
	this.forma = forma = !(forma instanceof FormaGeometrica) ? null : forma;
	this.forma.setDono(this);
	this.dinamico = false;
	this.friccao = false;
	this.elasticidade = 0.5;
	this.massa = this.forma.getArea();
	this.densidade = 0;
	this.velocidadeAngular = 0;
	this.vetor = new Vetor(0, 0);
	this.id = idGenerator.getId();

	this.getForma = function() {
		console.log("pegando forma do objeto");
		return this.forma;
	};

	this.getDinamico = function() {
		console.log("testando se objeto é dinâmico");
		return this.dinamico;
	};

	this.getFriccao = function() {
		console.log("pegando fricção do objeto");
		return this.friccao;
	};

	this.getElasticidade = function() {
		console.log("pegando elasticidade do objeto");
		return this.elasticidade;
	};

	this.getMassa = function() {
		console.log("pegando massa do objeto");
		return this.massa;
	};

	this.getDensidade = function() {
		console.log("pegando densidade do objeto");
		return this.densidade;
	};

	this.getVelocidadeAngular = function() {
		console.log("pegando velocidade angular do objeto");
		return this.velocidadeAngular;
	};

	this.setForma = function(forma) {
		console.log("setando forma do objeto");
		if (forma instanceof FormaGeometrica) {
			this.forma = forma;
		}
	};

	this.setDinamico = function(dinamico) {
		console.log("setando dinâmica do objeto");
		if (dinamico instanceof Boolean) {
			this.dinamico = dinamico;
		}
	};

	this.setFriccao = function(friccao) {
		console.log("setando fricção do objeto");
		if (!isNaN(friccao)) {
			this.friccao = friccao;
		}
	};

	this.setElasticidade = function(elasticidade) {
		console.log("setando elasticidade do objeto");
		if (!isNaN(elasticidade)) {
			this.elasticidade = elasticidade;
		}
	};

	this.setMassa = function(massa) {
		console.log("setando massa do objeto");
		if (!isNaN(massa)) {
			this.massa = massa;
		}
	};

	this.setDensidade = function(densidade) {
		console.log("setando densidade do objeto");
		if (!isNaN(densidade)) {
			this.densidade = densidade;
		}
	};

	this.setVelocidadeAngular = function(velocidadeAngular) {
		console.log("setando a velocidade angular");
		if (!isNaN(velocidadeAngular)) {
			this.velocidadeAngular = velocidadeAngular;
		}
	};

	this.getId = function() {
		console.log("pegando o id do objeto");
		return this.id;
	};

	this.isMoving = function() {
		console.log("verificando se o objeto está se movendo");
		return (this.vetor.obterNorma() != 0 || this.velocidadeAngular != 0);
	};

	this.step = function() {
		console.log("passo do objeto");
		if (this.vetor.obterNorma() != 0) {

			var x = this.forma.getCentro().getX() + this.vetor.getX();
			var y = this.forma.getCentro().getY() + this.vetor.getY();
			this.forma.getCentro().setX(x);
			this.forma.getCentro().setY(y);
		}

		if (this.velocidadeAngular != 0) {
			this.forma.girar(this.velocidadeAngular);
		}

		if (this.vetor.getY() < MAX_VELOCITY) {
			this.vetor = somaVetor(this.vetor, GRAVITY);
		}
	};

	this.getVetor = function() {
		console.log("obtendo vetor do objeto");
		return this.vetor;
	};

	this.rollBack = function() {
		console.log("retprnando o vetor para o estado anterior");
		this.forma.getCentro().setX(this.forma.getCentro().getAntigoX());
		this.forma.getCentro().setY(this.forma.getCentro().getAntigoY());
		this.forma.setAngulo(this.forma.getAntigoAngulo());
	};
}
