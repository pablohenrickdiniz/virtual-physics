$(document).ready(function() {
	var universo = new Universo(new Ponto(300, 300), 600, 600);
    var bolaBranca = new Objeto(new Circulo(new Ponto(300,300),10));
    var ladoCima      = new Objeto(new Retangulo(new Ponto(300,11),598,20));
    var ladoDireito   = new Objeto(new Retangulo(new Ponto(588,300),21,598));
    var ladoBaixo     = new Objeto(new Retangulo(new Ponto(300,588),598,21));
    var ladoEsquerdo   = new Objeto(new Retangulo(new Ponto(12,300),21,598));




    var tacoForma = new Poligono();
    console.log(tacoForma);
    tacoForma.addPonto(new Ponto(297,312));
    tacoForma.addPonto(new Ponto(303,312));
    tacoForma.addPonto(new Ponto(307,620));
    tacoForma.addPonto(new Ponto(293,620));

    var taco = new Objeto(tacoForma);


    ladoCima.getForma().setCor('#00FF00');
    ladoCima.getForma().getBorda().setCor('transparent');
    ladoDireito.getForma().setCor('#00FF00');
    ladoDireito.getForma().getBorda().setCor('transparent');
    ladoBaixo.getForma().setCor('#00FF00');
    ladoBaixo.getForma().getBorda().setCor('transparent');
    ladoEsquerdo.getForma().setCor('#00FF00');
    ladoEsquerdo.getForma().getBorda().setCor('transparent');


    universo.addObjeto(ladoCima);
    universo.addObjeto(ladoDireito);
    universo.addObjeto(ladoBaixo);
    universo.addObjeto(ladoEsquerdo);
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


	$("#canvas").click(function() {
		var x = reader.getX();
		var y = reader.getY();


	});





});
