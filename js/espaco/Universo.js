function Universo(centro, largura, altura) {
	this.objetos = new Array();
	this.arvoreColisao = new ArvoreColisao(1, centro, largura, altura);
	this.canvas = new Canvas("#canvas");

	this.addObjeto = function(objeto) {
		if (objeto instanceof Objeto) {
			this.objetos.push(objeto);
			this.arvoreColisao.addForma(objeto.getForma());
		}
	};

	this.removerObjeto = function(objeto) {
		if (objeto instanceof Objeto) {
			this.objetos.splice(objeto.getId());
			this.arvoreColisao.removerObjeto(objeto.getForma());
		}
	};

	this.step = function() {
		this.canvas.limparTela();
		this.desenharArvore(this.arvoreColisao);
		this.arvoreColisao.testarColisao();
		for (var i = 0; i < this.objetos.length; i++) {
		    if (this.objetos[i].dinamico) {
				this.arvoreColisao.removeForma(this.objetos[i].getForma());
				this.objetos[i].step();
				this.arvoreColisao.addForma(this.objetos[i].getForma());
			}
			this.canvas.desenharFormaGeometrica(this.objetos[i].getForma());
		}

	};

	this.desenharArvore = function(arvore) {
		if (arvore instanceof ArvoreColisao) {
			this.canvas.desenharPoligono(arvore);
			this.desenharArvore(arvore.a);
			this.desenharArvore(arvore.b);
			this.desenharArvore(arvore.c);
			this.desenharArvore(arvore.d);
		}
	};
}