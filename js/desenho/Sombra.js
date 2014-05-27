function Sombra(x,y,blur,color){
	this.x = isNaN(x)?2:x;
	this.y = isNaN(y)?2:y;
	this.blur = isNaN(blur)?3:blur;
	this.color = color;
	
	this.getX = function(){
		return this.x;
	};
	
	this.getY = function(){
		return this.y;
	};
	
	this.getBlur = function(){
		return this.blur;
	};
	
	this.getColor = function(){
		return this.color;
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
	
	this.setColor = function(color){
		this.color = color;
	};
}
