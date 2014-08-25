function Point(x, y) {
	this.father = null;
	this.x = isNaN(x) ? 0 : x;
	this.y = isNaN(y) ? 0 : y;
	this.oldX = this.x;
	this.oldY = this.y;

	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.getOldX = function() {
		return this.oldX;
	};

	this.getOldY = function() {
		return this.oldY;
	};

	this.setX = function(x) {
		if (!isNaN(x) && x != this.x) {
			this.oldX = this.x;
			this.x = x;
		}
	};

	this.setY = function(y) {
		if (!isNaN(y) && y != this.y) {
			this.oldY = this.y;
			this.y = y;
		}
	};

	this.setFather = function(father) {
		if (father instanceof Shape) {
			this.father = father;
		}
	};

	this.getFather = function() {
		return this.father;
	};

	this.rotate = function(degree, center) {
		var radians = degreeToRadians(degree);
		if (!(center instanceof Point)) {
			center = new Point(0, 0);
		}
		var xf = (((this.x - center.getX()) * Math.cos(radians)) - ((this.y - center
				.getY()) * Math.sin(radians)))
				+ center.getX();
		var yf = (((this.y - center.getY()) * Math.cos(radians)) + ((this.x - center
				.getX()) * Math.sin(radians)))
				+ center.getY();
		this.x = xf;
		this.y = yf;
	};

	this.invertHorizontally = function(centro) {
		if (!(centro instanceof Ponto)) {
			centro = new Ponto(0, 0);
		}

		var distance = centro.getX() - this.x;
		this.x = centro.getX() + distance;
	};

	this.invertVertically = function(center) {
		if (!(center instanceof Point)) {
			center = new Point(0, 0);
		}

		var distance = center.getY() - this.y;
		this.y = center.getY() + distance;
	};

	this.toString = function() {
		return "point(" + this.x + "," + this.y + ")";
	};
}

Point.middle = function(pointA, pointB) {
	var pax = pointA.getX();
	var pay = pointA.getY();
	var pbx = pointB.getX();
	var pby = pointB.getY();
	return new Point((pax + pbx) / 2, (pay + pby) / 2);
};

Point.distance = function(pointA, pointB) {
	var xmax = Math.max(pointA.getX(), pointB.getX());
	var ymax = Math.max(pointA.getY(), pointB.getY());
	var xmin = Math.min(pointA.getX(), pointB.getX());
	var ymin = Math.min(pointA.getY(), pointB.getY());
	var catetoA = xmax - xmin;
	var catetoB = ymax - ymin;
	return Math.sqrt(Math.pow(catetoA, 2) + Math.pow(catetoB, 2));
};
