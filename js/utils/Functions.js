const METERPIXEL = 1000;
const GRAVITY = new Vetor(0, 10);
const VELOCIDADETERMINAL = 50;
const FPS = 60;

function IdGenerator() {
	this.id = 0;
	this.disponibleIds = new Array();

	this.getId = function() {
		if (this.disponibleIds.length > 0) {
			return this.disponibleIds.pop();
		}
		this.id++;
		return this.id;
	};

	this.unlockId = function(id) {
		this.disponibleIds.push(id);
	};
}

var idGenerator = new IdGenerator();

function toInt(px) {
	return parseInt(px.substr(0, px.indexOf('px')));
}

function converterParaRadianos(graus) {
	return graus * (Math.PI / 180);
}

function converterParaGraus(radianos) {
	return radianos * (180 / Math.PI);
}

function colisaoCaixa(retanguloA, retanguloB) {
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

function colisaoCaixaB(retanguloA, xb, yb, wb, hb) {
	var pta = retanguloA.getPontos();

	if (pta[0].x > xb + wb || xb > pta[1].x || pta[0].y > yb + hb
			|| yb > pta[3].y) {
		return false;
	}

	return true;
};

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
}

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

function colisaoCirculo(circuloA, circuloB) {
	var ca = circuloA.getCentro();
	var cb = circuloB.getCentro();
	var ra = circuloA.getRaio();
	var rb = circuloB.getRaio();
	var d = obterDistancia(ca, cb);
	return d <= (ra + rb);
};

function indexOf(value) {
	for ( var index in this) {
		if (this[index] == value) {
			return index;
		}
	}
	return -1;
}

if (Array.prototype.indexOf == undefined) {
	Array.prototype.indexOf = indexOf;
}

function remove(element) {
	var index = this.indexOf(element);
	if (index != -1) {
		this.splice(index, 1);
	}
}

Array.prototype.remove = remove;

(function() {
	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
	for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]
				+ 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]
				+ 'CancelAnimationFrame']
				|| window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());