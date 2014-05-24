function Fabrica(){}

Fabrica.criarTaco = function(){
	var tacoContato = new Poligono();
	var tacoForma   = new Poligono();
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
	
	var desenhoTaco = new Desenho();
	desenhoTaco.addForma(tacoForma);
	console.log(desenhoTaco);
	var taco = new Objeto(tacoContato, desenhoTaco);
	return taco;
};

Fabrica.criarBolaBranca = function(){
	var grdBola = new GradienteRadial(300,300,50,250,250,60);
    grdBola.addColorStop(0.2,"Grey");
    grdBola.addColorStop(1,"White");
    
    var bolaForma   = new Circulo(new Ponto(300, 300));
    bolaForma.setCor(grdBola);
    bolaForma.getBorda().setCor('Gray');
    var desenhoBola = new Desenho();
    desenhoBola.addForma(bolaForma);
    console.log(desenhoBola);
    var bolaBranca = new Objeto(new Circulo(new Ponto(300, 300), 10), desenhoBola);
    return bolaBranca;
};

Fabrica.criarMesa = function(){
	var cor = new Color("MedSpringGreen");
	var norteForma = new Retangulo(new Ponto(300, 11), 598, 20);
	var lesteForma = new Retangulo(new Ponto(588, 300), 21, 598);
	var sulForma   = new Retangulo(new Ponto(300, 588), 598, 21);
	var oesteForma = new Retangulo(new Ponto(12, 300), 21, 598);
	var norteContato = new Retangulo(new Ponto(300, 11), 598, 20);
	var lesteContato = new Retangulo(new Ponto(588, 300), 21, 598);
	var sulContato   = new Retangulo(new Ponto(300, 588), 598, 21);
	var oesteContato = new Retangulo(new Ponto(12, 300), 21, 598);
	
	norteForma.setCor(cor);
	lesteForma.setCor(cor);
	sulForma.setCor(cor);
	oesteForma.setCor(cor);
	norteForma.getBorda().setCor('transparent');
	lesteForma.getBorda().setCor('transparent');
	sulForma.getBorda().setCor('transparent');
	oesteForma.getBorda().setCor('transparent');
	
	var norteDesenho = new Desenho();
	norteDesenho.addForma(norteForma);
	var lesteDesenho = new Desenho();
	lesteDesenho.addForma(lesteForma);
	var sulDesenho   = new Desenho();
	sulDesenho.addForma(sulForma);
	var oesteDesenho = new Desenho();
	oesteDesenho.addForma(oesteForma);
	
	var norte = new Objeto(norteContato, norteDesenho);
	var leste = new Objeto(lesteContato, lesteDesenho);
	var sul   = new Objeto(sulContato,   sulDesenho);
	var oeste = new Objeto(oesteContato, oesteDesenho);
	
    var obj = {norte: norte, sul: sul, leste:leste, oeste: oeste};
    console.log(obj);
    return obj;
};