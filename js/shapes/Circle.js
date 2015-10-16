define(['Arc'],function(Arc){
    var Circle = function(center, radius) {
        var self = this;
        Arc.apply(self, [center, radius, 0, 360]);
    };

    Circle.prototype = new Arc([0,0],1,0,360);

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

    return Circle;
});

