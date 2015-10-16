define(['Polygon'],function(Polygon){
    var Trapezius = function(center, ba, bb, height) {
        var self = this;
        Polygon.apply(self, [center, 0]);
        Trapezius.validateBase(ba);
        Trapezius.validateBase(bb);
        Trapezius.validateHeight(height);
        self.ba = ba;
        self.bb = bb;
        self.height = height;
        var bbm = self.bb * 0.5;
        var bam = self.ba * 0.5;
        var hm = self.height * 0.5;
        self.vertices = [
            [bbm, -hm],
            [-bbm, -hm],
            [-bam, hm],
            [bam, hm]
        ];
    };

    Trapezius.prototype = new Polygon([0,0],0);

    Trapezius.validateBase = function(base){
        if(isNaN(base) || base <= 0){
            throw new TypeError('base of trapezius must be a double value larger than 0:base='+base);
        }
    };

    Trapezius.validateHeight = function(height){
        if(isNaN(height) || height <= 0){
            throw new TypeError('height of trapezius must be a double value larger than 0:height='+height);
        }
    };

    return Trapezius;
});

