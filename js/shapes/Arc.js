define(['Border','Shape'],function(Border,Shape){
    var Arc = function (center, radius, start, end) {
        var self = this;
        Shape.apply(self,[center, 'white', new Border('black', 1), 0]);
        Arc.validateRadius(radius);
        Arc.validateAngle(start);
        Arc.validateAngle(end);
        self.start = start;
        self.end = end;
    };

    Arc.prototype = new Shape([0,0],null,null,0);

    Arc.validateRadius = function(radius){
        if(isNaN(radius)){
            throw new TypeError('radius must be a double value:radius='+radius);
        }
    };

    Arc.validateAngle = function(angle){
        if(isNaN(angle) || angle < 0 || angle > 360){
            throw new TypeError('aangle must be a positive double value between 0 and 360:angle='+angle);
        }
    };

    return Arc;
});


