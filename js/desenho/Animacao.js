function Animacao(imagem, linhas, colunas, linhaAtual, colunaAtual) {
	if(!(imagem instanceof Imagem)){
		throw new TypeError('O parametro imagem é obrigatório');
	}
	this.imagem = imagem;

	this.linhas  = isNaN(linhas) || linhas < 1?1:parseInt(linhas);
	this.colunas = isNaN(colunas) || colunas < 1?1:parseInt(colunas);
	this.linhaAtual = isNaN(linhaAtual) || linhaAtual < 0 || linhaAtual >= this.linhas?1:parseInt(linhaAtual);
	this.colunaAtual = isNaN(colunaAtual) || colunaAtual < 0 || colunaAtual >= this.colunas?1:parseInt(colunaAtual);
	var w =this.imagem.getWidth()/this.colunas;
	var h =this.imagem.getHeight()/this.linhas;
	this.imagem.setWidth(w);
	this.imagem.setHeight(h);
	this.imagem.setSx(w);
	this.imagem.setSy(h);
	
	this.direcao = Animacao.Direcao.HORIZONTAL;
	this.sentido = Animacao.Sentido.PROXIMO;
	this.velocidade = Animacao.Velocidade.NORMAL;
	
	this.executor = null;
	this.executando = false;

	this.nextFrame = function() {
		if(this.direcao == 'horizontal'){
			this.colunaAtual += (this.sentido=='proximo'?1:-1);
			this.colunaAtual = this.colunaAtual==this.colunas?0:this.colunaAtual < 0?this.colunas-1:this.colunaAtual;
		}
		else if(this.direcao == 'vertical'){
			this.linhaAtual += (this.sentido=='proximo'?1:-1);
			this.linhaAtual = this.linhaAtual==this.linhas?0:this.linhaAtual < 0?this.linhas-1:this.linhaAtual;
		}
		else{
			if(this.sentido == 'proximo'){
				this.colunaAtual++;
				if(this.colunaAtual == this.colunas){
					this.colunaAtual = 0;
					this.linhaAtual++;
					if(this.linhaAtual == this.linhas){
						this.linhaAtual = 0;
					}
				}
			}
			else{
				this.colunaAtual--;
				if(this.colunaAtual < 0){
					this.colunaAtual = this.colunas-1;
					this.linhaAtual--;
					if(this.linhaAtual < 0){
						this.linhaAtual = this.linhas-1;
					}
				}
			}
		}
		this.imagem.setSx(this.imagem.getWidth()*this.colunaAtual);
		this.imagem.setSy(this.imagem.getHeight()*this.linhaAtual);
	};

	this.setDirecao = function(direcao) {
		for ( var index in Animacao.Direcao) {
			var direcao = direcao.toLowerCase();
			if (direcao == Animacao.Direcao[index]) {
				this.direcao = direcao;
			}
		}
	};

	this.setSentido = function(sentido) {
		for ( var index in Animacao.Sentido) {
			var sentido = sentido.toLowerCase();
			if (sentido == Animacao.Sentido[index]) {
				this.sentido = sentido;
			}
		}
	};

	this.setVelocidade = function(velocidade) {
		for ( var index in Animacao.Velocidade) {
			var velocidade = velocidade.toLowerCase();
			if (velocidade == Animacao.Velocidade[index]) {
				this.stop();
				this.velocidade = velocidade;
				this.execute();
			}
		}
	};
	
	this.execute = function(){
		if(!this.executando && this.velocidade != 0){
			var anim = this;
			this.executor = setInterval(function(){
				anim.nextFrame();
			},700/anim.velocidade);
		}
	};
	
	this.stop = function(){
			clearInterval(this.executor);
	};
	
	this.getLinhaAtual = function() {
		return this.linhaAtual;
	};

	this.getColunaAtual = function() {
		return this.colunaAtual;
	};
	
	this.getImage = function(){
		return this.image;
	};
	
	this.setLinhaAtual = function(linhaAtual){
		if(!isNaN(linhaAtual) && linhaAtual >= 0 && linhaAtual < this.linhas){
			this.linhaAtual = parseInt(linhaAtual);
		}
	};
	
	this.setColunaAtual = function(colunaAtual){
		if(!isNaN(colunaAtual) && colunaAtual >= 0 && colunaAtual < this.colunas){
			this.colunatual = parseInt(colunaAtual);
		}
	};
	
}

Animacao.Direcao = {
	HORIZONTAL : 'horizontal',
	VERTICAL : 'vertical',
	COMPLETA : 'completa'
};

Animacao.Sentido = {
	PROXIMO : 'proximo',
	ANTERIOR : 'anterior'
};

Animacao.Velocidade = {
	PARADO : 0,
	MUITOLENTO : 1,
	LENTO : 2,
	NORMAL : 3,
	RAPIDO : 4,
	MUITORAPIDO : 5
};
