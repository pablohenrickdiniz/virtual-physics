function Fabrica() {
}

Fabrica.criarTaco = function() {
	var tacoContato = new Polygon();
	var tacoForma = new Polygon();
	tacoContato.addPoint(new Ponto(297, 312));
	tacoContato.addPoint(new Ponto(303, 312));
	tacoContato.addPoint(new Ponto(304, 850));
	tacoContato.addPoint(new Ponto(290, 850));
	tacoContato.updateCenter();

	tacoForma.addPoint(new Ponto(297, 312));
	tacoForma.addPoint(new Ponto(303, 312));
	tacoForma.addPoint(new Ponto(304, 850));
	tacoForma.addPoint(new Ponto(290, 850));
	tacoForma.updateCenter();
	
	var ponta = new Retangulo(new Ponto(300, 320), 5, 15);
	ponta.setCor('black');
	var desenhoTaco = new Drawing(new Ponto(tacoForma.getCenter().getX(),
			tacoForma.getCenter().getY()));
	desenhoTaco.addForma(tacoForma);
	desenhoTaco.addForma(ponta);
	var taco = new Objeto(tacoContato, desenhoTaco);
	return taco;
};

Fabrica.criarBolaBranca = function() {
	//var sombra = new Sombra(3,3,3,"Gray");
	var grdBola = new RadialGradient(50,50,100,100,100);
	grdBola.addColorStop(0, "White");
	grdBola.addColorStop(50, "Grey");

	var bolaForma = new Circle(new Ponto(300, 300), 10);
	bolaForma.setCor(grdBola);
	//bolaForma.setSombra(sombra);
	bolaForma.getBorda().setCor('Gray');
	bolaForma.getBorda().setLineDash([5,3]);
	bolaForma.getBorda().setLineCap(Border.ROUND);

	var desenhoBola = new Drawing(new Ponto(bolaForma.getCenter().getX(),
			bolaForma.getCenter().getY()));
	desenhoBola.addForma(bolaForma);
	var bolaContato = new Circle(new Ponto(300, 300), 10);
	var bolaBranca = new Objeto(bolaContato, desenhoBola);
	return bolaBranca;
};

Fabrica.criarMesa = function() {
	var basec = new Retangulo(new Ponto(562.5,300),1125,600);
	var basef = new Retangulo(new Ponto(562.5,300),1125,600);
	basef.setCor('SpringGreen');
	var based = new Drawing();
	based.addForma(basef);
	
	var c1tf = new Trapezius(new Ponto(295, 35), 460, 500, 20);
	var c1qf = new Retangulo(new Ponto(295, 10), 500, 30);
	var c1tc = new Trapezius(new Ponto(295, 35), 460, 500, 20);

	var tc = new Color('MedSpringGreen');
	var c1d = new Drawing();
	c1d.addForma(c1tf);
	c1d.addForma(c1qf);

	var c2tf = new Trapezius(new Ponto(825, 35), 460, 500, 20);
	var c2qf = new Retangulo(new Ponto(825, 10), 500, 30);
	var c2tc = new Trapezius(new Ponto(825, 35), 460, 500, 20);

	var c2d = new Drawing();
	c2d.addForma(c2tf);
	c2d.addForma(c2qf);

	var c3tf = new Trapezius(new Ponto(1090, 300), 460, 500, 20);
	var c3qf = new Retangulo(new Ponto(1115, 300), 500, 30);
	var c3tc = new Trapezius(new Ponto(1090, 300), 460, 500, 20);

	c3qf.setDegree(90);
	c3tf.setDegree(90);
	c3tc.setDegree(90);
	var c3d = new Drawing();
	c3d.addForma(c3tf);
	c3d.addForma(c3qf);

	var c4tf = new Trapezius(new Ponto(825, 565), 500,460, 20);
	var c4qf = new Retangulo(new Ponto(825, 590), 500, 30);
	var c4tc = new Trapezius(new Ponto(825, 565), 500,460, 20);
	var c4d = new Drawing();
	c4d.addForma(c4tf);
	c4d.addForma(c4qf);
	
	var c5tf = new Trapezius(new Ponto(295, 565), 500,460, 20);
	var c5qf = new Retangulo(new Ponto(295, 590), 500, 30);
	var c5tc = new Trapezius(new Ponto(295, 565), 500,460, 20);

	var c5d = new Drawing();
	c5d.addForma(c5tf);
	c5d.addForma(c5qf);
	
	var c6tf = new Trapezius(new Ponto(35, 300), 460, 500, 20);
	var c6qf = new Retangulo(new Ponto(10, 300), 500, 30);
	var c6tc = new Trapezius(new Ponto(35, 300), 460, 500, 20);

	c6qf.setDegree(-90);
	c6tf.setDegree(-90);
	c6tc.setDegree(-90);
	var c6d = new Drawing();
	c6d.addForma(c6tf);
	c6d.addForma(c6qf);
	
	c1tf.setCor(tc);
	c1qf.setCor('Brown');
	c2tf.setCor(tc);
	c2qf.setCor('Brown');
    c3tf.setCor(tc);
	c3qf.setCor('Brown');
	c4tf.setCor(tc);
	c4qf.setCor('Brown');
	c5tf.setCor(tc);
	c5qf.setCor('Brown');
	c6tf.setCor(tc);
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

Fabrica.criarLinha = function(){
	var pontoA = new Ponto(350,350);
	var pontoB = new Ponto(700,130);
	var linhaDraw = new Line(pontoA, pontoB);
	linhaDraw.getBorda().setThickness(2);
	linhaDraw.getBorda().setLineDash([5,5]);
	var desenho = new Drawing();
	desenho.addForma(linhaDraw);
	desenho.setCentro(linhaDraw.getCenter());
	var linha = new Objeto(linhaDraw, desenho);
	return linha;
};

Fabrica.criarBola = function(){
	var circuloDraw = new Circle(new Ponto(350,150),30);
	circuloDraw.getBorda().setLineDash([4,4]);
	circuloDraw.setCor(new Color(Color.Name.lavender));
	//circuloDraw.getBorda().setCor('transparent');
	//var cor = new Color("Red");
	//cor.setAlpha(0.2);
	//circuloDraw.setCor(cor);
	//var starDraw = new FormaRegular(new Ponto(350,150),15,5,2,0);
	//starDraw.setCor(new Color(Color.Name.Gold1));
	//starDraw.getBorda().setCor('transparent');
	var bolaDraw = new Drawing();
	bolaDraw.addForma(circuloDraw);
	//bolaDraw.addForma(starDraw);
	bolaDraw.setCentro(new Ponto(350,150));
	var bola = new Objeto(circuloDraw, bolaDraw);
	return bola;
};


Fabrica.animacoes = function(){
	





};
