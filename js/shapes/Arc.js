Arc.prototype = new Shape();

function Arc(center, radius, startDegree, endDegree) {
	Shape.call(this, center, 'white', new Border('black', 1), 0);
	this.radius = isNaN(radius) ? 10 : radius;
	this.startDegree = filterDegree(startDegree,this.degree);
	this.endDegree   = filterDegree(endDegree,this.degree+180);

	this.getRadius = function() {
		return this.radius;
	};

	this.getStartDegree = function() {
		return this.startDegree;
	};

	this.getEndDegree = function() {
		return this.endDegree;
	};

	this.setStartDegree = function(startDegree) {
		this.startDegree = this.degree+filterDegree(startDegree);;
	};

	this.setEndDegree = function(endDegree) {
		this.endDegree = this.degree+filterDegree(endDegree);
	};

	this.setRadius = function(radius) {
		if (!isNaN(radius)) {
			this.radius = radius;
		}
	};
	
	this.moveTo = function(x, y){
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
        
        if(this.color instanceof LinearGradient){
        	var cx = this.color.getX0()-xd;
        	var cy = this.color.getY0()-yd;
        }
	};
	
	this.translate = function(x,y){
	    x = isNaN(x)?0:x;
	    y = isNaN(y)?0:y;
	    this.center.setX(this.center.getX()+x);
	    this.center.setY(this.center.getY()+y);
	};
	
	this.setDegree = function(degree, origin) {
        degree = filterDegree(degree);
	    this.rotate(this.degree*-1, origin);
		this.rotate(degree, origin);
		var startDegree = this.startDegree - this.degree;
		var endDegree   = this.endDegree   - this.degree;
        this.oldDegree = this.degree;
		this.degree = degree;
		this.startDegree = startDegree+this.degree;
		this.endDegree   = endDegree  +this.degree;
	};
	
	this.rotate = function(degree, origin) {
		degree = filterDegree(degree,0);
		if(origin instanceof Point){
			this.center.rotate(degree,origin);
		}
        this.startDegree = filterDegree(this.startDegree+degree);
        this.endDegree   = filterDegree(this.endDegree+degree);
	};
}
