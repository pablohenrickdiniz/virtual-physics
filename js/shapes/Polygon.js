Polygon.prototype = new Shape([0,0],null,null,0);

function Polygon(center, theta) {
    Shape.call(this, center, new Color('White'), new Border('black', 1), theta);
    var self = this;
    self.vertices = [];
    self.min = [];
    self.max = [];
    this.AABB = null;
}

Polygon.prototype.contains = function (c) {
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
    var centroid = [0, 0];
    var a = 0;
    var size = self.vertices.length;
    var pos;
    var vb;
    var mult;
    var va;
    var m;
    var i;
    for (i = 0; i < size; i++) {
        pos = i + 1 == size ? 0 : i + 1;
        va = self.vertices[i];
        vb = self.vertices[pos];
        mult = va[0] * vb[1] - vb[0] * va[1];
        centroid[0] += (va[0] + vb[0]) * mult;
        centroid[1] += (va[1] + vb[1]) * mult;
        a += mult;
    }
    a *= 0.5;
    self.area = a;
    m = 1 / (6 * a);
    centroid[0] *= m;
    centroid[1] *= m;
    self.center = centroid;
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
    var centroid;
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
        centroid = [(va[0] + vb[0] + cv[0]) / 3, (va[1] + vb[1] + cv[1]) / 3];
        masst = (b * h * mass) / self.area;
        moi += moit + masst * Math.pow(MV.distance(centroid, cv), 2);
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
    var self = this;
    var sum = 0;
    var i;
    var size = self.vertices.length;
    var j;
    var k;
    var vb;
    var va;
    var vc;
    var v1;
    var v2;
    for (i = 0; i < size; i++) {
        j = i + 1 == size ? 0 : i + 1;
        k = j + 1 == size ? 0 : j + 1;
        va = self.vertices[i];
        vb = self.vertices[j];
        vc = self.vertices[k];
        v1 = MV.VmV(vb, va);
        v2 = MV.VmV(vc, vb);
        sum += MV.getDegree(v1, v2);
    }
    return sum;
};

Polygon.prototype.isConvex = function () {
    var self = this;
    return self.sumAngles() > 360;
};

Polygon.join = function (a,b) {
    var vas = a.getVerticesInWorldCoords();
    var vbs = b.getVerticesInWorldCoords();
    var subj = Polygon.toClipper(vas);
    var clips= Polygon.toClipper(vbs);
    var solution = new ClipperLib.Path();
    var c = new ClipperLib.Clipper();
    c.AddPath(subj, ClipperLib.PolyType.ptSubject, true);
    c.AddPath(clips, ClipperLib.PolyType.ptClip, true);
    c.Execute(ClipperLib.ClipType.ctUnion, solution);
    return Polygon.fromClipper(solution);
};

Polygon.joinAll = function(polygons){
    for(var i = 0; i < polygons.length;i++){
        for(var j = i+1; j < polygons.length;j++){

            var result = Polygon.join(polygons[i][0],polygons[j][0]);

            if(result.length == 1){
                polygons[i] = [result[0],true];
                polygons.splice(j,1);
                j--;
            }
        }
    }

    return polygons;
};

Polygon.toClipper = function(vertices){
    var path = new ClipperLib.Path();
    for(var i = 0; i < vertices.length;i++){
        path.push(new ClipperLib.IntPoint(vertices[i][0], vertices[i][1]));
    }
    return path;
};

Polygon.fromClipper = function(vertices){
    var paths =[];
    for(var i = 0; i < vertices.length;i++){
        var polygon = new Polygon();
        for(var j = 0; j < vertices[i].length;j++){
            polygon.vertices.push([vertices[i][j].X,vertices[i][j].Y]);
        }
        paths.push(polygon);
    }
    return paths;
};



