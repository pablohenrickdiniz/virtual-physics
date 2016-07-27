(function(w){
    var Rect = function(width,height) {
        var self = this;
        Polygon.apply(self);
        self.width =  width;
        self.height = height;
        self.updateDimen(self.width,self.height);
    };

    Rect.prototype = Object.create(Polygon.prototype);
    Rect.constructor = Rect;

    Rect.prototype.setWidth = function(width){
        var self = this;
        if(self.width != width){
            self.width = width;
            self.updateDimen(width, self.height);
        }
    };

    Rect.prototype.setHeight = function(height){
        var self = this;
        if(self.height != height){
            self.height = height;
            self.updateDimen(self.width, height);
        }
    };

    Rect.prototype.moi = function(mass){
        var self = this;
        return mass / 12 * (self.height * self.height + self.width * self.width);
    };

    Rect.prototype.getArea = function(){
        var self = this;
        if(self.area == null){
            self.area = self.width * self.height;
        }
        return self.area;
    };

    Rect.prototype.updateDimen = function(width,height){
        var self = this;
        self.width = width;
        self.height = height;
        var mw = self.width * 0.5;
        var mh = self.height * 0.5;
        self.getArea();
        self.vertices = [];
        self.add([mw, -mh]).add([-mw, -mh]).add([-mw, mh]).add([mw, mh]);
        self.updateMinAndMax();
        if (self.parent != null) {
            self.parent.update();
        }
    };

    w.Rect = Rect;
})(window);
