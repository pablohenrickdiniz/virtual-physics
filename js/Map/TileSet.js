TileSet.prototype = new Retangulo();

function TileSet(centro, imagem) {
	this.imagem = imagem ;
	Retangulo.call(this, centro, 32, 32);
	
	
	this.getImagem = function(){
		return this.imagem;
	};

	this.setImagem = function(imagem){
		if(imagem instanceof Imagem){
			this.imagem = imagem;
		}
	};
	
}