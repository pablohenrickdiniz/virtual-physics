/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
	if (document.getElementById(canvas) == null) {
		throw new TypeError('Elemento canvas não existe');
	}
	this.canvas = canvas;
	this.largura = toInt($("#" + canvas).css('width'));
	this.altura = toInt($("#" + canvas).css('height'));
	this.contexto = $("#" + canvas).get(0).getContext('2d');

	if (!this.contexto.setLineDash) {
		this.contexto.setLineDash = function() {
		};
	}

	this.desenharFormaGeometrica = function(formaGeometrica) {
		if (formaGeometrica instanceof Poligono) {
			this.desenharPoligono(formaGeometrica);
		} else if (formaGeometrica instanceof Circulo) {
			this.desenharCirculo(formaGeometrica);
		} else if (formaGeometrica instanceof Reta) {
			this.desenharReta(formaGeometrica);
		}
	};

	this.desenharCirculo = function(circulo) {
		if (circulo instanceof Circulo) {
			this.desenharArco(circulo);
		}
	};

	this.desenharArco = function(arco) {
		if (arco instanceof Arco) {
			this.preencherSombra(arco.getSombra());
			this.preencherForma(arco);
			this.contexto.beginPath();
			this.contexto.arc(arco.getCentro().getX(), arco.getCentro().getY(),
					arco.getRaio(), Math.PI * arco.getAnguloInicial() / 180,
					Math.PI * arco.getAnguloFinal() / 180);
			this.contexto.fill();
			this.preencherBorda(arco.getBorda());
		}
	};

	this.desenharReta = function(reta) {
		if (reta instanceof Reta) {
			this.preencherSombra(reta.getSombra());
			this.contexto.beginPath();
			this.contexto.moveTo(reta.getPontoA().getX(), reta.getPontoA()
					.getY());
			this.contexto.lineTo(reta.getPontoB().getX(), reta.getPontoB()
					.getY());
			this.preencherBorda(reta.getBorda());
		}
	};

	this.desenharPoligono = function(poligono) {
		if (poligono instanceof Poligono) {
			var pontos = poligono.getPontos();
			this.preencherSombra(poligono.getSombra());
			this.preencherForma(poligono);
			this.contexto.beginPath();
			this.contexto.moveTo(pontos[0].getX(), pontos[0].getY());
			for ( var i = 1; i < pontos.length; i++) {
				this.contexto.lineTo(pontos[i].getX(), pontos[i].getY());
			}
			this.contexto.closePath();
			this.contexto.fill();
			this.preencherBorda(poligono.getBorda());
		}
	};

	this.desenhar = function(desenho) {
		if (desenho instanceof Desenho) {
			var formas = desenho.getFormas();
			for ( var i = 0; i < formas.length; i++) {
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

	this.desenharPonto = function(ponto) {
		if (ponto instanceof Ponto) {
			this.contexto.strokeStyle = 'black';
			this.contexto.beginPath();
			this.contexto.moveTo(ponto.getX(), ponto.getY());
			this.contexto.lineTo(ponto.getX() + ponto.getX(), ponto.getY()
					+ ponto.getY());
			this.contexto.stroke();
		}
	};

	this.preencherGradiente = function(forma) {
		var gradiente = forma.getCor();
		var grad = null;
		var quad = forma.getQuadradoCircunscrito();
		var cx = quad.getCentro().getX();
		var cy = quad.getCentro().getY();
		var w = quad.getLargura();
		var h = quad.getAltura();
		if (gradiente instanceof GradienteRadial) {
			var r = gradiente.getR();
			var gcx = gradiente.getCx();
			var gcy = gradiente.getCy();
			var fx = gradiente.getFx();
			var fy = gradiente.getFy();

			var gxp = (cx - w / 2) + w * (gcx / 100);
			var gyp = (cy - h / 2) + h * (gcy / 100);
			var fxp = (cx - w / 2) + w * (fx / 100);
			var fyp = (cy - h / 2) + h * (fy / 100);
			var rp = w * (r / 100);
			grad = this.contexto
					.createRadialGradient(fxp, fyp, 0, gxp, gyp, rp);
		} else {
			var px0 = gradiente.getPx0();
			var py0 = gradiente.getPy0();
			var px1 = gradiente.getPx1();
			var py1 = gradiente.getPy1();
			var x0 = (cx - w / 2) + w * (px0 / 100);
			var y0 = (cy - h / 2) + h * (py0 / 100);
			var x1 = (cx - w / 2) + w * (px1 / 100);
			var y1 = (cy - h / 2) + h * (py1 / 100);
			grad = this.contexto.createLinearGradient(x0, y0, x1, y1);
		}

		var colorsStop = gradiente.getColorsStop();
		for ( var i = 0; i < colorsStop.length; i++) {
			grad.addColorStop(colorsStop[i][0] / 100, this
					.preencherCor(colorsStop[i][1]));
		}
		return grad;
	};

	this.preencherCor = function(cor) {
		if (cor instanceof Color) {
			return cor.getRgba();
		}
		return cor;
	};

	this.preencherSombra = function(sombra) {
		this.contexto.save();
		if (sombra != null) {
			this.contexto.shadowOffsetX = sombra.getX();
			this.contexto.shadowOffsetY = sombra.getY();
			this.contexto.shadowBlur = sombra.getBlur();
			this.contexto.shadowColor = this.preencherCor(sombra.getCor());
		}
		this.contexto.fill();
		this.contexto.restore();
	};

	this.preencherBorda = function(borda) {
		this.contexto.setLineDash(borda.getLineDash());
		this.contexto.lineCap = borda.getLineCap();
		this.contexto.strokeStyle = this.preencherCor(borda.getCor());
		this.contexto.lineWidth = borda.getEspessura();
		this.contexto.stroke();
	};

	this.preencherForma = function(forma) {
		var cor = forma.getCor();
		if (cor instanceof GradienteLinear || cor instanceof GradienteRadial) {
			this.contexto.fillStyle = this.preencherGradiente(forma);
		} else if (cor instanceof Imagem) {
			this.contexto.fillStyle = cor.getFillPattern(this.contexto);
		} else {

			this.contexto.fillStyle = this.preencherCor(cor);
		}
	};

	this.desenharImagem = function(imagem) {
		if (imagem instanceof Imagem) {
			var id = imagem.getId();
			if (imagem.isCarregada()) {
				var img = imagem.getElement();
				var w = imagem.getWidth();
				var h = imagem.getHeight();
				var sx = imagem.getSx();
				var sy = imagem.getSy();
				var x = imagem.getX();
				var y = imagem.getY();
				console.log(" w: "+w+"\n h:"+h+"\n x:"+x+"\n y:"+y);
				this.contexto.drawImage(img,sx,sy,w,h,x, y,w,h);
				return true;
			}
		}
	};
}