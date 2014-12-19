Rect.prototype = new Polygon([0,0],0);
Rect.validateWidth = function(width){
    if(isNaN(width) || width < 1){
        throw new TypeError('width must be a double larger than 1:width='+width);
    }
};
Rect.validateHeight = function(height){
    if(isNaN(height) || height < 1){
        throw new TypeError('height must be a double larger than 1:height='+height);
    }
};


function Rect(center, width, height) {
    var self = this;
    Polygon.call(self, center, 0);

    Rect.validateWidth(width);
    Rect.validateHeight(height);
    self.width =  width;
    self.height = height;
    self.parent = null;

    self.setWidth = function (width) {
        var self = this;
        Rect.validateWidth(width);
        self.updateDimen(width, self.height);
    };

    self.setHeight = function (height) {
        var self = this;
        Rect.validateHeight(height);
        self.updateDimen(self.width, height);
    };

    self.updateDimen = function (width, height) {
        var self = this;
        Rect.validateWidth(width);
        Rect.validateHeight(height);
        self.width = width;
        self.height = height;
        self.area = self.width * self.height;
        var mw = self.width * 0.5;
        var mh = self.height * 0.5;
        self.vertices = [
            [mw, -mh],
            [-mw, -mh],
            [-mw, mh],
            [mw, mh]
        ];
        self.updateMinAndMax();
        if (self.parent != null) {
            self.parent.update();
        }
    };

    self.moi = function (mass) {
        var self = this;
        return mass / 12 * (self.height * self.height + self.width * self.width);
    };

    self.updateDimen(self.width, self.height);
}


