function Colisao(){}



Colisao.colisaoCaixa = function(retanguloA, retanguloB) {
	if (retanguloA instanceof Retangulo && retanguloB instanceof Retangulo) {
		var pta = retanguloA.getPontos();
		var ptb = retanguloB.getPontos();
		var pa = null;
		var pb = null;
		var pc = null;
		var pd = null;

		if (pta[0].x > ptb[1].x) {
			pa = pta[0];
			pb = pta[3];
			pc = ptb[1];
			pd = ptb[2];
		} else if (ptb[0].x > pta[1].x) {
			pa = ptb[0];
			pb = ptb[3];
			pc = pta[1];
			pd = pta[2];
		} else if (pta[0].y > ptb[3].y) {
			pa = pta[0];
			pb = pta[1];
			pc = ptb[3];
			pd = ptb[4];
		} else if (ptb[0].y > pta[3].y) {
			pa = ptb[0];
			pb = ptb[1];
			pc = pta[3];
			pd = ptb[4];
		}
		if (pa != null && pb != null && pc != null && pd != null) {
			return obterMenorReta(pa, pb, pc, pd).getPontoMedio();
		}
	}
	return null;
};

Colisao.colisaoCaixaB = function(retanguloA, xb, yb, wb, hb) {
	var pta = retanguloA.getPontos();

	if (pta[0].x > xb + wb || xb > pta[1].x || pta[0].y > yb + hb
			|| yb > pta[3].y) {
		return false;
	}

	return true;
};


Colisao.circuloReta = function(circulo, reta){
	if(circulo instanceof Circulo && reta instanceof Reta){
		var angulo = reta.getAngulo();
		reta.girar(-angulo,reta.getPontoA());
		circulo.girar(-angulo,reta.getPontoA());
		var rc 	= circulo.getRaio();
		var cx 	= circulo.getCentro().getX();
		var cy 	= circulo.getCentro().getY();
		var pax = reta.getPontoA().getX();
		var pay = reta.getPontoA().getY();
		var pbx = reta.getPontoB().getX();
		var pby = reta.getPontoB().getY();
		reta.girar(angulo,reta.getPontoA());
		circulo.girar(angulo,reta.getPontoA());
		
		var minX = Math.min(pax,pbx)-rc;
		var minY = Math.min(pay,pby)-rc;
		var maxX = Math.max(pax,pbx)+rc;
		var maxY = Math.max(pay,pby)+rc;

		if(((cx <= pax && cx >= minX)||(cx >=pax && cx <= maxX)) &&(cy <= maxY && cy >= minY)){
			return true;
		}
		return false;
	}
	else{
		throw new TypeError('Somente circulo e reta podem ser passados como parâmetro');
	}
};

Colisao.circuloPoligono = function(circulo, poligono){
	if(poligono instanceof Poligono && circulo instanceof Circulo){
		var pontos = poligono.getPontos();
		for(var i = 0; i < pontos.length && i+1 < pontos.length;i++){
			var reta = new Reta(pontos[i], pontos[i+1]);
			if(Colisao.circuloReta(circulo, reta)){
				return true;
			}
		}
	}
	return false;
};

Colisao.colisaoCirculo = function(circuloA, circuloB) {
	var ca = circuloA.getCentro();
	var cb = circuloB.getCentro();
	var ra = circuloA.getRaio();
	var rb = circuloB.getRaio();
	var d = Ponto.distancia(ca, cb);
	return d <= (ra + rb);
};

function moverParaColisao(objetoA, objetoB) {
	var va = objetoA.getVetor().obterNorma();
	var vb = objetoB.getVetor().obterNorma();
	var ca = (100 * va / (va + vb)) * 0.01;
	var cb = (100 * vb / (va + vb)) * 0.01;
	var da = va * ca / 100;
	var db = vb * cb / 100;
	objetoA.rollBack();
	objetoB.rollBack();
	objetoA.getForma().getCentro().setY(
			objetoA.getForma().getCentro().getY() + da);
	objetoB.getForma().getCentro().setY(
			objetoB.getForma().getCentro().getY() + db);
}

/*
function colisaoPoligono(poligonoA, poligonoB) {
	if (buscaSeparador(poligonoA, poligonoB)
			|| buscaSeparador(poligonoB, poligonoA)) {
		return false;
	}
	return true;
}

function colisaoProjecao(projecaoA, projecaoB) {
	if (projecaoA.getX() < projecaoB.getY()
			|| projecaoA.getY() > projecaoB.getX()) {
		return false;
	}
	return true;
}

function buscaSeparador(poligonoA, poligonoB) {
	var pontos = poligonoA.getPontos();
	for ( var i = 0; i < pontos.length; i++) {
		var pontoA = pontos[i];
		var pontoB = pontos[i + 1 < pontos.length ? i + 1 : 0];

		var vetor = new Ponto(pontoB.getX() - pontoA.getX(), pontoB.getY()
				- pontoA.getY());
		vetor.setY(vetor.getY() * -1);
		normalizeVetor(vetor);
		var projecao1 = projetarPoligono(poligonoA, vetor);
		var projecao2 = projetarPoligono(poligonoB, vetor);
		if (!colisaoProjecao(projecao1, projecao2)) {
			return true;
		}
	}
	return false;
	
	function projetarPoligono(poligono, vetor) {
	var pontos = poligono.getPontos();
	var pontoAtual = pontos[0];
	var produtoEscalar = (vetor.getX() * pontoAtual.getX())
			+ (vetor.getY() * pontoAtual.getY());
	var projecao = new Ponto(produtoEscalar, produtoEscalar);
	for ( var i = 1; i < pontos.length; i++) {
		pontoAtual = pontos[i];
		produtoEscalar = (vetor.getX() * pontoAtual.getX())
				+ (vetor.getY() * pontoAtual.getY());
		projecao.setX(Math.max(projecao.getX(), produtoEscalar));
		projecao.setY(Math.min(projecao.getY(), produtoEscalar));
	}
	return projecao;
}
*/

