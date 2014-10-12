Circle.prototype = new Arc();

function Circle(center, radius) {
    Arc.call(this, center, radius, 0, 360);

    this.update = function () {
        this.area = Math.PI * this.radius * this.radius;
    };


    this.setRadius = function (radius) {
        this.radius = radius;
        this.update();
    };

    this.moi = function (mass) {
        return mass * this.radius * radius / 2;
    };
};