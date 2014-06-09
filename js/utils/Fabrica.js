function Fabrica() {
}

Fabrica.criarTaco = function() {
	var tacoContato = new Poligono();
	var tacoForma = new Poligono();
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
	//var sombra = new Sombra(3,3,3,"Gray");
	var grdBola = new GradienteRadial(50,50,100,100,100);
	grdBola.addColorStop(0, "White");
	grdBola.addColorStop(50, "Grey");

	var bolaForma = new Circulo(new Ponto(300, 300), 10);
	bolaForma.setCor(grdBola);
	//bolaForma.setSombra(sombra);
	bolaForma.getBorda().setCor('Gray');
	bolaForma.getBorda().setLineDash([5,3]);
	bolaForma.getBorda().setLineCap(Borda.ROUND);

	var desenhoBola = new Desenho(new Ponto(bolaForma.getCentro().getX(),
			bolaForma.getCentro().getY()));
	desenhoBola.addForma(bolaForma);
	var bolaContato = new Circulo(new Ponto(300, 300), 10);
	var bolaBranca = new Objeto(bolaContato, desenhoBola);
	return bolaBranca;
};

Fabrica.criarMesa = function() {
	var basec = new Retangulo(new Ponto(562.5,300),1125,600);
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
	var linhaDraw = new Reta(pontoA, pontoB);
	linhaDraw.getBorda().setEspessura(2);
	linhaDraw.getBorda().setLineDash([5,5]);
	var desenho = new Desenho();
	desenho.addForma(linhaDraw);
	desenho.setCentro(linhaDraw.getCentro());
	var linha = new Objeto(linhaDraw, desenho);
	return linha;
};

Fabrica.criarBola = function(){
	var circuloDraw = new Circulo(new Ponto(350,150),30);
	circuloDraw.getBorda().setLineDash([4,4]);
	circuloDraw.setCor(new Color(Color.Name.lavender));
	//circuloDraw.getBorda().setCor('transparent');
	//var cor = new Color("Red");
	//cor.setAlpha(0.2);
	//circuloDraw.setCor(cor);
	//var starDraw = new FormaRegular(new Ponto(350,150),15,5,2,0);
	//starDraw.setCor(new Color(Color.Name.Gold1));
	//starDraw.getBorda().setCor('transparent');
	var bolaDraw = new Desenho();
	bolaDraw.addForma(circuloDraw);
	//bolaDraw.addForma(starDraw);
	bolaDraw.setCentro(new Ponto(350,150));
	var bola = new Objeto(circuloDraw, bolaDraw);
	return bola;
};


Fabrica.animacoes = function(){
	





};
