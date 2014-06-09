function GradienteLinear(px0, py0, px1, py1) {
	this.px0 = isNaN(px0) || px0 < 0 || px0 > 100? 0 : px0;
	this.py0 = isNaN(py0) || py0 < 0 || py0 > 100? 0 : py0;
	this.px1 = isNaN(px1) || px1 < 0 || px1 > 100? 100 : px1;
	this.py1 = isNaN(py1) || py1 < 0 || py1 > 100? 100 : py1;
	this.colorsStop = new Array();
	this.id = idGenerator.getId();

	this.getPx0 = function() {
		return this.px0;
	};

	this.getPy0 = function() {
		return this.py0;
	};

	this.getPx1 = function() {
		return this.px1;
	};

	this.getPy1 = function() {
		return this.py1;
	};

	this.setPx0 = function(px0) {
		if(!isNaN(px0) && px0 >= 0 && px0 <= 100){
			this.px0 = px0;
		}
	};

	this.setPy0 = function(py0) {
		if(!isNaN(py0) && py0 >= 0 && py0 <= 100){
			this.py0 = py0;
		}
	};

	this.setPx1 = function(px1) {
		if(!isNaN(px1) && px1 >= 0 && px1 <= 100){
			this.px1 = px1;
		}
	};

	this.setPy1 = function(py1) {
		if(!isNaN(py1) && py1 >= 0 && py1 <= 100){
			this.py1 = py1;
		}
	};

	this.addColorStop = function(stop, color) {
		if (isNaN(stop) || stop < 0 || stop > 100) {
			throw new TypeError(
					'O indice de parada deve ser um numero entre 0 e 100');
		}
		if (!(color instanceof Color)) {
			color = Color.parse(color);
		}
		this.colorsStop.push(new Array(stop, color));
	};

	this.getColorsStop = function() {
		return this.colorsStop;
	};
	
	this.getId = function(){
		return this.id;
	};
}