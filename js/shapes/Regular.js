Regular.prototype = new Polygon();
function Regular(center, radius, tips, thickness, theta) {
    Polygon.call(this, center, theta);
    this.radius = isNaN(radius) || radius < 0 ? 10 : radius;
    this.tips = isNaN(tips) || tips < 3 ? 3 : tips;
    this.thickness = isNaN(thickness) || thickness < 1 ? 1 : thickness;

    this.updateVertices = function () {
        var ga = (360 / this.tips);
        var gb = (360 / this.tips) / 2;
        var pa = [0,- this.radius * this.thickness];
        var pb = [0,- this.radius];
        pa = MV.rotate(pa, -this.theta, [0,0]);
        pb = MV.rotate(pb, -this.theta - gb, [0,0]);

        this.vertices.push(pa);
        this.vertices.push(pb);

        for (var i = 1; i < this.tips; i++) {
            pa = [pa[0], pa[1]];
            pb = [pb[0], pb[1]];
            pa = MV.rotate(pa, -ga, [0,0]);
            pb = MV.rotate(pb, -ga, [0,0]);
            this.vertices.push(pa);
            this.vertices.push(pb);
        }
    };

    this.updateVertices();
}
