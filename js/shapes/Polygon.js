Polygon.prototype = new Shape();

function Polygon(center, degree) {
	Shape.call(this, center, 'white', new Border('black', 1), degree);

	this.minPoint = null;
	this.maxPoint = null;
	this.points = new Array();

	this.getPoints = function() {
		return this.points;
	};

	this.getPoint= function(index) {
		return this.points[index];
	};

	this.setPoints = function(points) {
		if (points instanceof Array) {
			this.minPoint = null;
			this.maxPoint = null;
			this.points = points;
			for (var i = 0; i < this.points.length; i++) {
				this.points[i].setFather(this);
				this.points[i].rotate(this.degree);
				this.setMinAndMaxValues(this.points[i]);
			}
		}
	};

	this.addPoint = function(point) {
		if (point instanceof Point) {
			point.setFather(this);
			point.rotate(this.degree);
			this.points.push(point);
			this.setMinAndMaxValues(point);
		}
	};

	this.setPoint = function(index, point) {
		if (point instanceof Point && isNaN(index)) {
			index = parseInt(index);
			point.setFather(this);
			point.rotate(this.degree);
			this.points[index] = point;
			this.setMinAndMaxValues(point);
		}
	};

	this.setMinAndMaxValues = function(point) {
		if (point instanceof Point) {
			if (this.minPoint == null && this.maxPoint == null) {
				this.minPoint = new Point(point.getX(), point.getY());
				this.maxPoint = new Point(point.getX(), point.getY());
			} else {
				this.minPoint.setX(Math.min(this.minPoint.getX(), point.getX()));
				this.minPoint.setY(Math.min(this.minPoint.getY(), point.getY()));
				this.maxPoint.setX(Math.max(this.maxPoint.getX(), point.getX()));
				this.maxPoint.setY(Math.max(this.maxPoint.getY(), point.getY()));
			}
		}
	};

	this.rotate = function(degree, origin) {
		degree = filterDegree(degree);
		if(!(origin instanceof Point)){
			origin = this.center;
		}
		else{
			this.center.rotate(degree,origin);
		}
			
		this.minPoint = null;
		this.maxPoint = null;
		for (var i = 0; i < this.points.length; i++) {
			this.points[i].rotate(degree,origin);
			this.setMinAndMaxValues(this.points[i]);
		}
	};

    this.translate = function(x,y){
        x = isNaN(x)?0:x;
        y = isNaN(y)?0:y;

        for(var i = 0; i < this.points.length;i++){
            this.points[i].setX(this.points[i].getX()+x);
            this.points[i].setY(this.points[i].getY()+y);
        }
        this.center.setX(this.center.getX()+x);
        this.center.setY(this.center.getY()+y);
    };

    this.moveTo = function(x,y){
        var xd = 0;
        var yd = 0;
        if(!isNaN(x)){
            xd = this.center.getX()-x;
            this.center.setX(x);
        }

        if(!isNaN(y)){
            yd = this.center.getY()-y;
            this.center.setY(y);
        }
        for(var i = 0; i < this.points.length;i++){
            this.points[i].setX(this.points[i].getX()-xd);
            this.points[i].setY(this.points[i].getY()-yd);
        }
    };

	this.invertHorizontally = function() {
		for ( var index in this.points) {
			this.points[index].invertHorizontally(this.center);
			this.setMinAndMaxValues(this.points[index]);
		}
	};

	this.invertVertically = function() {
		for ( var index in this.points) {
			this.points[index].invertVertically(this.center);
			this.setMinAndMaxValues(this.points[index]);
		}
	};

	this.getCircumscribedSquare = function() {
		var center = new Point(this.center.getX(), this.center.getY());
		var width= this.maxPoint.getX() - this.minPoint.getX();
		var height = this.maxPoint.getY() - this.minPoint.getY();
		var box = new Rect(center, width, height);
		return box;
	};
	
	this.updateCenter = function(){
		this.center.setX((this.maxPoint.getX()+this.minPoint.getX())/2);
		this.center.setY((this.maxPoint.getY()+this.minPoint.getY())/2);
	};

	this.getCenter = function() {
		return this.center;
	};

	this.setDegree = function(degree, origin) {
        degree = filterDegree(degree,null);
        if(degree != null){
            this.rotate(this.degree*-1, origin);
            this.rotate(degree, origin);
            this.degree = degree;
        }
	};

    this.getArea = function(){
        return this.getCircumscribedSquare().getArea();
    };


}
