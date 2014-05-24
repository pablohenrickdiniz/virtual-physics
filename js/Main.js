$(document).ready(function() {
	var universo = new Universo(new Ponto(300, 300), 600, 600);
	var bolaBranca = Fabrica.criarBolaBranca();
	var taco = Fabrica.criarTaco();
	var mesa = Fabrica.criarMesa();
	var centroBola = bolaBranca.getCentro();

	universo.addObjeto(mesa.norte);
	universo.addObjeto(mesa.leste);
	universo.addObjeto(mesa.sul);
	universo.addObjeto(mesa.oeste);
	universo.addObjeto(bolaBranca);
	universo.addObjeto(taco);

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
	reader.startRead();

	var vetorTaco = new Vetor(0, 0);
	var pontoP = new Ponto(0,0);
	var tx = 0;
	var ty = 0;
	taco.setVetor(vetorTaco);
	
	var pressed = false;
	$("#canvas").mousedown(function(){
		pressed = true;
		pontoP.setX(reader.getX());
		pontoP.setY(reader.getY());
		tx = taco.getCentro().getX();
		ty = taco.getCentro().getY();
		vx = vetorTaco.getX();
		vy = vetorTaco.getY();
	});
	
    $("#canvas").mouseup(function(){
    	pressed = false;
    	vetorTaco.normalizar();
		taco.moverPara(vetorTaco.getX(), vetorTaco.getY());
	});
	
	
	$("#canvas").mousemove(function() {
		if (!pressed) {
			var rx = reader.getX();
			var ry = reader.getY();
			var vxd = centroBola.getX() - rx;
			var vyd = centroBola.getY() - ry;
			vetorTaco.setX(vxd);
			vetorTaco.setY(vyd);
			taco.setAngulo(obterAngulo(vxd, vyd) + 180, centroBola);
		} else {
			vetorTaco.normalizar();
			var rx = reader.getX();
			var ry = reader.getY();
			var atual = new Ponto(rx, ry);
			
			var d = obterDistancia(atual, pontoP);
			if(d > 10){
				multiplicarVetor(vetorTaco, d);
				taco.moverPara(vetorTaco.getX(), vetorTaco.getY());
			}
			
		}
	});
	
	var matriz = new Matriz(3,4);
	matriz.load({
		0:{0:10,1:20,2:58,3:74},
		1:{0:33,1:12,2:47,3:36},
		2:{0:87,1:12,2:11,3:45}
	});
	console.log(matriz+"");
});
