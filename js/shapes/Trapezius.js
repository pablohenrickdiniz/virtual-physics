define(['Polygon'],function(Polygon){
    var Trapezius = function(center, ba, bb, height) {
        var self = this;
        Polygon.apply(self, [center, 0]);
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


    return Trapezius;
});

