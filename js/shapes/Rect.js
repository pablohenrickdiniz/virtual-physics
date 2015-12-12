define(['Polygon'],function(Polygon){
    var Rect = function(properties) {
        var self = this;
        Polygon.apply(self);
        self.width =  10;
        self.height = 10;
        self.parent = null;
        self.bindProperties();
        self.set(properties);
        self.updateDimen(self.width,self.height);
    };

    Rect.prototype = new Polygon;

    Rect.prototype.bindProperties = function(){
        var self = this;
        self.onChange('width',function(width){
            self.updateDimen(width, self.height);
        });
        self.onChange('height',function(height){
            self.updateDimen(self.width, height);
        });

        self.beforeSet('width',function(oldVal,newVal){
            newVal = parseFloat(newVal);
            if(isNaN(newVal) || newVal < 10){
                return oldVal;
            }
            return newVal;
        });

        self.beforeSet('height',function(oldVal,newVal){
            newVal = parseFloat(newVal);
            if(isNaN(newVal) || newVal < 10){
                return oldVal;
            }
            return newVal;
        });
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

    return Rect;
});

