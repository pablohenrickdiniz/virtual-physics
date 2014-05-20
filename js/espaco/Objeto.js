function Objeto(forma) {
	this.forma = !(forma instanceof FormaGeometrica) ? null : forma;
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
		return this.forma;
	};

	this.getDinamico = function() {
		return this.dinamico;
	};

	this.getFriccao = function() {
		return this.friccao;
	};

	this.getElasticidade = function() {
		return this.elasticidade;
	};

	this.getMassa = function() {
		return this.massa;
	};

	this.getDensidade = function() {
		return this.densidade;
	};

	this.getVelocidadeAngular = function() {
		return this.velocidadeAngular;
	};

	this.setForma = function(forma) {
		if (forma instanceof FormaGeometrica) {
			this.forma = forma;
		}
	};

	this.setDinamico = function(dinamico) {
		if (dinamico instanceof Boolean) {
			this.dinamico = dinamico;
		}
	};

	this.setFriccao = function(friccao) {
		if (!isNaN(friccao)) {
			this.friccao = friccao;
		}
	};

	this.setElasticidade = function(elasticidade) {
		if (!isNaN(elasticidade)) {
			this.elasticidade = elasticidade;
		}
	};

	this.setMassa = function(massa) {
		if (!isNaN(massa)) {
			this.massa = massa;
		}
	};

	this.setDensidade = function(densidade) {
		if (!isNaN(densidade)) {
			this.densidade = densidade;
		}
	};

	this.setVelocidadeAngular = function(velocidadeAngular) {
		if (!isNaN(velocidadeAngular)) {
			this.velocidadeAngular = velocidadeAngular;
		}
	};

	this.getId = function() {
		return this.id;
	};

	this.isMoving = function() {
		return (this.dinamico || this.vetor.getX() != 0 || this.vetor.getX() != 0 || this.velocidadeAngular != 0);
	};

	this.step = function() {
		if (this.vetor.getX() != 0 || this.vetor.getY() != 0) {
			var x = this.forma.getCentro().getX() + (this.vetor.getX()/METERPIXEL);
			var y = this.forma.getCentro().getY() + (this.vetor.getY()/METERPIXEL);
			this.forma.getCentro().setX(x);
			this.forma.getCentro().setY(y);
		}

		if (this.velocidadeAngular != 0) {
			this.forma.girar(this.velocidadeAngular);
		}

	    if(this.vetor.obterNorma() < VELOCIDADETERMINAL){
            this.vetor = somaVetor(this.vetor, GRAVITY);
        }
	};

	this.getVetor = function() {
		return this.vetor;
	};

	this.rollBack = function() {
		this.forma.getCentro().setX(this.forma.getCentro().getAntigoX());
		this.forma.getCentro().setY(this.forma.getCentro().getAntigoY());
		this.forma.setAngulo(this.forma.getAntigoAngulo());
	};
}
