Polygon.prototype = new Shape();

function Polygon(center, theta) {
    Shape.call(this, center, 'white', new Border('black', 1), theta);
    this.vertices = [];
    this.min = [];
    this.max = [];

    this.rotate = function (theta, origin) {
        if (origin == undefined) {
            origin = this.center;
        }
        else {
            this.center = MV.rotate(this.center, theta, origin);
        }
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = MV.rotate(this.vertices[i], theta, origin);
        }
    };

    this.updateCenter = function () {
        var centroid = [0, 0];
        var a = 0;
        for (var i = 0; i < this.vertices.length; i++) {
            var pos = i+1==this.vertices.length?0:i+1;
            var va = this.vertices[i];
            var vb = this.vertices[pos];
            var mult = va[0] * vb[1] - vb[0] * va[1];
            centroid[0] += (va[0] + vb[0]) * mult;
            centroid[1] += (va[1] + vb[1]) * mult;
            a += mult;
        }
        a *= 0.5;
        this.area = a;
        var m = 1 / (6 * a);
        centroid[0] *= m;
        centroid[1] *= m;
        this.center = centroid;
    }

    this.updateVertices = function(){
        for(var i = 0; i < this.vertices.length;i++){
            this.vertices[i][0] = this.center[0]-this.vertices[i][0];
            this.vertices[i][1] = this.center[1]-this.vertices[i][1];
        }
    };


    this.moi= function (mass) {
        var cv = this.center;
        var moi = 0;
        for(var i = 0; i< this.vertices.length;i++){
            var pos = i+1==this.vertices.length?0:i+1;
            var va = this.vertices[i];
            var vb = this.vertices[pos];
            var b = MV.distance(va,vb);
            var ca = MV.distance(vb,cv);
            var cb = MV.distance(va,cv);
            var h = 2*(ca/cb);
            var a = 0;
            if(ca < cb){
                a = Math.sqrt(Math.pow(ca,2)-Math.pow(h,2));
            }
            else{
                a = Math.sqrt(Math.pow(cb,2)-Math.pow(h,2));
            }
            var moit = (Math.pow(h,3)*b-Math.pow(b,2)*h*a+b*h*Math.pow(a,2)+b*Math.pow(h,3))/36;
            var centroid = [(va[0] + vb[0] + cv[0]) / 3, (va[1] + vb[1] + cv[1]) / 3];
            var masst = (b*h*mass)/this.area;
            moi+=moit+masst*Math.pow(MV.distance(centroid,cv),2);
        }
        console.log(Delaunay.triangulate(this.vertices))
        return moi;
    };
    this.updateRelative = function () {
        var cx = this.center[0];
        var cy = this.center[1];
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            vertex[0] = (cx - vertex[0]) * -1;
            vertex[1] = (cy - vertex[1]) * -1;
        }
        this.vertices = this.vertices.reverse();
        this.updateMinAndMax();
    };

    this.updateMinAndMax = function () {
        var min = [this.vertices[0][0], this.vertices[0][1]];
        var max = [this.vertices[0][0], this.vertices[0][1]];
        for (var i = 1; i < this.vertices.length; i++) {
            for (var j = 0; j <= 1; j++) {
                if (this.vertices[i][j] < min[j]) {
                    min[j] = this.vertices[i][j];
                }
                else if (this.vertices[i][0] > max[0]) {
                    max[j] = this.vertices[i][j];
                }
            }
        }
        this.min = min;
        this.max = max;
    };
}
