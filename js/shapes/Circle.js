(function(w){
    if(w.Arc == undefined){
        throw "Circle requires Arc"
    }


    var Circle = function(center, radius) {
        var self = this;
        Arc.call(self, center, radius, 0, 360);
    };

    Circle.prototype = Object.create(Arc.prototype);
    Circle.constructor = Circle;

    Circle.prototype.getArea = function(){
        var self = this;
        if(self.area == null){
            self.area = Math.PI * self.radius * self.radius;
        }
        return self.area;
    };

    Circle.prototype.setRadius = function (radius) {
        var self = this;
        self.radius = radius;
        self.area = null;
    };

    Circle.prototype.moi = function (mass) {
        var self = this;
        return mass * self.radius * self.radius / 2;
    };

    w.Circle = Circle;
})(window);


