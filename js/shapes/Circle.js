Circle.prototype = new Arc([0,0],1,0,360);

function Circle(center, radius) {
    var self = this;
    Arc.call(this, center, radius, 0, 360);
    self.update = function () {
        var self = this;
        self.area = Math.PI * self.radius * self.radius;
    };

    self.setRadius = function (radius) {
        Arc.validateRadius(radius);
        self.radius = radius;
        self.update();
    };

    self.moi = function (mass) {
        var self = this;
        return mass * self.radius * radius / 2;
    };
};