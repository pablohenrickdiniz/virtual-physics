Line.prototype = new Shape();

function Line(pointA, pointB){
	this.pointA = !(pointA instanceof Point)?new Point(0,0):pointA;
	this.pointB = !(pointB instanceof Point)?new Point(0,0):pointB;
	Shape.call(this, this.getCenter(), new Color(0,0,0), undefined, 0);
	this.degree = null;
	this.getCenter = function() {
		if (this.center == null) {
			this.center = Point.middle(this.pointA, this.pointB);
		}
		return this.center;
	};

	this.getLength = function() {
		if (isNaN(this.length)) {
			this.length = Point.distance(this.pointA, this.pointB);
		}
		return this.length;
	};
	
	this.getArea = function(){
		return this.getLength();
	};

	this.setPointA = function(pointA) {
		this.pointA = pointA;
		this.length = null;
		this.center = null;
		this.degree = null;
	};

	this.setPontoB = function(pointB) {
		this.pointB = pointB;
		this.length = null;
		this.center = null;
		this.degree = null;
	};

	this.getPointA = function() {
		return this.pointA;
	};

	this.getPointB = function() {
		return this.pointB;
	};
	
	this.getDegree = function(){
		if(this.degree == null){
			var pax = this.pointA.getX();
			var pay = this.pointA.getY();
			var pbx = this.pointB.getX();
			var pby = this.pointB.getY();
			this.degree = getDegree(pbx-pax,pby-pay);
		}
		return this.degree;
	};

	this.setDegree = function(degree, origin) {
		if (!isNaN(degree)) {
            degree = filterDegree(degree);
			this.rotate(this.degree*-1, origin);
			this.rotate(degree, origin);
            this.oldDegree = this.degree;
			this.degree = degree;
		}
	};
	
	this.rotate = function(degree, origin) {
		if (!isNaN(degree)) {
			degree = filterDegree(degree);
			if(!(origin instanceof Point)){
				origin = this.center;
			}
			else{
				this.center.rotate(degree,origin);
			}
			
			this.pointA.rotate(degree,origin);
			this.pointB.rotate(degree,origin);
		}
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
       
        this.pointA.setX(this.pointA.getX()-xd);
        this.pointA.setY(this.pointA.getY()-yd);
        this.pointB.setX(this.pointA.getX()-xd);
        this.pointB.setY(this.pointA.getY()-yd);
        
        if(this.color instanceof LinearGradient){
        	var cx = this.cor.getX0()-xd;
        	var cy = this.cor.getY0()-yd;
        	this.color.moveTo(cx,cy);
        }
    };
    
    this.translate = function(x,y){
        x = isNaN(x)?0:x;
        y = isNaN(y)?0:y;

        this.pointA.setX(this.pointA.getX()+x);
        this.pointA.setY(this.pointA.getY()+y);
        this.pointB.setX(this.pointB.getX()+x);
        this.pointB.setY(this.pointB.getY()+y);
        
        this.center.setX(this.center.getX()+x);
        this.center.setY(this.center.getY()+y);
        if(this.color instanceof LinearGradient){
        	this.color.translate(x,y);
        }
    };
    
	this.invertHorizontally = function() {
		this.pointA.invertHorizontally(this.center);
		this.pointB.invertVertically(this.center);
	};

	this.invertVertically = function() {
		this.pointA.invertHorizontally(this.center);
		this.pointB.invertVertically(this.center);
	};
	
	this.setThickness = function(thickness){
		if(!isNaN(thickness) && thickness > 0){
			this.thickess = thickness;
		}
	};
	


    this.getAngularCoeficient = function(){
        var xa = this.pointA.getX();
        var ya = this.pointA.getY();
        var xb = this.pointB.getX();
        var yb = this.pointB.getY();
        return (yb-ya)/(xb-xa);
    };

    this.havePoint = function(point){
        var xa = this.pointA.getX();
        var ya = this.pointA.getY();
        var xb = this.pointB.getX();
        var yb = this.pointB.getY();
        var x = point.getX();
        var y = point.getY();
        var maxX = Math.max(xa,xb);
        var minX = Math.min(xa,xb);
        var maxY = Math.max(ya,yb);
        var minY = Math.min(ya,yb);

        if(x <= maxX && x >= minX && y <= maxY && y >= minY){
            var cof = (yb-ya)/(xb-xa);
            alert('cof:'+cof+'\nx:'+x+'\ny:'+y+"\nxa:"+xa+'\nya:'+ya+'\nxb:'+xb+'\nyb:'+yb);
            alert('(('+cof+'*'+x+')-('+cof+'*'+xa+')-'+y+'+'+ya+')');
            var result = ((cof*x)-(cof*xa)-y+ya);
            alert(result);
            return (result == 0);
        }
        return false;
    };
}


Line.intersection = function(lineA, lineB){
    var lapa = lineA.getPointA();
    var lapb = lineA.getPointB();
    var lbpa = lineB.getPointA();
    var lbpb = lineB.getPointB();

    var x1 = lapa.getX();
    var y1 = lapa.getY();
    var x2 = lapb.getX();
    var y2 = lapb.getY();
    var x3 = lbpa.getX();
    var y3 = lbpa.getY();
    var x4 = lbpb.getX();
    var y4 = lbpb.getY();

    var xa = (((x1*y2)-(y1*x2))*(x3-x4))-((x1-x2)*((x3*y4)-(y3*x4)));
    var xb = ((x1-x2)*(y3-y4)) - ((y1-y2)*(x3-x4));
    var ya = (((x1*y2)-(y1*x2))*(y3-y4))-((y1-y2)*((x3*y4)-(y3*x4)));
    var yb = ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4));

    if(xb == 0 || xa == 0){
        return null;
    }
    else{
        var x = xa/xb;
        var y = ya/yb;
        return new Point(x,y);
    }
};

