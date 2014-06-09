function Sombra(x,y,blur,cor){
	this.x = isNaN(x)?2:x;
	this.y = isNaN(y)?2:y;
	this.blur = isNaN(blur)?3:blur;
	this.cor = cor;
	this.id  = idGenerator.getId();
	
	this.getX = function(){
		return this.x;
	};
	
	this.getY = function(){
		return this.y;
	};
	
	this.getBlur = function(){
		return this.blur;
	};
	
	this.getCor = function(){
		return this.cor;
	};
	
	this.setX = function(x){
		if(!isNaN(x)){
			this.x = x;
		}
	};
	
	this.setY = function(){
		if(!isNaN(y)){
			this.y =y;
		}
	};
	
	this.setBlur = function(blur){
		if(!isNaN(blur)){
			this.blue = blur;
		}
	};
	
	this.setCor = function(cor){
		this.cor = cor;
	};
	
	this.getId = function(){
		return this.id;
	};
}
