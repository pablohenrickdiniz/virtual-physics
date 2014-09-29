ArvoreColisao.prototype = new Retangulo();
function ArvoreColisao(nivel, centro, largura, altura) {
	Retangulo.call(this, centro, largura, altura);
	this.a = null;
	this.b = null;
	this.c = null;
	this.d = null;
	this.contatos = new Array();
	this.nivel = nivel;

	this.addContato = function(contato) {
		this.contatos.push(contato);
		if (this.contatos.length > 1 && this.nivel < 5) {
			var caixa = contato.getQuadradoCircunscrito();
			var cw = this.largura / 2;
			var ch = this.altura / 2;
			var cx = this.centro.getX();
			var cy = this.centro.getY();

			if (Colisao.colisaoCaixaB(caixa, cx - cw, cy - ch, cw, ch)) {
				if (this.a == null) {
					this.a = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							- (cw / 2), cy - (ch / 2)), cw, ch);
					this.a.setCor('transparent');
				}
			}
			if (Colisao.colisaoCaixaB(caixa, cx, cy - ch, cw, ch)) {
				if (this.b == null) {
					this.b = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							+ (cw / 2), cy - (ch / 2)), cw, ch);
					this.b.setCor('transparent');
				}
			}
			if (Colisao.colisaoCaixaB(caixa, cx - cw, cy, cw, ch)) {
				if (this.c == null) {
					this.c = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							- (cw / 2), cy + (ch / 2)), cw, ch);
					this.c.setCor('transparent');
				}
			}
			if (Colisao.colisaoCaixaB(caixa, cx, cy, cw, ch)) {
				if (this.d == null) {
					this.d = new ArvoreColisao(this.nivel + 1, new Ponto(cx
							+ (cw / 2), cy + (ch / 2)), cw, ch);
				}
				this.d.addContato(contato);
			}
		}
	};

	this.testarColisao = function() {
	
		if (this.contatos.length > 1) {
			
			for (var i = 0; i < this.contatos.length; i++) {
				var contatoA = this.contatos[i];
				for (var j = i + 1; j < this.contatos.length; j++) {
					var contatoB = this.contatos[j];
					if (contatoA.getDono().isMoving() || contatoB.getDono().isMoving()) {
						if((contatoA instanceof Circulo && contatoB instanceof Reta)||(contatoA instanceof Reta && contatoB instanceof Circulo)){
							
							if(contatoA instanceof Circulo){
								console.log(Colisao.circuloReta(contatoA, contatoB));
							}
							else{
								console.log(Colisao.circuloReta(contatoB, contatoA));
							}
						}
						else{
							var cp = Colisao.colisaoCaixa(contatoA, contatoB);
							if (cp instanceof Ponto) {
								aplicarForcas(objetoA, objetoB);
							}
						}
					}
				}
			}
		}
	};

	this.removerContato = function(contato){
		this.contatos.remove(contato);
		if (this.contatos.length < 2) {
			this.a = null;
			this.b = null;
			this.c = null;
			this.d = null;
		} else {
			var caixa = contato.getQuadradoCircunscrito();
			var cw = this.largura / 2;
			var ch = this.altura / 2;
			var cx = this.centro.getX();
			var cy = this.centro.getY();

			if (this.a != null
					&& Colisao.colisaoCaixaB(caixa, cx - cw, cy - ch, cw, ch)) {
				this.a.removerContato(contato);
			}
			if (this.b != null && Colisao.colisaoCaixaB(caixa, cx, cy - ch, cw, ch)) {
				this.b.removerContato(contato);
			}
			if (this.c != null && Colisao.colisaoCaixaB(caixa, cx - cw, cy, cw, ch)) {
				this.c.removerContato(contato);
			}
			if (this.d != null && Colisao.colisaoCaixaB(caixa, cx, cy, cw, ch)) {
				this.d.removerContato(contato);
			}
		}
	};
}