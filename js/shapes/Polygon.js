define(['Shape','Color','Border','MV'],function(Shape,Color,Border,MV){
    var Polygon = function(properties) {
        var self = this;
        Shape.apply(self);
        self.vertices = [];
        self.min = [];
        self.max = [];
        self.AABB = null;
        self.bindProperties();
        self.set(properties);
    };

    Polygon.prototype = new Shape;

    Polygon.prototype.add = function(vertice){
        var self = this;
        if(!self.contains(vertice)){
            self.vertices.push(vertice);
            return true;
        }
        return false;
    };


    Polygon.prototype.contains = function(vertice){
        var self = this;
        var find = false;
        var size = self.vertices.length;

        for(var i = 0; i < size;i++){
            var tmp = self.vertices[i];
            if(tmp[0] == vertice[0] && tmp[1] == vertice[1]){
                return true;
            }
        }

        return false;
    };

    Polygon.prototype.last = function() {
        var self = this;
        if (self.vertices.length > 0) {
            return self.vertices[self.vertices.length-1];
        }
        return null;
    };


    Polygon.prototype.removeLast = function(){
        var self = this;
        if(self.vertices.length > 0){
            self.vertices.length = self.vertices.length -1;
        }
    };

    Polygon.prototype.bindProperties = function(){
        var self = this;
        self.onChange('vertices',function(){
            self.updateCenter();
        });
    };


    Polygon.prototype.isInside = function (c) {
        var self = this;
        var a = self.getVerticesInWorldCoords();
        var f = a.length;
        var e = !1;
        var b;
        var d;
        b = -1;
        for (d = f - 1; ++b < f; d = b)
            (a[b][1] <= c[1] && c[1] < a[d][1] || a[d][1] <= c[1] && c[1] < a[b][1]) && c[0] < (a[d][0] - a[b][0]) * (c[1] - a[b][1]) / (a[d][1] - a[b][1]) + a[b][0] && (e = !e);
        return e;
    };

    Polygon.prototype.getVerticesInWorldCoords = function () {
        var self = this;
        var a = [];
        var g = self.vertices;
        var f = g.length;
        var cx = self.getCenter();
        for(var i = 0; i < f;i++){
            a.push(MV.rotate(MV.VpV(cx,g[i]),MV.toDegree(self.theta),self.center));
        }
        return a;
    };

    Polygon.prototype.getCenter = function(){
        if(this.center == null || this.center == undefined){
            this.updateCenter();
        }
        return this.center;
    };

    Polygon.prototype.getRelativeVertices = function(){
        var self = this;
        var g = self.vertices;
        var size = g.length;
        var i;
        var a =[];
        var c = self.center;
        for(i=0;i<size;i++){
            a.push([-(c[0]-g[i][0]),-(c[1]-g[i][1])]);
        }
        return a;
    };

    Polygon.prototype.rotate = function (theta, origin) {
        var self = this;
        if (origin == undefined) {
            origin = self.center;
        }
        else {
            self.center = MV.rotate(self.center, theta, origin);
        }
        var size = self.vertices.length;
        var i;
        for (i = 0; i < size; i++) {
            self.vertices[i] = MV.rotate(self.vertices[i], theta, origin);
        }
    };

    Polygon.prototype.updateCenter = function () {
        var self = this;
        self.center = Polygon.centroid(self.vertices);
        self.area = Polygon.area(self.vertices);
    };

    Polygon.prototype.moi2 = function (mass) {
        var self = this;
        var sum1 = 0;
        var sum2 = 0;
        var pos;
        var pn;
        var pn1;
        var norm;
        var size = self.vertices.length;
        var n;

        for (n = 0; n < size; n++) {
            pos = n + 1 == size ? 0 : n + 1;
            pn = self.vertices[n];
            pn1 = self.vertices[pos];
            norm = MV.norm(MV.VxV(pn, pn1));
            sum1 += norm * MV.dot(pn1, pn1) + MV.dot(pn1, pn) + MV.dot(pn, pn);
            sum2 += norm;
        }
        return (mass / 6) * (sum1 / sum2);
    };

    Polygon.prototype.moi = function (mass) {
        var self = this;
        var cv = self.center;
        var moi = 0;
        var i;
        var size = self.vertices.length;
        var pos;
        var va;
        var vb;
        var b;
        var ca;
        var cb;
        var h;
        var a;
        var moit;
        var masst;



        for (i = 0; i < size; i++) {
            pos = i + 1 == size ? 0 : i + 1;
            va = self.vertices[i];
            vb = self.vertices[pos];
            b = MV.distance(va, vb);
            ca = MV.distance(vb, cv);
            cb = MV.distance(va, cv);
            h = 2 * (ca / cb);
            a = 0;
            if (ca < cb) {
                a = Math.sqrt(Math.pow(ca, 2) - Math.pow(h, 2));
            }
            else {
                a = Math.sqrt(Math.pow(cb, 2) - Math.pow(h, 2));
            }
            moit = (Math.pow(h, 3) * b - Math.pow(b, 2) * h * a + b * h * Math.pow(a, 2) + b * Math.pow(h, 3)) / 36;
            masst = (b * h * mass) / self.area;
            moi += moit + masst * Math.pow(MV.distance(cv, cv), 2);
        }
        return moi;
    };

    Polygon.prototype.updateRelative = function () {
        var self = this;
        self.vertices = self.vertices.reverse();
        var cx = self.center[0], cy = self.center[1], i, size = self.vertices.length, vertex;
        for (i = 0; i < size; i++) {
            vertex = self.vertices[i];
            vertex[0] = (cx - vertex[0]) * -1;
            vertex[1] = (cy - vertex[1]) * -1;
        }
        self.updateMinAndMax();
    };

    Polygon.prototype.updateMinAndMax = function () {
        var self = this;
        var min = [self.vertices[0][0], self.vertices[0][1]];
        var max = [self.vertices[0][0], self.vertices[0][1]];
        var size = self.vertices.length, i, j;

        for (i = 1; i < size; i++) {
            for (j = 0; j <= 1; j++) {
                if (self.vertices[i][j] < min[j]) {
                    min[j] = self.vertices[i][j];
                }
                else if (self.vertices[i][0] > max[j]) {
                    max[j] = self.vertices[i][j];
                }
            }
        }
        self.min = min;
        self.max = max;
    };

    Polygon.prototype.invertPath = function(){
        var self = this;
        var first = self.vertices.shift();
        self.vertices.reverse();
        self.vertices.unshift(first);
    };

    Polygon.prototype.isClockWise = function () {
        var self = this;
        var sum = 0, i, size = self.vertices.length, j, va, vb;
        for (i = 0; i < size; i++) {
            j = i + 1 == size ? 0 : i + 1;
            va = self.vertices[i];
            vb = self.vertices[j];
            sum += ((vb[0] - va[0]) * (vb[1] + va[1]))
        }
        return sum < 0;
    };

    Polygon.prototype.sumAngles = function () {
        return Polygon.sumAngles(this.vertices);
    };

    Polygon.prototype.isConvex = function () {
        return Polygon.isConvex(this.vertices);
    };


    Polygon.centroid = function(vertices){
        var self = this;
        var centroid = [0, 0];
        var a = 0;
        var size = vertices.length;
        var pos;
        var vb;
        var mult;
        var va;
        var m;
        var i;
        for (i = 0; i < size; i++) {
            pos = i + 1 == size ? 0 : i + 1;
            va = vertices[i];
            vb = vertices[pos];
            mult = va[0] * vb[1] - vb[0] * va[1];
            centroid[0] += (va[0] + vb[0]) * mult;
            centroid[1] += (va[1] + vb[1]) * mult;
            a += mult;
        }
        a *= 0.5;
        m = 1 / (6 * a);
        centroid[0] *= m;
        centroid[1] *= m;
        return centroid;
    };

    Polygon.area = function(vertices){
        var a = 0;
        var size = vertices.length;
        var pos;
        var vb;
        var mult;
        var va;
        var m;
        var i;
        for (i = 0; i < size; i++) {
            pos = i + 1 == size ? 0 : i + 1;
            va = vertices[i];
            vb = vertices[pos];
            mult = va[0] * vb[1] - vb[0] * va[1];
            a += mult;
        }
        a*= 0.5;
        return a;
    };


    Polygon.sumAngles = function(vertices){
        var sum = 0;
        var i;
        var size = vertices.length;
        var j;
        var k;
        var vb;
        var va;
        var vc;
        var v1;
        var v2;

        if(vertices.length >= 3){
            for (i = 0; i < size; i++) {
                j = i+1;
                j = j >= size?0:j;
                k = j+1;
                k = k >= size?0:k;
                va = vertices[i];
                vb = vertices[j];
                vc = vertices[k];
                v1 = MV.VmV(vb, va);
                v2 = MV.VmV(vc, vb);
                sum += MV.getDegree(v1, v2);
            }
        }

        return sum;
    };

    Polygon.isConvex = function(vertices){
        return Polygon.sumAngles(vertices) > 360;
    };

    return Polygon;
});



