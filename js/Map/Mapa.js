Mapa.prototype = new Retangulo();

function Mapa(largura, altura) {
	largura = isNaN(largura) || largura < 0 ? 500 : largura;
	altura = isNaN(altura) || altura < 0 ? 500 : altura;
	var centro =  new Ponto(largura / 2, altura / 2);
	Retangulo.call(this,centro , largura, altura);
	this.eventos = new Array();
	this.tileSets = new Array();
	this.arvoreColisao = new ArvoreColisao(1, centro, largura, altura);
	this.canvas = new Array();
	for(var i = 1; i <= 5;i++){
		this.canvas[i-1] = new Canvas("camada"+i);
	}
	
	this.addEvento = function(evento) {
		if (evento instanceof Evento) {
			var camada = evento.getCamada();
			if(isNaN(camada) && camada > 0 && camada <= 5){
				camada = parseInt(camada);
				if(this.eventos[camada] == undefined){
					this.eventos[camada] = new Array();
				}
				this.eventos[camada].push(evento);
			}
			
			this.eventos = evento;
		}
	};

	this.removeEvento = function(evento){
		if (evento instanceof Evento) {
			var camada = evento.getCamada();
			if(isNaN(camada) && camada > 0 && camada <= 5){
				camada = parseInt(camada);
				if(this.eventos[camada] instanceof Array){
					this.eventos[camada].remove(evento);
				}
			}
		}
	};
	
	this.addTileset = function(tileset){
		if(tileset instanceof Tileset){
			this.tileSets.push(tileset);
		}
	};
	
	this.carregar = function(){
		
	};
	
	this.step = function() {
		this.canvas.limparTela();
		//this.desenharArvore(this.arvoreColisao);
		this.arvoreColisao.testarColisao();
		for (var i = 0; i < this.objetos.length; i++) {
			
		    if (this.objetos[i].dinamico) {
				this.arvoreColisao.removerContato(this.objetos[i].getContato());
				this.objetos[i].step();
				this.arvoreColisao.addContato(this.objetos[i].getContato());
			}
			this.canvas.desenhar(this.objetos[i].getDesenho());
		}

	};
}
