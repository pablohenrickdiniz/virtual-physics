Trapezius.prototype = new Polygon();
function Trapezius(center,baseA, baseB, height){
	Polygon.call(this, center);
	
	this.baseA = isNaN(baseA) || baseA <= 0?20:baseA;
	this.baseB = isNaN(baseB) || baseA <= 0?15:baseB;
	this.height = isNaN(height) || height <= 0 ? 10: height;
	
	this.getBaseA = function(){
		return this.baseA;
	};
	
	this.getBaseB = function(){
		return this.baseB;
	};
	
	this.getHeigth = function(){
		return this.height;
	};
	
	this.setBaseA = function(baseA){
		if(!isNaN(baseA) && baseA != this.baseA && baseA > 0){
			this.baseA = baseA;
			this.updatePoints();
		}
	};
	
	this.setBaseSuperior = function(baseB){
		if(!isNaN(baseB) && baseB != this.baseB && baseB > 0){
			this.baseB = baseB;
			this.updatePoints();
		}
	};
	
	this.setHeight = function(height){
		if (!isNaN(height) && height != this.height && height > 0){
			this.height = height;
			this.updatePoints();
		}
	};
	

	this.updatePoints = function() {
		var points = new Array();
		var x = this.center.getX();
		var y = this.center.getY();
		var pa = new Point(x - (this.baseB * 0.5), y - (this.height * 0.5));
		var pb = new Point(x + (this.baseB * 0.5), y - (this.height * 0.5));
		var pc = new Point(x + (this.baseA * 0.5), y + (this.height * 0.5));
		var pd = new Point(x - (this.baseA * 0.5), y + (this.height * 0.5));
		points.push(pa);
		points.push(pb);
		points.push(pc);
		points.push(pd);
		this.setPoints(points);
	};
	
	this.updatePoints();
}