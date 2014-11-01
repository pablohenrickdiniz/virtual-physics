Regular.prototype = new Polygon();
function Regular(center, radius, sides, thickness, theta) {
    Polygon.call(this, center, theta);
    this.radius = isNaN(radius) || radius < 0 ? 10 : radius;
    this.sides = isNaN(sides) || sides < 3 ? 3 : sides;
    this.thickness = isNaN(thickness) || thickness < 1 ? 1 : thickness;
    this.area = 0.5 * this.sides * (2 * this.radius * Math.sin(MV.toRadians(180 / this.sides))) * this.radius;

    this.setRadius = function (radius) {
        this.radius = radius;
        this.updateVertices();
    };

    this.updateVertices = function () {
        var ga = (360 / this.sides);
        //var gb = (360 / this.sides) / 2;
        var pa = [0, -this.radius];
        //var pb = [0,- this.radius];
        pa = MV.rotate(pa, -this.theta, [0, 0]);
        //pb = MV.rotate(pb, -this.theta - gb, [0,0]);
        this.vertices = [];
        this.vertices[this.vertices.length] = pa;
        //this.vertices.push(pb);

        for (var i = 1; i < this.sides; i++) {
            pa = [pa[0], pa[1]];
            //pb = [pb[0], pb[1]];
            pa = MV.rotate(pa, -ga, [0, 0]);
            //pb = MV.rotate(pb, -ga, [0,0]);
            this.vertices[this.vertices.length] = pa;
            //this.vertices.push(pb);
        }
        this.updateMinAndMax();
    };

    this.updateVertices();

    this.moi = function (mass) {
        if (this.vertices.length == 4) {
            var width = this.max[0] - this.min[0];
            var height = this.max[1] - this.min[1];
            return mass / 12 * (height * height + width * width)
        }
        else {
            var sum1 = 0,sum2 = 0,size = this.vertices.length, n, pn,pn1,norm,pos;
            for (n = 0; n < size; n++) {
                pos = n + 1 == size ? 0 : n + 1;
                pn = this.vertices[n];
                pn1 = this.vertices[pos];
                norm = MV.norm(MV.VxV(pn, pn1));
                sum1 += norm * MV.dot(pn1, pn1) + MV.dot(pn1, pn) + MV.dot(pn, pn);
                sum2 += norm;
            }
            return (mass / 6) * (sum1 / sum2);
        }
    }
}
