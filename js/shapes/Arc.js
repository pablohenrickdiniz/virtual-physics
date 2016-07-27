(function(w){
    if(w.Shape == undefined){
        throw "Arc requires Shape"
    }


    var Arc = function (center, radius, start, end) {
        var self = this;
        Shape.call(self,center, 'white', new Border('black', 1), 0);
        self.start = start;
        self.end = end;
    };

    Arc.prototype = Object.create(Shape.prototype);
    Arc.constructor = Arc;

    w.Arc = Arc;
})(window);
