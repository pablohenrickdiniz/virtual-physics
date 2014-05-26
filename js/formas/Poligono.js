Poligono.prototype = new FormaGeometrica();

function Poligono(centro, angulo) {
	FormaGeometrica.call(this, centro, 'white', new Borda('black', 1), angulo);

	this.pontoMinimo = null;
	this.pontoMaximo = null;
	this.pontos = new Array();

	this.getPontos = function() {
		return this.pontos;
	};

	this.getPonto = function(index) {
		return this.pontos[index];
	};

	this.setPontos = function(pontos) {
		if (pontos instanceof Array) {
			this.pontoMinimo = null;
			this.pontoMaximo = null;
			this.pontos = pontos;
			for (var i = 0; i < this.pontos.length; i++) {
				this.pontos[i].setDono(this);
				this.pontos[i].girar(this.angulo);
				this.setMinAndMaxValues(this.pontos[i]);
			}
		}
	};

	this.addPonto = function(ponto) {
		if (ponto instanceof Ponto) {
			ponto.setDono(this);
			ponto.girar(this.angulo);
			this.pontos.push(ponto);
			this.setMinAndMaxValues(ponto);
		}
	};

	this.setPonto = function(index, ponto) {
		if (ponto instanceof Ponto && isNaN(index)) {
			index = parseInt(index);
			ponto.setDono(this);
			ponto.girar(this.angulo);
			this.pontos[index] = ponto;
			this.setMinAndMaxValues(ponto);
		}
	};

	this.setMinAndMaxValues = function(ponto) {
		if (ponto instanceof Ponto) {
			if (this.pontoMinimo == null && this.pontoMaximo == null) {
				this.pontoMinimo = new Ponto(ponto.getX(), ponto.getY());
				this.pontoMaximo = new Ponto(ponto.getX(), ponto.getY());
			} else {
				this.pontoMinimo.setX(Math.min(this.pontoMinimo.getX(), ponto.getX()));
				this.pontoMinimo.setY(Math.min(this.pontoMinimo.getY(), ponto.getY()));
				this.pontoMaximo.setX(Math.max(this.pontoMaximo.getX(), ponto.getX()));
				this.pontoMaximo.setY(Math.max(this.pontoMaximo.getY(), ponto.getY()));
			}
		}
	};

	this.girar = function(graus, origem) {
		if (!isNaN(graus)) {
			while (graus > 360) {
				graus = graus % 360;
			}
			
			if(!(origem instanceof Ponto)){
				origem = this.centro;
			}
			else{
				this.centro.girar(graus,origem);
			}
			
			this.pontoMinimo = null;
			this.pontoMaximo = null;
			for (var i = 0; i < this.pontos.length; i++) {
				this.pontos[i].girar(graus,origem);
				this.setMinAndMaxValues(this.pontos[i]);
			}
		}
	};

    this.transladar = function(x,y){
        x = isNaN(x)?0:x;
        y = isNaN(y)?0:y;

        for(var i = 0; i < this.pontos.length;i++){
            this.pontos[i].setX(this.pontos[i].getX()+x);
            this.pontos[i].setY(this.pontos[i].getY()+y);
        }
        this.centro.setX(this.centro.getX()+x);
        this.centro.setY(this.centro.getY()+y);
        if(this.cor instanceof GradienteLinear){
        	this.cor.transladar(x,y);
        }
    };

    this.moverPara = function(x,y){
        var xd = 0;
        var yd = 0;
        if(!isNaN(x)){
            xd = this.centro.getX()-x;
            this.centro.setX(x);
        }

        if(!isNaN(y)){
            yd = this.centro.getY()-y;
            this.centro.setY(y);
        }
        for(var i = 0; i < this.pontos.length;i++){
            this.pontos[i].setX(this.pontos[i].getX()-xd);
            this.pontos[i].setY(this.pontos[i].getY()-yd);
        }
        
        if(this.cor instanceof GradienteLinear){
        	var cx = this.cor.getX0()-xd;
        	var cy = this.cor.getY0()-yd;
        	this.cor.moverPara(cx,cy);
        }
    };

	this.inverterHorizontalMente = function() {
		for ( var index in this.pontos) {
			this.pontos[index].inverterHorizontalMente(this.centro);
			this.setMinAndMaxValues(this.pontos[index]);
		}
	};

	this.inverterVerticalmente = function() {
		for ( var index in this.pontos) {
			this.pontos[index].inverterVerticalmente(this.centro);
			this.setMinAndMaxValues(this.pontos[index]);
		}
	};

	this.getQuadradoCircunscrito = function() {
		var centro = new Ponto(this.centro.getX(), this.centro.getY());
		var largura = this.pontoMaximo.getX() - this.pontoMinimo.getX();
		var altura = this.pontoMaximo.getY() - this.pontoMinimo.getY();
		var caixa = new Retangulo(centro, largura, altura);
		return caixa;
	};
	
	this.atualizarCentro = function(){
		this.centro.setX((this.pontoMaximo.getX()+this.pontoMinimo.getX())/2);
		this.centro.setY((this.pontoMaximo.getY()+this.pontoMinimo.getY())/2);
	};

	this.getCentro = function() {
		return this.centro;
	};

	this.setAngulo = function(angulo, origem) {
		if (!isNaN(angulo)) {
			while (angulo > 360 || angulo < -360) {
				angulo = angulo % 360;
			}
			this.girar(this.angulo*-1, origem);
			this.girar(angulo, origem);
			this.angulo = angulo;
		}
	};

    this.getArea = function(){
        return this.getQuadradoCircunscrito().getArea();
    };


}
