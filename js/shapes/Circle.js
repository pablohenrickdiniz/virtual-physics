Circle.prototype = new Arc();

function Circle(center, radius) {
	Arc.call(this, center, radius, 0, 360);

	this.getCircumscribedSquare = function() {
		return new Rect(this.center, this.radius * 2, this.radius * 2);
	};

	this.getArea = function() {
		Math.PI * Math.pow(this.radius, 2);
	};
};