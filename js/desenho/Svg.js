function Svg(svg){
	if(document.getElementById(svg) == null){
		throw new TypeError('Elemento svg não existe');
	}
	this.svg = svg;
	this.largura = toInt($("#"+svg).css('width'));
	this.altura = toInt($("#"+svg).css('height'));
	
	this.desenharFormaGeometrica = function(formaGeometrica) {
		if (formaGeometrica instanceof Poligono) {
			this.desenharPoligono(formaGeometrica);
		} else if (formaGeometrica instanceof Circulo) {
			this.desenharCirculo(formaGeometrica);
		}
		else if(formaGeometrica instanceof Reta){
			this.desenharReta(formaGeometrica);
		}
	};

	this.desenharCirculo = function(circulo) {
		if (circulo instanceof Circulo) {
			var circle = document.getElementById(circulo.getId());
			if(circle == null){
				circle = document.createElementNS("http://www.w3.org/2000/svg",'circle');
				$(circle).prop("id", circulo.getId());
				$(this.svg).append(circle);
			}
			$(circle).attr("cx", circulo.getCentro().getX());
			$(circle).attr("cy", circulo.getCentro().getY());
			$(circle).attr("r", circulo.getRaio());
			$(circle).attr("fill", this.preencherForma(circulo));
			this.preencherBorda(circle,circulo.getBorda());
			/*var sombra = circulo.getSombra();
			if(sombra != null){
				$(circle).attr('filter',this.preencherSombra(sombra));
			}*/
		}
	};

	this.desenharArco = function(arco) {
		if (arco instanceof Arco) {
			
		}
	};
	
	this.desenharReta = function(reta){
		if(reta instanceof Reta){
			var line = document.getElementById(reta.getId());
			if(line == null){
				line = document.createElementNS("http://www.w3.org/2000/svg",'line');
				$(line).prop("id", reta.getId());
				$(this.svg).append(line);
			}
			
			$(line).attr("fill", reta.getCor());
			this.preencherBorda(line, reta.getBorda());
		}
	};
	
	
	this.desenharPoligono = function(poligono) {
		if(poligono instanceof Poligono) {
			var polygon = document.getElementById(poligono.getId());
			if(polygon == null){
				polygon = document.createElementNS("http://www.w3.org/2000/svg",'polygon');
				$(polygon).prop("id", poligono.getId());
				$(this.svg).append(polygon);
			}
			
			var pontos = poligono.getPontos();
			var pts    = "";
			for(var i = 0; i < pontos.length;i++){
				var x = pontos[i].getX();
				var y = pontos[i].getY();
				pts += (x+","+y+" ");
			}
			$(polygon).attr("points",pts);
			$(polygon).attr("fill", this.preencherForma(poligono));
			this.preencherBorda(polygon, poligono.getBorda());
			/*var sombra = poligono.getSombra();
			if(sombra != null){
				$(polygon).attr('filter',this.preencherSombra(sombra));
			}*/
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
	
	
	this.desenharPonto = function(ponto) {
		if (ponto instanceof Ponto) {
		
		}
	};
	
	this.preencherCor = function(cor) {
		if (cor instanceof Color) {
			return cor.getRgba();
		}
		return cor;
	};
	
	this.preencherForma = function(forma) {
		var cor = forma.getCor();
		if (cor instanceof GradienteLinear || cor instanceof GradienteRadial) {
			return this.preencherGradiente(forma);
		} else {
			return this.preencherCor(cor);
		}
	};
	
	this.preencherGradiente = function(forma) {
		var gradiente = forma.getCor();
		var quad = forma.getQuadradoCircunscrito();
		
		var id = gradiente.getId();
		var gradienteElement = document.getElementById(id);
		if(gradienteElement == null){
			
			if (gradiente instanceof GradienteRadial) {
				gradienteElement = document.createElementNS("http://www.w3.org/2000/svg",'radialGradient');
				var r= gradiente.getR();
				var cx = gradiente.getCx();
				var cy = gradiente.getCy();
				var fx = gradiente.getFx();
				var fy = gradiente.getFy();
				$(gradienteElement).attr("cx",cx+"%");
				$(gradienteElement).attr("cy",cy+"%");
				$(gradienteElement).attr("fx",fx+"%");
				$(gradienteElement).attr("fy",fy+"%");
				$(gradienteElement).attr("r",r+"%");
				
			} else {
				gradienteElement = document.createElementNS("http://www.w3.org/2000/svg",'linearGradient');
				var x1 = gradiente.getPx0();
				var y1 = gradiente.getPy0();
				var x2 = gradiente.getPx1();
				var y2 = gradiente.getPy1();
				$(gradienteElement).attr("x1",x1+"%");
				$(gradienteElement).attr("y1",y1+"%");
				$(gradienteElement).attr("x2",x2+"%");
				$(gradienteElement).attr("y2",y2+"%");
				
			}
			$(gradienteElement).prop('id',id);
			var colorsStop = gradiente.getColorsStop();
			for ( var i = 0; i < colorsStop.length; i++) {
				var stop = document.createElementNS("http://www.w3.org/2000/svg",'stop');
				$(stop).attr('stop-color',this.preencherCor(colorsStop[i][1]));
				$(stop).attr('offset',colorsStop[i][0]+"%");
				$(gradienteElement).append(stop);
			}
			
			$(this.svg).append(gradienteElement);
		}
		
		return "url(#"+id+")";
	};
	
	this.preencherBorda = function(element, borda){
		$(element).attr("stroke", borda.getCor());
		$(element).attr("stroke-width", borda.getEspessura());
		
		var lineCap = borda.getLineCap();
		if(lineCap != 'butt'){
			$(element).attr("stroke-linecap",lineCap);
		}
		var dash = borda.getLineDash();
		if(dash.length > 0){
			$(element).attr("stroke-dasharray",dash.join());
		}
	};
	
	this.preencherSombra = function(sombra){
		var id = sombra.getId();
		var filter = document.getElementById(id);
		
		if(filter == null){
			filter = document.createElement('filter');
			var feoffset = document.createElement('feOffset');
			var fegaussianblur = document.createElement('feGaussianBlur');
			var femerge        = document.createElement('feMerge');
			var femergenode1   = document.createElement('feMergeNode');
			var femergenode2    = document.createElement('feMergeNode');
			
			
			var dx = sombra.getX();
			var dy = sombra.getY();
			
			$(femergenode2).attr('in','SourceGraphic');
			$(femerge).append(femergenode1);
			$(femerge).append(femergenode2);
			$(fegaussianblur).attr('in','SourceAlpha');
			$(fegaussianblur).attr('stdDeviation',3);
			$(filter).prop('id',id);
			$(filter).attr('width','150%');
			$(filter).attr('height','150%');
			$(feoffset).attr('result','offsetblur');
			$(feoffset).attr('dx',dx);
			$(feoffset).attr('dy',dy);
			$(filter).append(feoffset);
			$(filter).append(fegaussianblur);
			$(filter).append(femerge);
			var defs = document.getElementById("defs");
			if(defs == null){
				defs = document.createElement('defs');
				$(defs).prop('id','defs');
				$(this.svg).append(defs);
			}
			$(defs).append(filter);
		}
		return "url(#"+id+")";
	};
}

