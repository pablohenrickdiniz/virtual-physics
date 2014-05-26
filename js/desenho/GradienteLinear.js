function GradienteLinear(x0, y0, x1, y1) {
	this.x0 = isNaN(x0) ? 100 : x0;
	this.y0 = isNaN(y0) ? 100 : y0;
	this.x1 = isNaN(x1) ? 100 : x1;
	this.y1 = isNaN(y1) ? 100 : y1;
	this.colorsStop = new Array();
	
	this.getX0 = function() {
		return this.x0;
	};

	this.getY0 = function() {
		return this.y0;
	};

	this.getX1 = function() {
		return this.x1;
	};

	this.getY1 = function() {
		return this.y1;
	};

	this.setX0 = function(x0) {
		if (!isNaN(x0)) {
			this.x0 = x0;
		}
	};

	this.setY0 = function(y0) {
		if (!isNaN(y0)) {
			this.y0 = y0;
		}
	};

	this.setX1 = function(x1) {
		if (!isNaN(x1)) {
			this.x1 = x1;
		}
	};

	this.setY1 = function(y1) {
		if (!isNaN(y1)) {
			this.x1 = y1;
		}
	};

	this.addColorStop = function(stop, color) {
		if (isNaN(stop) || stop < 0 || stop > 1) {
			throw new TypeError('O indice de parada deve ser um numero entre 0 e 1');
		}
		if (!(color instanceof Color)) {
			color = Color.parse(color);
		}
		this.colorsStop.push(new Array(stop, color));
	};
	
	this.getColorsStop = function(){
		return this.colorsStop;
	};
	
	this.moverPara = function(x,y){
		var dx = this.x1 - this.x0;
		var dy = this.y1 - this.y0;
		this.x0 = x;
		this.y0 = y;
		this.x1 = x+dx;
		this.y1 = y+dy;
	};
	
	this.transladar = function(x,y){
		this.x0+=x;
		this.y0+=y;
		this.x1+=x;
		this.y1+=y;
	};
}