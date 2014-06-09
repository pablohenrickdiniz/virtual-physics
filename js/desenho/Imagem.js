function Imagem(url){
	this.url = url;
	this.sx = 0;
	this.sy = 0;
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.element = null;
	this.id = idGenerator.getId();
	this.carregada = false;
	this.pattern = "repeat";
	this.fillPattern = null;
	
	this.setUrl = function(url){
		this.url = url;
	};
	
	this.setSx = function(sx){
		if(!isNaN(sx)){
			this.sx = sx;
		}
	};
	
	this.setSy = function(sy){
		if(!isNaN(sy)){
			this.sy = sy;
		}
	};
	
	this.setX = function(x){
		if(!isNaN(x)){
			this.x = x;
		}
	};
	
	this.setY = function(y){
		if(!isNaN(y)){
			this.y = y;
		}
	};
	
	this.setWidth = function(width){
		if(!isNaN(width)){
			this.width = width;
		}
	};
	
	this.setHeight = function(height){
		if(!isNaN(height)){
			this.height = height;
		}
	};
	
	this.setPattern = function(pattern){
		this.pattern = pattern;
	};
	
	this.getUrl = function(){
		return this.url;
	};
	
	this.getSx = function(){
		return this.sx;
	};
	
	this.getSy = function(){
		return this.sy;
	};
	
	this.getX = function(){
		return this.x;
	};
	
	this.getY = function(){
		return this.y;
	};
	
	this.getWidth = function(){
		return this.width;
	};
	
	this.getHeight = function(){
		return this.height;
	};
	
	this.getId = function(){
		return this.id;
	};
	
	this.load = function(){
		if(this.element == null){
			this.element = new Image();
			$(this.element).attr("src",this.url);
			$(this.element).prop("id",this.id);
			var img = this;
			$(this.element).load(function(){
				img.width  = this.width;
				img.height = this.height;
				img.carregada = true;
			});
		}
		return this.element;
	};
	
	this.isCarregada = function(){
		return this.carregada;
	};
	
	this.getFillPattern = function(contexto){
		if(this.fillPattern == null){
			this.fillPattern = contexto.createPattern(document.getElementById(this.id),this.pattern);
		}
		return this.fillPattern;
	};
	
	this.getPattern = function(){
		return this.pattern;
	};
	
	this.getElement = function(){
		if(this.element == null){
			return this.load();
		}
		return this.element;
	};
}

Imagem.REPEAT  = 'repeat';
Imagem.REPEATX = 'repeat-x';
Imagem.REPEATY = 'repeat-y';
Imagem.NOREPEAT= 'no-repeat';
