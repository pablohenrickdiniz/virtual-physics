function Objeto(contato, desenho) {
	this.contato = !(contato instanceof FormaGeometrica) ?null: contato;
	this.desenho = !(desenho instanceof Desenho) ? null : desenho;
	this.contato.setDono(this);
	this.dinamico = false;
	this.friccao = false;
	this.elasticidade = 0.5;
	this.massa = this.contato.getArea();
	this.densidade = 0;
	this.velocidadeAngular = 0;
	this.vetor = new Vetor(0, 0);
	this.id = idGenerator.getId();

	this.getContato = function() {
		return this.contato;
	};

	this.getDesenho = function() {
		return this.desenho;
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

	this.getVetor = function() {
		return this.vetor;
	};

	this.getAngulo = function() {
		var angulo = 0;
		if (this.contato != null) {
			angulo = this.contato.getAngulo();
		}
		return angulo;
	};

	this.getCentro = function() {
		var centro = null;
		if (this.contato != null) {
			centro = this.contato.getCentro();
		}
		return centro;
	};

	this.setContato = function(contato) {
		if (contato instanceof FormaGeometrica) {
			this.contato = contato;
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

	this.setVetor = function(vetor) {
		if (vetor instanceof Vetor) {
			this.vetor = vetor;
		}
	};

	this.setDesenho = function(desenho) {
		if (desenho instanceof Desenho) {
			this.desenho = desenho;
		}
	};

	this.setAngulo = function(angulo, origem) {
		this.contato.setAngulo(angulo, origem);
		this.desenho.setAngulo(angulo, origem);
	};

	this.getId = function() {
		return this.id;
	};

	this.isMoving = function() {
		return (this.dinamico || this.vetor.getX() != 0
				|| this.vetor.getX() != 0 || this.velocidadeAngular != 0);
	};

	this.moverPara = function(x, y) {
		this.contato.moverPara(x, y);
		this.desenho.moverPara(x, y);
		console.log(this.contato.centro+"");
		console.log(this.desenho.centro+"");
	};

	this.transladar = function(x, y) {
		this.contato.transladar(x, y);
		this.desenho.transladar(x, y);
	};

	this.step = function() {
		if (this.vetor.getX() != 0 || this.vetor.getY() != 0) {
			var x = this.vetor.getX() / METERPIXEL;
			var y = this.vetor.getY() / METERPIXEL;
			this.contato.transladar(x, y);
			this.desenho.transladar(x, y);
		}

		if (this.velocidadeAngular != 0) {
			this.contato.girar(this.velocidadeAngular);
			this.desenho.girar(this.velocidadeAngular);
		}

		if (this.vetor.obterNorma() < VELOCIDADETERMINAL) {
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
