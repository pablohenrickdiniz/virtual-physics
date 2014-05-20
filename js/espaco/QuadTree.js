ArvoreColisao.prototype = new Retangulo();
function ArvoreColisao(nivel, centro, largura, altura) {
	Retangulo.call(this, centro, largura, altura);
	this.canvas = new Canvas("#canvas");
	this.a = null;
	this.b = null;
	this.c = null;
	this.d = null;
	this.formas = new Array();
	this.nivel = nivel;

	this.addForma = function(forma) {
		this.formas.push(forma);
		if (this.formas.length > 1 && this.nivel < 5) {
			var caixa = forma.getQuadradoCircunscrito();
			var cw = this.largura / 2;
			var ch = this.altura / 2;
			var cx = this.centro.getX();
			var cy = this.centro.getY();

			if (colisaoCaixaB(caixa, cx - cw, cy - ch, cw, ch)) {
				if (this.a == null) {
					this.a = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							- (cw / 2), cy - (ch / 2)), cw, ch);
					this.a.setCor('transparent');
				}
				this.a.addForma(forma);
			}
			if (colisaoCaixaB(caixa, cx, cy - ch, cw, ch)) {
				if (this.b == null) {
					this.b = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							+ (cw / 2), cy - (ch / 2)), cw, ch);
					this.b.setCor('transparent');
				}

				this.b.addForma(forma);
			}
			if (colisaoCaixaB(caixa, cx - cw, cy, cw, ch)) {
				if (this.c == null) {
					this.c = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							- (cw / 2), cy + (ch / 2)), cw, ch);
					this.c.setCor('transparent');
				}
				this.c.addForma(forma);
			}
			if (colisaoCaixaB(caixa, cx, cy, cw, ch)) {
				if (this.d == null) {
					this.d = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							+ (cw / 2), cy + (ch / 2)), cw, ch);
					this.d.setCor('transparent');
				}
				this.d.addForma(forma);
			}
		}
	};

	this.testarColisao = function() {
		if (this.formas.length > 1) {
			for (var i = 0; i < this.formas.length; i++) {
				var objetoA = this.formas[i].getDono();
				for (var j = i + 1; j < this.formas.length; j++) {
					var objetoB = this.formas[j].getDono();
					if (objetoA.isMoving() || objetoB.isMoving()) {
						var cp = colisaoCaixa(this.formas[i], this.formas[j]);
						if (cp instanceof Ponto) {
							aplicarForcas(objetoA, objetoB);
						}
					}
				}
			}
		}
	};

	this.removeForma = function(forma) {
		this.formas.remove(forma);
		if (this.formas.length < 2) {
			this.a = null;
			this.b = null;
			this.c = null;
			this.d = null;
		} else {
			var caixa = forma.getQuadradoCircunscrito();
			var cw = this.largura / 2;
			var ch = this.altura / 2;
			var cx = this.centro.getX();
			var cy = this.centro.getY();

			if (this.a != null
					&& colisaoCaixaB(caixa, cx - cw, cy - ch, cw, ch)) {
				this.a.removeForma(forma);
			}
			if (this.b != null && colisaoCaixaB(caixa, cx, cy - ch, cw, ch)) {
				this.b.removeForma(forma);
			}
			if (this.c != null && colisaoCaixaB(caixa, cx - cw, cy, cw, ch)) {
				this.c.removeForma(forma);
			}
			if (this.d != null && colisaoCaixaB(caixa, cx, cy, cw, ch)) {
				this.d.removeForma(forma);
			}
		}
	};
}