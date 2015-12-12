define(['Border','Shape'],function(Border,Shape){
    var Arc = function (center, radius, start, end) {
        var self = this;
        Shape.apply(self,[center, 'white', new Border('black', 1), 0]);
        self.start = start;
        self.end = end;
    };

    Arc.prototype = new Shape([0,0],null,null,0);

    return Arc;
});


