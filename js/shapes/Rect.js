Rect.prototype = new Polygon();
function Rect(center, width, height) {
	Polygon.call(this, center);
	this.width = isNaN(width) || width <= 0 ? 10: width;
	this.height =  isNaN(height) || height <= 0 ? 10: height;

	this.getWidth = function() {
		return this.width;
	};

	this.getHeigth = function() {
		return this.height;
	};

	this.setWidth = function(width) {
		if (!isNaN(width) && width != this.width && width > 0) {
			this.width = width;
			this.updatePoints();
		}

	};

	this.setHeight = function(height) {
		if (!isNaN(height) && height != this.height && width > 0) {
			this.height = height;
			this.updatePoints();
		}
	};

	this.updatePoints = function() {
		var points = new Array();
		var x = this.center.getX();
		var y = this.center.getY();
		var pa = new Point(x - (this.width * 0.5), y - (this.height * 0.5));
		var pb = new Point(x + (this.width * 0.5), y - (this.height * 0.5));
		var pc = new Point(x + (this.width * 0.5), y + (this.height * 0.5));
		var pd = new Point(x - (this.width * 0.5), y + (this.height * 0.5));
		points.push(pa);
		points.push(pb);
		points.push(pc);
		points.push(pd);
		this.setPoints(points);
	};

	this.getArea = function() {
		return this.width * this.height;
	};

	this.updatePoints();
}
