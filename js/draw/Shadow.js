function Shadow(x, y, blur, color) {
    var self = this;
    self.x = isNaN(x) ? 2 : x;
    self.y = isNaN(y) ? 2 : y;
    self.blur = isNaN(blur) ? 3 : blur;
    self.color = color;
}
