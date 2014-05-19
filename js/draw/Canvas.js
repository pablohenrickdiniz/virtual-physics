/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
	console.log("criando canvas");
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
			this.contexto.fillStyle = arco.getCor();
			this.contexto.strokeStyle = arco.getBorda().getCor();
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
			this.contexto.fillStyle = poligono.getCor();
			this.contexto.beginPath();
			this.contexto.moveTo(pontos[0].getX(), pontos[0].getY());
			for (var i = 1; i < pontos.length; i++) {
				this.contexto.lineTo(pontos[i].getX(), pontos[i].getY());
			}
			this.contexto.closePath();
			this.contexto.fill();
			this.contexto.strokeStyle = poligono.getBorda().getCor();
			this.contexto.lineWidth = poligono.getBorda().getEspessura();
			this.contexto.stroke();
		}
	};

	this.limparTela = function() {
		var ponto = new Ponto(this.largura * 0.5, this.altura * 0.5);
		var quadrado = new Retangulo(ponto, this.largura, this.altura);
		quadrado.setCor('white');
		quadrado.getBorda().setCor('transparent');
		this.desenharPoligono(quadrado);
	};
}