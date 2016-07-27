(function(){
    var Regular = function(radius,sides) {
        var self = this;
        Polygon.apply(self);
        self.radius = radius;
        self.sides = sides;
        self.thickness = 1;
        self.area = 0.5 * self.sides * (2 * self.radius * Math.sin(MV.toRadians(180 / self.sides))) * self.radius;
        self.updateVertices();
    };

    Regular.prototype = Object.create(Polygon.prototype);
    Regular.constructor = Regular;


    Regular.prototype.setRadius = function(radius){
        var self = this;
        if(self.radius != radius){
            self.radius = radius;
            self.updateVertices();
        }
    };

    Regular.prototype.setSides = function(sides){
        var self = this;
        if(self.sides != sides){
            self.sides = sides;
            self.updateVertices();
        }
    };


    Regular.prototype.updateVertices = function () {
        var self = this;
        var ga = (360 / self.sides);
        //var gb = (360 / this.sides) / 2;
        var pa = [0, -self.radius];
        //var pb = [0,- this.radius];
        pa = MV.rotate(pa, -self.theta, [0, 0]);
        //pb = MV.rotate(pb, -this.theta - gb, [0,0]);
        self.vertices = [];
        self.vertices[self.vertices.length] = pa;
        //this.vertices.push(pb);
        var i;

        for (i = 1; i < self.sides; i++) {
            pa = [pa[0], pa[1]];
            //pb = [pb[0], pb[1]];
            pa = MV.rotate(pa, -ga, [0, 0]);
            //pb = MV.rotate(pb, -ga, [0,0]);
            self.vertices[self.vertices.length] = pa;
            //this.vertices.push(pb);
        }
        self.updateMinAndMax();
    };

    w.Regular = Regular;

    /*
     Regular.prototype.moi = function (mass) {
     var self = this;
     var size;
     if(self.vertices.length == 4){
     size = MV.distance(self.vertices[0],self.vertices[1]);
     return mass / 12 * (size * size + size * size);
     }
     else{
     var sum1 = 0;
     var sum2 = 0;
     size = self.vertices.length;
     var n;
     var pn;
     var pn1;
     var norm;
     var pos;
     for (n = 0; n < size; n++) {
     pos = n + 1 == size ? 0 : n + 1;
     pn = self.vertices[n];
     pn1 = self.vertices[pos];
     norm = MV.norm(MV.VxV(pn, pn1));
     sum1 += norm * MV.dot(pn1, pn1) + MV.dot(pn1, pn) + MV.dot(pn, pn);
     sum2 += norm;
     }
     return (mass / 6) * (sum1 / sum2);
     }
     };*/
})(window);
