Polygon.prototype = new Shape();

function Polygon(center, theta) {
    Shape.call(this, center, new Color('White'), new Border('black', 1), theta);
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
        var size = this.vertices.length;
        for(var i = 0;i<size;i++){
            this.vertices[i] = MV.rotate(this.vertices[i], theta, origin);
        }
    };

    this.updateCenter = function () {
        var centroid = [0, 0],a = 0,size = this.vertices.length,pos,vb,mult,va,m;
        for (var i = 0; i < size; i++) {
            pos = i + 1 == size ? 0 : i + 1;
            va = this.vertices[i];
            vb = this.vertices[pos];
            mult = va[0] * vb[1] - vb[0] * va[1];
            centroid[0] += (va[0] + vb[0]) * mult;
            centroid[1] += (va[1] + vb[1]) * mult;
            a += mult;
        }
        a *= 0.5;
        this.area = a;
        m = 1 / (6 * a);
        centroid[0] *= m;
        centroid[1] *= m;
        this.center = centroid;
    };

    this.moi2 = function (mass) {
        var sum1 = 0,sum2= 0,pos,pn,pn1,norm,size=this.vertices.length,n;

        for (n = 0; n < size; n++) {
            pos = n + 1 == size ? 0 : n + 1;
            pn = this.vertices[n];
            pn1 = this.vertices[pos];
            norm = MV.norm(MV.VxV(pn, pn1));
            sum1 += norm * MV.dot(pn1, pn1) + MV.dot(pn1, pn) + MV.dot(pn, pn);
            sum2 += norm;
        }
        return (mass / 6) * (sum1 / sum2);
    };

    this.moi = function (mass) {
        var cv = this.center,moi = 0, i,size = this.vertices.length,
        pos,va,vb,b,ca,cb,h, a,moit,centroid,masst;

        for (i = 0; i < size; i++) {
            pos = i + 1 == size ? 0 : i + 1;
            va = this.vertices[i];
            vb = this.vertices[pos];
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
            masst = (b * h * mass) / this.area;
            moi += moit + masst * Math.pow(MV.distance(centroid, cv), 2);
        }
        return moi;
    };

    this.updateRelative = function () {
        this.vertices = this.vertices.reverse();
        var cx = this.center[0],cy = this.center[1], i,size = this.vertices.length,vertex;
        for (i = 0; i < size; i++) {
            vertex = this.vertices[i];
            vertex[0] = (cx - vertex[0]) * -1;
            vertex[1] = (cy - vertex[1]) * -1;
        }
        this.updateMinAndMax();
    };

    this.updateMinAndMax = function () {
        var min = [this.vertices[0][0], this.vertices[0][1]];
        var max = [this.vertices[0][0], this.vertices[0][1]];
        var size = this.vertices.length, i,j;

        for (i = 1; i < size; i++) {
            for (j = 0; j <= 1; j++) {
                if (this.vertices[i][j] < min[j]) {
                    min[j] = this.vertices[i][j];
                }
                else if (this.vertices[i][0] > max[j]) {
                    max[j] = this.vertices[i][j];
                }
            }
        }
        this.min = min;
        this.max = max;
    };

    this.isClockWise = function () {
        var sum = 0, i,size = this.vertices.length, j,va,vb;
        for (i = 0; i < size; i++) {
            j = i + 1 == size ? 0 : i + 1;
            va = this.vertices[i];
            vb = this.vertices[j];
            sum += ((vb[0] - va[0]) * (vb[1] + va[1]))
        }
        return sum < 0;
    };

    this.sumAngles = function () {
        var sum = 0, i,size = this.vertices.length, j, k,vb,va,vc,v1,v2;
        for (i = 0; i < size; i++) {
            j = i + 1 == size ? 0 : i + 1;
            k = j + 1 == size ? 0 : j + 1;
            va = this.vertices[i];
            vb = this.vertices[j];
            vc = this.vertices[k];
            v1 = MV.VmV(vb, va);
            v2 = MV.VmV(vc, vb);
            sum += MV.getDegree(v1, v2);
        }
        return sum;
    };

    this.isConvex = function () {
        return this.sumAngles() > 360;
    };
}