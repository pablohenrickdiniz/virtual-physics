$(document).ready(function() {
	var universo = new Universo(new Ponto(300, 300), 600, 600);
	var bolaBranca = new Objeto(new Circulo(new Ponto(300, 300), 10));
	var ladoCima = new Objeto(new Retangulo(new Ponto(300, 11), 598, 20));
	var ladoDireito = new Objeto(new Retangulo(new Ponto(588, 300), 21, 598));
	var ladoBaixo = new Objeto(new Retangulo(new Ponto(300, 588), 598, 21));
	var ladoEsquerdo = new Objeto(new Retangulo(new Ponto(12, 300), 21, 598));

    var centroBola = bolaBranca.getForma().getCentro();
    
    var grdBola = new GradienteRadial(300,300,50,250,250,60);
    grdBola.addColorStop(0.2,"Grey");
    grdBola.addColorStop(1,"White");
    bolaBranca.getForma().setCor(grdBola);
    bolaBranca.getForma().getBorda().setCor('Grey');
	var tacoForma = new Poligono();
	tacoForma.addPonto(new Ponto(297, 312));
	tacoForma.addPonto(new Ponto(303, 312));
	tacoForma.addPonto(new Ponto(307, 620));
	tacoForma.addPonto(new Ponto(293, 620));
	tacoForma.atualizarCentro();
	
	var taco = new Objeto(tacoForma);
	var color = new Color("MedSpringGreen");
	ladoCima.getForma().setCor(color);
	ladoCima.getForma().getBorda().setCor('transparent');
	ladoDireito.getForma().setCor(color);
	ladoDireito.getForma().getBorda().setCor('transparent');
	ladoBaixo.getForma().setCor(color);
	ladoBaixo.getForma().getBorda().setCor('transparent');
	ladoEsquerdo.getForma().setCor(color);
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

    var vetorTaco = new Vetor(0,0);
    taco.setVetor(vetorTaco);
	$("#canvas").mousemove(function() {
        if(!reader.isPressed()){
            var rx = reader.getX();
            var ry = reader.getY();
            var mouse = new Ponto(rx, ry);
            var vxd = centroBola.getX()-rx;
            var vyd = centroBola.getY()-ry;
         
            vetorTaco.setX(vxd);
            vetorTaco.setY(vyd);
            vetorTaco.inverterSentido();
            
           
            taco.getForma().setAngulo(obterAngulo(vxd, vyd)+180,centroBola);
        }
        else{
        	
        }
	});
});
