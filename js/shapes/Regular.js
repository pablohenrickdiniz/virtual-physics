FormaRegular.prototype = new Polygon();
function FormaRegular(center, radius, points, thickness, degree) {
	Polygon.call(this, center, degree);
	this.radius = isNaN(radius) || radius < 0 ? 10 : radius;
	this.points = isNaN(points) || points < 3 ? 3 : points;
	this.thickess = isNaN(thickness) || thickness < 1 ? 1 : thickness;

	this.getRadius = function() {
		return this.radius;
	};

	this.getPoints = function() {
		return this.points;
	};

	this.getThickness = function() {
		return this.thickess;
	};

	this.setRadius = function(radius) {
		if (!isNaN(radius)) {
			this.radius = radius;
			this.updatePoints();
		}
	};

	this.setPoints = function(points) {
		if (!isNaN(points)) {
			points = parseInt(points);
			this.points = points;
			this.updatePoints();
		}
	};

	this.setThickness = function(thickness) {
		if (!isNaN(thickness)) {
			this.thickess = thickness;
			this.updatePoints();
		}
	};

	this.setDegree = function(degree) {
		this.degree = filterDegree(degree);
		this.updatePoints();
	};

	this.updatePoints = function() {
		var ga = (360 / this.points);
		var gb = (360 / this.points) / 2;
		var points = new Array();

		var pa = new Point(this.center.getX(), this.center.getY() - this.radius
				* this.thickess);
		var pb = new Point(this.center.getX(), this.center.getY() - this.radius);
		pa.setFather(this);
		pb.setFather(this);
		pa.rotate(this.degree,this.center);
		pb.rotate(this.degree + gb,this.center);

		points.push(pa);
		points.push(pb);

		for (var i = 1; i < this.points; i++) {
			pa = new Point(pa.getX(), pa.getY());
			pb = new Point(pb.getX(), pb.getY());
			pa.setFather(this);
			pb.setFather(this);
			pa.rotate(ga,this.center);
			pb.rotate(ga,this.center);
			points.push(pa);
			points.push(pb);
		}

		this.setPoints(points);
	};

	this.getCircumscribedSquare = function() {
		return new Rect(this.center, this.radius * 2, this.radius * 2);
	};

	this.getArea = function() {
		return this.thickess * this.radius;
	};
	
	this.updatePoints();
}
