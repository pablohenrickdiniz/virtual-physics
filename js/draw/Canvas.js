/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
	if (document.getElementById(canvas) == null) {
		throw new TypeError('Element canvas doesn\'t exists');
	}
	this.canvas = canvas;
	this.width = MV.toInt($("#" + canvas).css('width'));
	this.height = MV.toInt($("#" + canvas).css('height'));
	this.context = $("#" + canvas).get(0).getContext('2d');

	if (!this.context.setLineDash) {
		this.context.setLineDash = function() {};
	}

	this.drawShape = function(shape) {
		if (shape instanceof Polygon) {
			this.drawPolygon(shape);
		} else if (shape instanceof Circle) {
			this.drawCircle(shape);
		} else if (shape instanceof Line) {
			this.drawLine(shape);
		}
	};

	this.drawCircle = function(circle) {
		if (circle instanceof Circle) {
			this.drawArc(circle);
		}
	};

	this.drawArc = function(arc) {
		if (arc instanceof Arc) {
			this.preencherSombra(arc.shadow);
			this.preencherForma(arc);
			this.context.beginPath();
			this.context.arc(arc.center[0], arc.center[1],
					arc.radius, Math.PI * arc.start / 180,
					Math.PI * arc.end / 180);
			this.context.fill();
			this.preencherBorda(arc.border);
		}
	};

	this.drawPolygon = function(polygon) {
		if (polygon instanceof Polygon) {
			this.preencherSombra(polygon.shadow);
			this.preencherForma(polygon);
			this.context.beginPath();
			this.context.moveTo(polygon.vertices[0][0],polygon.vertices[0][1]);
			for ( var i = 1; i < polygon.vertices.length; i++) {
				this.context.lineTo(polygon.vertices[i][0], polygon.vertices[i][1]);
			}
			this.context.closePath();
			this.context.fill();
			this.preencherBorda(polygon.border);
		}
	};


	this.clearScreen = function() {
		document.getElementById(this.canvas).width = 0;
        document.getElementById(this.canvas).height = 0;
        document.getElementById(this.canvas).width = this.width;
        document.getElementById(this.canvas).width = this.height;
	};
    /*
	this.fillGradient = function(shape) {
		var gradiente = shape.color;
		var grad = null;
		var quad = shape.getQuadradoCircunscrito();
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
			grad = this.context
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
			grad = this.context.createLinearGradient(x0, y0, x1, y1);
		}

		var colorsStop = gradiente.getColorsStop();
		for ( var i = 0; i < colorsStop.length; i++) {
			grad.addColorStop(colorsStop[i][0] / 100, this
					.preencherCor(colorsStop[i][1]));
		}
		return grad;
	};*/

	this.preencherCor = function(cor) {
		if (cor instanceof Color) {
			return cor.getRgba();
		}
		return cor;
	};

	this.preencherSombra = function(sombra) {
		this.context.save();
		if (sombra != null) {
			this.context.shadowOffsetX = sombra.getX();
			this.context.shadowOffsetY = sombra.getY();
			this.context.shadowBlur = sombra.getBlur();
			this.context.shadowColor = this.preencherCor(sombra.getCor());
		}
		this.context.fill();
		this.context.restore();
	};

	this.preencherBorda = function(borda) {
		this.context.setLineDash(borda.getLineDash());
		this.context.lineCap = borda.getLineCap();
		this.context.strokeStyle = this.preencherCor(borda.getCor());
		this.context.lineWidth = borda.getEspessura();
		this.context.stroke();
	};

	this.preencherForma = function(forma) {
		var cor = forma.getCor();
		if (cor instanceof GradienteLinear || cor instanceof GradienteRadial) {
			this.context.fillStyle = this.fillGradient(forma);
		} else if (cor instanceof Imagem) {
			this.context.fillStyle = cor.getFillPattern(this.context);
		} else {

			this.context.fillStyle = this.preencherCor(cor);
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
				this.context.drawImage(img,sx,sy,w,h,x, y,w,h);
				return true;
			}
		}
	};
}