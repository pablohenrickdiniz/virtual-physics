/**
 * Created by Pablo Henrick Diniz on 24/08/14.
 */
Capsule.prototype = new Circle();

function Capsule(center,radius,length){
   Circle.call(this,center,radius);
   this.length = length;

   this.circleA = null;
   this.circleB = null;
   this.lineA = null;
   this.lineB = null;

   this.getLength = function(){
        return this.length;
   };

   this.setLength = function(length){
       this.length = length;
   };

   this.getCircleA = function(){
        if(this.circleA == null){
            var x = this.center.getX();
            var y = this.center.getY();
            this.circleA = new Circle(new Point(x-(this.length/2),y), this.radius);
            this.circleA.setStartDegree(90);
            this.circleA.setEndDegree(270);
        }
       return this.circleA;
   };

   this.getCircleB = function(){
       if(this.circleB == null){
           var x = this.center.getX();
           var y = this.center.getY();
           this.circleB = new Circle(new Point(x+(this.length/2),y), this.radius);
           this.circleB.setStartDegree(270);
           this.circleB.setEndDegree(90);
       }
       return this.circleB;
   };

   this.getLineA = function(){
       if(this.lineA == null){
           var x = this.center.getX();
           var y = this.center.getY();
           var len = this.length/2;
           this.lineA = new Line(new Point(x-len,y-this.radius),new Point(x+len,y-this.radius));
       }
       return this.lineA;
   };

   this.getLineB = function(){
        if(this.lineB == null){
            var x = this.center.getX();
            var y = this.center.getY();
            var len = this.length/2;
            this.lineB = new Line(new Point(x-len,y+this.radius),new Point(x+len,y+this.radius));
        }
       return this.lineB;
   };

    this.rotate = function(degree,origin){
        if(!(origin instanceof Point)){
            origin = this.center;
        }
        else{
            this.center.rotate(degree, origin);
        }

        this.getLineA().rotate(degree,origin);
        this.getLineB().rotate(degree,origin);
        this.getCircleA().rotate(degree, origin);
        this.getCircleB().rotate(degree, origin);
    };

    this.setDegree = function(degree){
        degree = filterDegree(degree);
        this.degree = degree;
        this.getLineA().setDegree(degree,this.center);
        this.getLineB().setDegree(degree,this.center);
        this.getCircleA().setDegree(degree,this.center);
        this.getCircleB().setDegree(degree,this.center);
    };

    this.getCircumscribedSquare = function(){
        var x = this.center.getX();
        var y = this.center.getY();
        var square = new Rect(new Point(x,y),this.length,this.radius*2);
        square.setDegree(this.degree);
        return square;
    };

    this.getCircles = function(){
        return new Array(this.getCircleA(), this.getCircleB());
    };

    this.getLines = function(){
        return new Array(this.getLineA(), this.getLineB());
    };
}