Arc.prototype = new Shape();

function Arc(center, radius, start, end) {
    Shape.call(this, center, 'white', new Border('black', 1), 0);
    this.radius = isNaN(radius) ? 10 : radius;
    start = isNaN(start) ? this.theta : start;
    end = isNaN(end) ? this.theta + 180 : end;
    while (start > 360) {
        start = start % 360;
    }

    while (this.end > 360) {
        end = end % 360;
    }

    this.start = start;
    this.end = end;
}
