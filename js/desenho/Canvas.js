/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
	this.canvas = canvas;
	this.largura = toInt($(canvas).css('width'));
	this.altura = toInt($(canvas).css('height'));
	this.contexto = $(canvas).get(0).getContext('2d');
	this.formasGeometricas = new Array();

	this.addFormaGeometrica = function(forma) {
		if (forma instanceof FormaGeometrica) {
			this.formasGeometricas[forma.getId()] = forma;
		}
	};

	this.desenharFormaGeometrica = function(formaGeometrica) {
	
		if (formaGeometrica instanceof Poligono) {
			this.desenharPoligono(formaGeometrica);
		} else if (formaGeometrica instanceof Circulo) {
			this.desenharCirculo(formaGeometrica);
		}
	};

	this.desenharCirculo = function(circulo) {
		if (circulo instanceof Circulo) {
			this.desenharArco(circulo);
		}
	};

	this.desenharArco = function(arco) {
		if (arco instanceof Arco) {
			this.contexto.fillStyle  =  this.preencher(arco.getCor());
			this.contexto.strokeStyle =  this.preencher(arco.getBorda().getCor());
			this.contexto.beginPath();
			this.contexto.arc(arco.getCentro().getX(), arco.getCentro().getY(),
					arco.getRaio(), Math.PI * arco.getAnguloInicial() / 180,
					Math.PI * arco.getAnguloFinal() / 180);
			this.contexto.fill();
			this.contexto.lineWidth = arco.getBorda().getEspessura();
			this.contexto.stroke();
		}
	};

	this.desenharPoligono = function(poligono) {
		if (poligono instanceof Poligono) {
			var pontos = poligono.getPontos();
			this.contexto.fillStyle =  this.preencher(poligono.getCor());
			this.contexto.beginPath();
			this.contexto.moveTo(pontos[0].getX(), pontos[0].getY());
			for ( var i = 1; i < pontos.length; i++) {
				this.contexto.lineTo(pontos[i].getX(), pontos[i].getY());
			}
			this.contexto.closePath();
			this.contexto.fill();
			this.contexto.strokeStyle =  this.preencher(poligono.getBorda().getCor());
			this.contexto.lineWidth = poligono.getBorda().getEspessura();
			this.contexto.stroke();
		}
	};
	
	this.desenhar = function(desenho){
		if(desenho instanceof Desenho){
			var formas = desenho.getFormas();
			for(var i = 0; i < formas.length;i++){
				this.desenharFormaGeometrica(formas[i]);
			}
		}
	};

	this.limparTela = function() {
		var ponto = new Ponto(this.largura * 0.5, this.altura * 0.5);
		var quadrado = new Retangulo(ponto, this.largura, this.altura);
		quadrado.setCor('white');
		quadrado.getBorda().setCor('transparent');
		this.desenharPoligono(quadrado);
	};

	this.desenharVetor = function(vetor, origem) {
		if (vetor instanceof Vetor) {
			this.contexto.strokeStyle =  this.preencher(vetor.getCor());
			this.contexto.beginPath();
			this.contexto.moveTo(origem.getX(), origem.getY());
			this.contexto.lineTo(origem.getX() + vetor.getX(), origem.getY()
					+ vetor.getY());
			this.contexto.stroke();
		}
	};

	this.criarGradienteLinear = function(gradiente) {
		var x0 = gradiente.getX0();
		var y0 = gradiente.getY0();
		var x1 = gradiente.getX1();
		var y1 = gradiente.getY1();
		var grad = this.contexto.createLinearGradient(x0, y0, x1, y1);
		var colorsStop = gradiente.getColorsStop();
		for ( var i = 0; i < colorsStop.length; i++) {
			grad.addColorStop(colorsStop[i][0],  this.preencher(colorsStop[i][1]));
		}
		return grad;
	};

	this.criarGradienteRadial = function(gradiente) {
		var x0 = gradiente.getX0();
		var y0 = gradiente.getY0();
		var x1 = gradiente.getX1();
		var y1 = gradiente.getY1();
		var r0 = gradiente.getR0();
		var r1 = gradiente.getR1();
		var grad = this.contexto.createRadialGradient(x0, y0, r0, x1, y1, r1);
		var colorsStop = gradiente.getColorsStop();
		for ( var i = 0; i < colorsStop.length; i++) {
			grad.addColorStop(colorsStop[i][0], this.preencher(colorsStop[i][1]));
		}
		return grad;
	};
	
	this.preencher = function(cor){
		if(cor instanceof Color){
			return cor.getHex();
		}
		else if(cor instanceof GradienteRadial){
			return this.criarGradienteRadial(cor);
		}
		else if(cor instanceof GradienteLinear){
			return this.criarGradienteLinear(cor);
		}
		return cor;
	};
}