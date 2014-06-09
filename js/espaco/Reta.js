Reta.prototype = new FormaGeometrica();

function Reta(pontoA, pontoB){
	this.pontoA = !(pontoA instanceof Ponto)?new Ponto(0,0):pontoA;
	this.pontoB = !(pontoB instanceof Ponto)?new Ponto(0,0):pontoB;
	FormaGeometrica.call(this, this.getCentro(), new Color(0,0,0), undefined, 0);
	this.angulo = null;
	this.getCentro = function() {
		if (this.centro == null) {
			this.centro = Ponto.medio(this.pontoA, this.pontoB);
		}
		return this.centro;
	};

	this.getTamanho = function() {
		if (isNaN(this.tamanho)) {
			this.tamanho = Ponto.distancia(this.pontoA, this.pontoB);
		}
		return this.tamanho;
	};
	
	this.getArea = function(){
		return this.getTamanho();
	};

	this.setPontoA = function(pontoA) {
		this.pontoA = pontoA;
		this.tamanho = null;
		this.centro = null;
		this.angulo = null;
	};

	this.setPontoB = function(pontoB) {
		this.pontoB = pontoB;
		this.tamanho = null;
		this.centro = null;
		this.angulo = null;
	};

	this.getPontoA = function() {
		return this.pontoA;
	};

	this.getPontoB = function() {
		return this.pontoB;
	};
	
	this.getAngulo = function(){
		if(this.angulo == null){
			var pax = this.pontoA.getX();
			var pay = this.pontoA.getY();
			var pbx = this.pontoB.getX();
			var pby = this.pontoB.getY();
			this.angulo = obterAngulo(pbx-pax,pby-pay);
		}
		return this.angulo;
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
			
			this.pontoA.girar(graus,origem);
			this.pontoB.girar(graus,origem);
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
       
        this.pontoA.setX(this.pontoA.getX()-xd);
        this.pontoA.setY(this.pontoA.getY()-yd);
        this.pontoB.setX(this.pontoA.getX()-xd);
        this.pontoB.setY(this.pontoA.getY()-yd);
        
        if(this.cor instanceof GradienteLinear){
        	var cx = this.cor.getX0()-xd;
        	var cy = this.cor.getY0()-yd;
        	this.cor.moverPara(cx,cy);
        }
    };
    
    this.transladar = function(x,y){
        x = isNaN(x)?0:x;
        y = isNaN(y)?0:y;

        this.pontosA.setX(this.pontos[i].getX()+x);
        this.pontosA.setY(this.pontos[i].getY()+y);
        this.pontosB.setX(this.pontos[i].getX()+x);
        this.pontosB.setY(this.pontos[i].getY()+y);
        
        this.centro.setX(this.centro.getX()+x);
        this.centro.setY(this.centro.getY()+y);
        if(this.cor instanceof GradienteLinear){
        	this.cor.transladar(x,y);
        }
    };
    
	this.inverterHorizontalmente = function() {
		this.pontoA.inverterHorizontalmente(this.centro);
		this.pontoB.inverterVerticalmente(this.centro);
	};

	this.inverterVerticalmente = function() {
		this.pontoA.inverterHorizontalmente(this.centro);
		this.pontoB.inverterVerticalmente(this.centro);
	};
	
	this.setEspessura = function(espessura){
		if(!isNaN(espessura) && espessura > 0){
			this.espessura = espesura;
		}
	};
	
	this.getAngulo = function(){
		if(this.angulo == null){
			var x = pontoB.getX()-pontoA.getX();
			var y = pontoB.getY()-pontoA.getY();
			this.angulo = obterAngulo(x,y);
		}
		return this.angulo;
	};
}