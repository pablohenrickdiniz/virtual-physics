(function(w){
    var Border = function() {
        var self = this;
        self.color = '#000000';
        self.thickness = 1;
        self.lineDash = [];
        self.lineCap = 'butt';
    };

    Border.constructor = Border;

    Border.prototype.setLineDash = function(lineDash){
        var self = this;
        self.lineDash = lineDash;
    };

    Border.BUTT = 'butt';
    Border.ROUND = 'round';
    Border.SQUARE = 'square';


    w.Border = Border;
})(window);
