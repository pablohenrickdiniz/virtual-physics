(function(w){
    var RadialGradient = function(cx, cy, r, fx, fy) {
        var self = this;
        self.r = isNaN(r) || r < 0 || r > 100 ? 50 : r;
        self.cx = isNaN(cx) || cx < 0 || cx > 100 ? 50 : cx;
        self.cy = isNaN(cy) || cy < 0 || cy > 100 ? 50 : cy;
        self.fx = isNaN(fx) || fx < 0 || fx > 100 ? 50 : fx;
        self.fy = isNaN(fy) || fy < 0 || fy > 100 ? 50 : fy;
        self.colorsStop = [];
    };

    RadialGradient.prototype.addColorStop =  function (stop, color) {
        var self = this;
        if (isNaN(stop) || stop < 0 || stop > 100) {
            throw new TypeError('O indice de parada deve ser um numero entre 0 e 100');
        }
        if (!(color instanceof Color)) {
            color = Color.parse(color);
        }
        self.colorsStop[self.colorsStop.length] = [stop, color];
    };

    w.RadialGradient = RadialGradient;
})(window);
