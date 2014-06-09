function ImgLoader(){
	this.images   = new Array();
	this.loaded = 0;
	this.loading = false;
	this.action = function(){};
	

	this.addImages = function(url){
		for(var i = 0; i < arguments.length;i++){
			var imagem = new Imagem(arguments[i]);
			this.images.push(imagem);
		}
	};
	
	this.loadImages = function(){
		if(!this.loading){
			this.loaded = 0;
			this.loading = true;
			var loader = this;
			for(var i = 0; i < this.images.length;i++){
				$(this.images[i].load()).load(function(){
					loader.loaded++;
					if(loader.getProgresso() >= 100){
						loader.action.call();
					}
				});
			}
		}
	};
	
	this.getProgresso = function(){
		return (100*this.loaded)/this.images.length;
	};
	
	this.onLoad = function(action){
		this.action = action;
	};
	
	this.getImages = function(){
		return this.images;
	};
}
