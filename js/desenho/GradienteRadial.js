GradienteRadial.prototype = new GradienteLinear();
function GradienteRadial(x0, y0, r0, x1, y1, r1) {
	GradienteLinear.call(this, x0, y0, x1, y1);
	this.r0 = isNaN(r0) || r0 <= 0 ? 10 : r0;
	this.r1 = isNaN(r1) || r1 <= 0 ? 10 : r0;

	this.getR0 = function() {
		return this.r0;
	};

	this.getR1 = function() {
		return this.r1;
	};

	this.setR0 = function(r0) {
		if (!isNaN(r0) && r0 >= 0) {
			this.r0 = r0;
		}
	};

	this.setR1 = function(r1) {
		if (!isNaN(r1) && r1 >= 0) {
			this.r1 = r1;
		}
	};
	
	this.moverPara = function(x,y){
		var dx = this.x1 - this.x0;
		var dy = this.y1 - this.y0;
		this.x0 = x;
		this.y0 = y;
		this.x1 = x+dx;
		this.y1 = y+dy;
	};
}