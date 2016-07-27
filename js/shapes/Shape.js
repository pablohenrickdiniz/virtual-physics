(function(w){
    w.Shape = function() {
        var self = this;
        self.center = [0,0];
        self.color = new Color({alpha:0});
        self.border = new Border();
        self.shadow = null;
        self.theta = 0;
        self.vertices = [];
        self.area = null;
    };
})(window);

