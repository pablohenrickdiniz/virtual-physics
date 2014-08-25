function Border(color, thickness) {
	this.color = color;
	this.thickness = isNaN(thickness) ? 1 : thickness;
	this.lineDash  = new Array();
	this.lineCap   = 'butt';

	this.getColor = function() {
		return this.color;
	};

	this.getThickness = function() {
		return this.thickness;
	};

	this.getLineDash = function(){
		return this.lineDash;
	};
	
	this.getLineCap = function(){
		return this.lineCap;
	};
	
	this.setColor = function(color) {
		this.color = color;
	};

	this.setThickness = function(thickness) {
		if (!isNaN(thickness)) {
			this.thickness = thickness;
		}
	};
	
	this.setLineDash = function(values){
		this.lineDash = values;
	};
	
	this.setLineCap = function(lineCap){
		this.lineCap = lineCap;
	};
}

Border.BUTT  = 'butt';
Border.ROUND = 'round';
Border.SQUARE = 'square';