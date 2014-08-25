/*
$(document).ready(function() {
	var circulo = new Circle(new Ponto(100,100),30);
	

	var universo = new Universo(new Ponto(300, 300), 600, 600);
	var bolaBranca = Fabrica.criarBolaBranca();
	var taco = Fabrica.criarTaco();
	var mesa = Fabrica.criarMesa();
	var centroBola = bolaBranca.getCenter();
	
	bolaBranca.dinamico = true;
	universo.addObjeto(mesa.base);
    universo.addObjeto(mesa.c1);
    universo.addObjeto(mesa.c2);
    universo.addObjeto(mesa.c3);
    universo.addObjeto(mesa.c4);
    universo.addObjeto(mesa.c5);
    universo.addObjeto(mesa.c6);
	universo.addObjeto(bolaBranca);
	universo.addObjeto(taco);
	
	var tix = taco.getCenter().getX();
	var tiy = taco.getCenter().getY();
	var tia = taco.getDegree();
	var quad = taco.getContato().getCircumscribedSquare();

	var linha = Fabrica.criarLinha();
	var bola  = Fabrica.criarBola();
	bola.dinamico = true;
	universo.addObjeto(linha);
	universo.addObjeto(bola);

	var count = 0;
	loop();
	function loop() {
		setTimeout(function() {
			requestAnimationFrame(loop);
			universo.step();
			count++;
		}, 1000 / FPS);
	}

	setInterval(function() {
		console.log(count + "fps");
		count = 0;
	}, 1000);

	var reader = new MouseReader("#canvas");
	var readerSvg = new MouseReader("#svg");
	reader.startRead();
	readerSvg.startRead();
	
	var vetorTaco  = new Vector(0, 0);
	var vetorMouse = new Vector(0,0);
	var atual      = new Ponto(0,0);
	var pontoP = new Ponto(0,0);
	var tx = 0;
	var ty = 0;
	var ex = 0;
	var ey = 0;
	taco.setVector(vetorTaco);
	
	var pressed = false;
	$("#canvas").mousedown(function(){
		pressed = true;
		pontoP.setX(reader.getX());
		pontoP.setY(reader.getY());
		tx = taco.getCenter().getX();
		ty = taco.getCenter().getY();
	});
	
	$("#svg").mousedown(function(){
		pressed = true;
		pontoP.setX(readerSvg.getX());
		pontoP.setY(readerSvg.getY());
		tx = taco.getCenter().getX();
		ty = taco.getCenter().getY();
	});
	
    $("#canvas,#svg").mouseup(function(){
    	pressed = false;
    	bolaBranca.setVector(new Vector(vetorTaco.getX()*3, vetorTaco.getY()*3));
    	vetorTaco.normalizar();
    	taco.moveTo(tix,tiy);
    	taco.setDegree(tia);
	});
	
	$("#canvas").mousemove(function() {
		var rx = reader.getX();
		var ry = reader.getY();
		var vxd = centroBola.getX() - rx;
		var vyd = centroBola.getY() - ry;
		vetorMouse.setX(vxd);
		vetorMouse.setY(vyd);
		
		if (!pressed) {
			vetorTaco.setX(vxd);
			vetorTaco.setY(vyd);
			taco.setDegree(getDegree(vxd, vyd) + 180, centroBola);
		} else {
			vetorTaco.normalizar();
			atual.setX(rx);
			atual.setY(ry);
			var d = Ponto.distancia(atual, pontoP);
			var am = vetorMouse.getDegree();
			var at = vetorTaco.getDegree();
			if(d > 10 && am > at-20 && am < at+20){
				Vector.multiply(vetorTaco, d);
				ex = -vetorTaco.getX();
				ey = -vetorTaco.getY();
				taco.moveTo(tx+ex,ty+ey);
			}
			
		}
		
	});
	
	$("#svg").mousemove(function() {
		var rx = readerSvg.getX();
		var ry = readerSvg.getY();
		var vxd = centroBola.getX() - rx;
		var vyd = centroBola.getY() - ry;
		vetorMouse.setX(vxd);
		vetorMouse.setY(vyd);
		
		if (!pressed) {
			vetorTaco.setX(vxd);
			vetorTaco.setY(vyd);
			taco.setDegree(getDegree(vxd, vyd) + 180, centroBola);
		} else {
			vetorTaco.normalizar();
			atual.setX(rx);
			atual.setY(ry);
			var d = Ponto.distancia(atual, pontoP);
			var am = vetorMouse.getDegree();
			var at = vetorTaco.getDegree();
			if(d > 10 && am > at-20 && am < at+20){
				Vector.multiply(vetorTaco, d);
				ex = -vetorTaco.getX();
				ey = -vetorTaco.getY();
				taco.moveTo(tx+ex,ty+ey);
			}
			
		}
		
	});
});
*/