function Universo(centro, largura, altura) {
	this.objetos = new Array();
	this.arvoreColisao = new ArvoreColisao(1, centro, largura, altura);
	this.canvas = new Canvas("#canvas");

	this.addObjeto = function(objeto) {
		if (objeto instanceof Objeto) {
			this.objetos.push(objeto);
			this.arvoreColisao.addContato(objeto.getContato());
		}
	};

	this.removerObjeto = function(objeto) {
		if (objeto instanceof Objeto) {
			this.objetos.splice(objeto.getId());
			this.arvoreColisao.removerContato(objeto.getContato());
		}
	};

	this.step = function() {
		this.canvas.limparTela();
		//this.desenharArvore(this.arvoreColisao);
		this.arvoreColisao.testarColisao();
		for (var i = 0; i < this.objetos.length; i++) {
		    if (this.objetos[i].dinamico) {
				this.arvoreColisao.removeContato(this.objetos[i].getContato());
				this.objetos[i].step();
				this.arvoreColisao.addContato(this.objetos[i].getContato());
			}
			this.canvas.desenhar(this.objetos[i].getDesenho());
			//this.canvas.desenharVetor(this.objetos[i].getVetor(),this.objetos[i].getForma().getCentro());
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