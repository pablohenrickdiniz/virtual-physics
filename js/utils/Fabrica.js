function Fabrica() {
}

Fabrica.criarTaco = function() {
	var tacoContato = new Poligono();
	var tacoForma = new Poligono();
	tacoContato.addPonto(new Ponto(297, 312));
	tacoContato.addPonto(new Ponto(303, 312));
	tacoContato.addPonto(new Ponto(307, 620));
	tacoContato.addPonto(new Ponto(293, 620));
	tacoContato.atualizarCentro();

	tacoForma.addPonto(new Ponto(297, 312));
	tacoForma.addPonto(new Ponto(303, 312));
	tacoForma.addPonto(new Ponto(307, 620));
	tacoForma.addPonto(new Ponto(293, 620));
	tacoForma.atualizarCentro();
	tacoContato.getBorda().setLineDash([ 5, 5 ]);

	var tacoListra = new Retangulo(tacoForma.getCentro(), 30, 30);
	tacoListra.setCor('black');
	var desenhoTaco = new Desenho(new Ponto(tacoForma.getCentro().getX(),
			tacoForma.getCentro().getY()));
	desenhoTaco.addForma(tacoForma);
	var taco = new Objeto(tacoContato, desenhoTaco);
	return taco;
};

Fabrica.criarBolaBranca = function() {
	var grdBola = new GradienteRadial(300, 300, 50, 250, 250, 60);
	grdBola.addColorStop(0.2, "Grey");
	grdBola.addColorStop(1, "White");

	var bolaForma = new Circulo(new Ponto(300, 300), 10);
	var quadForma = new Retangulo(new Ponto(300, 320), 20, 20);
	quadForma.setCor('transparent');
	quadForma.getBorda().setLineDash([ 2, 2 ]);
	bolaForma.setCor(grdBola);
	bolaForma.getBorda().setCor('Gray');
	var desenhoBola = new Desenho(new Ponto(bolaForma.getCentro().getX(),
			bolaForma.getCentro().getY()));
	desenhoBola.addForma(bolaForma);
	var bolaContato = new Circulo(new Ponto(300, 300), 10);
	bolaContato.setCor('transparent');
	bolaContato.getBorda().setLineDash([ 5, 5 ]);
	var bolaBranca = new Objeto(bolaContato, desenhoBola);
	return bolaBranca;
};

Fabrica.criarMesa = function() {
	var cor = new Color("MedSpringGreen");
	var norteForma = new Retangulo(new Ponto(300, 11), 598, 20);
	var lesteForma = new Retangulo(new Ponto(590, 300), 20, 598);
	var sulForma = new Retangulo(new Ponto(300, 588), 598, 21);
	var oesteForma = new Retangulo(new Ponto(10, 300), 20, 598);
	var norteContato = new Retangulo(new Ponto(300, 11), 598, 20);
	var lesteContato = new Retangulo(new Ponto(590, 300), 20, 598);
	var sulContato = new Retangulo(new Ponto(300, 588), 598, 20);
	var oesteContato = new Retangulo(new Ponto(10, 300), 20, 598);
	var cor = new Color("MedSpringGreen");
	norteContato.setCor('transparent');
	norteContato.getBorda().setCor('transparent');
	lesteContato.setCor('transparent');
	lesteContato.getBorda().setCor('transparent');
	sulContato.setCor('transparent');
	sulContato.getBorda().setCor('transparent');
	oesteContato.setCor('transparent');
	oesteContato.getBorda().setCor('transparent');
	norteForma.setCor(cor);
	lesteForma.setCor(cor);
	sulForma.setCor(cor);
	oesteForma.setCor(cor);
	norteForma.getBorda().setCor('transparent');
	lesteForma.getBorda().setCor('transparent');
	sulForma.getBorda().setCor('transparent');
	oesteForma.getBorda().setCor('transparent');

	var norteDesenho = new Desenho(new Ponto(norteForma.getCentro().getX(),
			norteForma.getCentro().getY()));
	norteDesenho.addForma(norteForma);
	var lesteDesenho = new Desenho(new Ponto(lesteForma.getCentro().getX(),
			lesteForma.getCentro().getY()));
	lesteDesenho.addForma(lesteForma);
	var sulDesenho = new Desenho(new Ponto(sulForma.getCentro().getX(),
			sulForma.getCentro().getY()));
	sulDesenho.addForma(sulForma);
	var oesteDesenho = new Desenho(new Ponto(oesteForma.getCentro().getX(),
			oesteForma.getCentro().getY()));
	oesteDesenho.addForma(oesteForma);
	var norte = new Objeto(norteContato, norteDesenho);
	var leste = new Objeto(lesteContato, lesteDesenho);
	var sul = new Objeto(sulContato, sulDesenho);
	var oeste = new Objeto(oesteContato, oesteDesenho);

	var obj = {
		norte : norte,
		sul : sul,
		leste : leste,
		oeste : oeste
	};
	return obj;
};