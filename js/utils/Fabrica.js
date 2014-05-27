function Fabrica() {
}

Fabrica.criarTaco = function() {
	var sombra = new Sombra(5,5,5,"Gray");
	var tacoContato = new Poligono();
	var tacoForma = new Poligono();
	tacoForma.setSombra(sombra);
	tacoContato.addPonto(new Ponto(297, 312));
	tacoContato.addPonto(new Ponto(303, 312));
	tacoContato.addPonto(new Ponto(304, 850));
	tacoContato.addPonto(new Ponto(290, 850));
	tacoContato.atualizarCentro();

	tacoForma.addPonto(new Ponto(297, 312));
	tacoForma.addPonto(new Ponto(303, 312));
	tacoForma.addPonto(new Ponto(304, 850));
	tacoForma.addPonto(new Ponto(290, 850));
	tacoForma.atualizarCentro();
	tacoContato.getBorda().setCor('transparent');
	tacoContato.setCor('transparent');
	var ponta = new Retangulo(new Ponto(300, 320), 5, 15);
	ponta.setCor('black');
	var desenhoTaco = new Desenho(new Ponto(tacoForma.getCentro().getX(),
			tacoForma.getCentro().getY()));
	desenhoTaco.addForma(tacoForma);
	desenhoTaco.addForma(ponta);
	var taco = new Objeto(tacoContato, desenhoTaco);
	return taco;
};

Fabrica.criarBolaBranca = function() {
	var sombra = new Sombra(3,3,3,"Gray");
	var grdBola = new GradienteRadial(300, 300, 50, 250, 250, 60);
	grdBola.addColorStop(0.2, "Grey");
	grdBola.addColorStop(1, "White");

	var bolaForma = new Circulo(new Ponto(300, 300), 10);
	var quadForma = new Retangulo(new Ponto(300, 320), 20, 20);
	quadForma.setCor('transparent');
	// quadForma.getBorda().setLineDash([ 2, 2 ]);
	bolaForma.setCor(grdBola);
	bolaForma.setSombra(sombra);
	bolaForma.getBorda().setCor('Gray');

	var desenhoBola = new Desenho(new Ponto(bolaForma.getCentro().getX(),
			bolaForma.getCentro().getY()));
	desenhoBola.addForma(bolaForma);
	var bolaContato = new Circulo(new Ponto(300, 300), 10);
	bolaContato.setCor('transparent');
	bolaContato.getBorda().setCor('transparent');
	var bolaBranca = new Objeto(bolaContato, desenhoBola);
	return bolaBranca;
};

Fabrica.criarMesa = function() {
	var basec = new Retangulo(new Ponto(562.5,300),1125,600);
	basec.setCor('transparent');
	var basef = new Retangulo(new Ponto(562.5,300),1125,600);
	basef.setCor('SpringGreen');
	var based = new Desenho();
	based.addForma(basef);
	
	var c1tf = new Trapezio(new Ponto(295, 35), 460, 500, 20);
	var c1qf = new Retangulo(new Ponto(295, 10), 500, 30);
	var c1tc = new Trapezio(new Ponto(295, 35), 460, 500, 20);

	var tc = new Color('MedSpringGreen');
	var c1d = new Desenho();
	c1d.addForma(c1tf);
	c1d.addForma(c1qf);

	var c2tf = new Trapezio(new Ponto(825, 35), 460, 500, 20);
	var c2qf = new Retangulo(new Ponto(825, 10), 500, 30);
	var c2tc = new Trapezio(new Ponto(825, 35), 460, 500, 20);

	var c2d = new Desenho();
	c2d.addForma(c2tf);
	c2d.addForma(c2qf);

	var c3tf = new Trapezio(new Ponto(1090, 300), 460, 500, 20);
	var c3qf = new Retangulo(new Ponto(1115, 300), 500, 30);
	var c3tc = new Trapezio(new Ponto(1090, 300), 460, 500, 20);

	c3qf.setAngulo(90);
	c3tf.setAngulo(90);
	c3tc.setAngulo(90);
	var c3d = new Desenho();
	c3d.addForma(c3tf);
	c3d.addForma(c3qf);

	var c4tf = new Trapezio(new Ponto(825, 565), 500,460, 20);
	var c4qf = new Retangulo(new Ponto(825, 590), 500, 30);
	var c4tc = new Trapezio(new Ponto(825, 565), 500,460, 20);
	var c4d = new Desenho();
	c4d.addForma(c4tf);
	c4d.addForma(c4qf);
	
	var c5tf = new Trapezio(new Ponto(295, 565), 500,460, 20);
	var c5qf = new Retangulo(new Ponto(295, 590), 500, 30);
	var c5tc = new Trapezio(new Ponto(295, 565), 500,460, 20);

	var c5d = new Desenho();
	c5d.addForma(c5tf);
	c5d.addForma(c5qf);
	
	var c6tf = new Trapezio(new Ponto(35, 300), 460, 500, 20);
	var c6qf = new Retangulo(new Ponto(10, 300), 500, 30);
	var c6tc = new Trapezio(new Ponto(35, 300), 460, 500, 20);

	c6qf.setAngulo(-90);
	c6tf.setAngulo(-90);
	c6tc.setAngulo(-90);
	var c6d = new Desenho();
	c6d.addForma(c6tf);
	c6d.addForma(c6qf);
	
	

	c1tf.setSombra(new Sombra(3,3,3,"#AABBAA"));
	c1tf.setCor(tc);
	c1tf.getBorda().setCor('transparent');
	c1tc.setCor('transparent');
	c1qf.setCor('Brown');
	c2tf.setSombra(new Sombra(3,3,3,"#AABBAA"));
	c2tf.setCor(tc);
	c2tf.getBorda().setCor('transparent');
	c2tc.setCor('transparent');
	c2qf.setCor('Brown');
	c3tf.setSombra(new Sombra(-3,3,3,"#AABBAA"));
    c3tf.setCor(tc);
	c3tf.getBorda().setCor('transparent');
	c3tc.setCor('transparent');
	c3qf.setCor('Brown');
	c4tf.setSombra(new Sombra(-3,-3,3,"#AABBAA"));
	c4tf.setCor(tc);
	c4tf.getBorda().setCor('transparent');
	c4tc.setCor('transparent');
	c4qf.setCor('Brown');
	c5tf.setSombra(new Sombra(-3,-3,3,"#AABBAA"));
	c5tf.setCor(tc);
	c5tf.getBorda().setCor('transparent');
	c5tc.setCor('transparent');
	c5qf.setCor('Brown');
	c6tf.setSombra(new Sombra(3,3,3,"#AABBAA"));
	c6tf.setCor(tc);
	c6tf.getBorda().setCor('transparent');
	c6tc.setCor('transparent');
	c6qf.setCor('Brown');
	
	var c1 = new Objeto(c1tc, c1d);
	var c2 = new Objeto(c2tc, c2d);
	var c3 = new Objeto(c3tc, c3d);
	var c4 = new Objeto(c4tc, c4d);
	var c5 = new Objeto(c5tc, c5d);
	var c6 = new Objeto(c6tc, c6d);
	var base = new Objeto(basec, based);
	var mesa = {
	    base:base,
		c1 : c1,
		c2 : c2,
		c3 : c3,
	    c4:c4,
	    c5:c5,
	    c6:c6
	};

	return mesa;
};