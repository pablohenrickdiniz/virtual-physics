Circle.prototype = new Arc([0,0],1,0,360);

function Circle(center, radius) {
    var self = this;
    Arc.call(self, center, radius, 0, 360);
}

Circle.prototype.update = function () {
    var self = this;
    self.area = Math.PI * self.radius * self.radius;
};

Circle.prototype.setRadius = function (radius) {
    Arc.validateRadius(radius);
    var self = this;
    self.radius = radius;
    self.update();
};

Circle.prototype.moi = function (mass) {
    var self = this;
    return mass * self.radius * radius / 2;
};