Arco.prototype = new FormaGeometrica();

function Arco(centro, raio, anguloInicial, anguloFinal) {
	FormaGeometrica.call(this, centro, 'white', new Borda('black', 1), 0);
	this.raio = isNaN(raio) ? 10 : raio;
	anguloInicial = isNaN(anguloInicial) ? this.angulo : anguloInicial;
	anguloFinal = isNaN(anguloFinal) ? this.angulo+180 : anguloFinal;

	while (anguloInicial > 360) {
		anguloInicial = anguloInicial % 360;
	}

	while (this.anguloFinal > 360) {
		anguloFinal = anguloFinal % 360;
	}
	
	this.anguloInicial = anguloInicial;
	this.anguloFinal   = anguloFinal;

	this.getRaio = function() {
		return this.raio;
	};

	this.getAnguloInicial = function() {
		return this.anguloInicial;
	};

	this.getAnguloFinal = function() {
		return this.anguloFinal;
	};

	this.setAnguloInicial = function(anguloInicial) {
		if (!isNaN(anguloInicial)) {
			while (anguloInicial > 360) {
				anguloInicial = anguloInicial % 360;
			}
			this.anguloInicial = this.angulo+anguloInicial;
		}
	};

	this.setAnguloFinal = function(anguloFinal) {
		if (!isNaN(anguloFinal)) {
			while (angulo > 360) {
				anguloFinal = anguloFinal % 360;
			}
			this.anguloFinal = this.angulo+anguloFinal;
		}
	};

	this.setRaio = function(raio) {
		if (!isNaN(raio)) {
			this.raio = raio;
		}
	};
	
	this.moverPara = function(x, y){
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
        
        if(this.cor instanceof GradienteLinear){
        	var cx = this.cor.getX0()-xd;
        	var cy = this.cor.getY0()-yd;
        }
	};
	
	this.transladar = function(x,y){
	    x = isNaN(x)?0:x;
	    y = isNaN(y)?0:y;
	    this.centro.setX(this.centro.getX()+x);
	    this.centro.setY(this.centro.getY()+y);
	};
	
	this.setAngulo = function(angulo, origem) {
		if (!isNaN(angulo)) {
			while (angulo > 360 || angulo < -360) {
				angulo = angulo % 360;
			}
			this.girar(this.angulo*-1, origem);
			this.girar(angulo, origem);
			var anguloInicial = this.anguloInicial - this.angulo;
			var anguloFinal   = this.anguloFinal   - this.angulo;
			this.angulo = angulo;
			this.anguloInicial = anguloInicial+this.angulo;
			this.anguloFinal   = anguloFinal  +this.angulo;
		}
	};
	
	this.girar = function(graus, origem) {
		if (!isNaN(graus)) {
			while (graus > 360) {
				graus = graus % 360;
			}
			if(origem instanceof Ponto){
				this.centro.girar(graus,origem);
			}
		}
	};
}


function filtrarAngulo(angulo){
	while(angulo > 360){
		angulo = angulo % 360;
	}
	return angulo;
}