Regular.prototype = new Polygon([0, 0], null, null, 0);
function Regular(center, radius, sides, theta) {
    var self = this;
    Polygon.call(self, center, theta);
    Regular.validateRadius(radius);
    Regular.validateSides(sides);
    self.radius = radius;
    self.sides = sides;
    self.thickness = 1;
    self.area = 0.5 * self.sides * (2 * self.radius * Math.sin(MV.toRadians(180 / self.sides))) * self.radius;

    self.setRadius = function (radius) {
        Regular.validateRadius(radius);
        var self = this;
        self.radius = radius;
        self.updateVertices();
    };

    self.updateVertices = function () {
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

    self.moi = function (mass) {
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
    };
    self.updateVertices();
}

Regular.validateAngle = function (angle) {
    if (isNaN(angle) || angle < 0 || angle > 360) {
        throw new TypeError('angle must be a positive double value between 0 and 360:angle=' + angle);
    }
};

Regular.validateRadius = function (radius) {
    if (isNaN(radius) || radius <= 0) {
        throw new TypeError('radius must be a double value lager than 0:radius=' + radius);
    }
};

Regular.validateSides = function (sides) {
    if (isNaN(sides) || sides < 3 || !Number.isInt(sides)) {
        throw new TypeError('sides must be a integer value larger or equal than 3:sides=' + sides);
    }
};

Number.isInt = function (value) {
    return !isNaN(value) && parseInt(value) === value;
};
