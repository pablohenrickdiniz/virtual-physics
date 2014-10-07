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
        for (var i = 0; i < this.vertices.length - 1; i++) {
            var pos = i+1==this.vertices.length?0:i+1;
            var va = this.vertices[i];
            var vb = this.vertices[pos];
            var mult = va[0] * vb[1] - vb[0] * va[1];
            centroid[0] += (va[0] + vb[0]) * mult;
            centroid[1] += (va[1] + vb[1]) * mult;
            a += mult;
        }
        a *= 0.5;
        var m = 1 / (6 * a);
        centroid[0] *= m;
        centroid[1] *= m;
        this.center = centroid;
    };

    this.moi = function (mass) {
        switch (this.vertices.length) {
            case 3:
                var b = this.max[0] - this.min[0];
                return (Math.pow(b, 2) * mass) / 6;
            case 4:
                var width = this.max[0] - this.min[0];
                var height = this.max[1] - this.min[1];
                return mass / 12 * (width * width + height * height);
            default:
                var sum1 = 0;
                var sum2 = 0;
                for (var n = 0; n < this.vertices.length - 1; n++) {
                    var pn = this.vertices[n];
                    var pn1 = this.vertices[n + 1];
                    var norm = MV.norm(MV.VxV(pn, pn1));
                    sum1 += norm * MV.dot(pn1, pn1) + MV.dot(pn1, pn) + MV.dot(pn, pn);
                    sum2 += norm;
                }
                return (mass / 6) * (sum1 / sum2);
        }
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
