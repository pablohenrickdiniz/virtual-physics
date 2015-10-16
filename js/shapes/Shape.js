define(['Color','Point','Border','AppObject'],function(Color,Point,Border,AppObject){
    var  Shape = function(properties) {
        var self = this;
        self.center = [0,0];
        self.color = new Color({alpha:0});
        self.border = new Border();
        self.shadow = null;
        self.theta = 0;
        self.vertices = [];
        self.set(properties);
    };

    Shape.prototype = new AppObject;


    return Shape;
});


