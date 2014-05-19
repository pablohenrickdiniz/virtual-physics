$(document).ready(function() {
	var universo = new Universo(new Ponto(300, 300), 600, 600);
	var chao = new Objeto(new Retangulo(new Ponto(300, 300), 50, 400));
	var bola = new Objeto(new Circulo(new Ponto(400,400),30));
	// chao.static = true;
	chao.massa = 5000;
	universo.addObjeto(chao);
	universo.addObjeto(bola);
	var fps = 0.1;
	var count = 0;
	loop();
	function loop() {
		setTimeout(function() {
			requestAnimationFrame(loop);
			universo.step();
			count++;
		}, 1000 / fps);
	}

	setInterval(function() {
		console.log(count + "fps");
		count = 0;
	}, 1000);
	var reader = new MouseReader("#canvas");
	reader.startRead();
	
	
	$("#canvas").click(function() {
		var x = reader.getX();
		var y = reader.getY();

		var w = Math.ceil(Math.random() * 100);
		var h = Math.ceil(Math.random() * 100);
		var caixa = new Objeto(new Retangulo(new Ponto(x, y), w, h));
		caixa.dinamico = true;
		universo.addObjeto(caixa);
	});
});
