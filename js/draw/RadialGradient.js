function RadialGradient(cx, cy, r, fx, fy) {
    this.r = isNaN(r) || r < 0 || r > 100 ? 50 : r;
    this.cx = isNaN(cx) || cx < 0 || cx > 100 ? 50 : cx;
    this.cy = isNaN(cy) || cy < 0 || cy > 100 ? 50 : cy;
    this.fx = isNaN(fx) || fx < 0 || fx > 100 ? 50 : fx;
    this.fy = isNaN(fy) || fy < 0 || fy > 100 ? 50 : fy;
    this.colorsStop = [];


    this.addColorStop = function (stop, color) {
        if (isNaN(stop) || stop < 0 || stop > 100) {
            throw new TypeError(
                'O indice de parada deve ser um numero entre 0 e 100');
        }
        if (!(color instanceof Color)) {
            color = Color.parse(color);
        }
        this.colorsStop.push([stop, color]);
    };
}