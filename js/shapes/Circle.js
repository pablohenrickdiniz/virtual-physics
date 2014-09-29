Circle.prototype = new Arc();

function Circle(center, radius) {
	Arc.call(this, center, radius, 0, 360);
};