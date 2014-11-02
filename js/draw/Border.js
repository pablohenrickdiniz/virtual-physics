function Border(color, thickness) {
    var self = this;
    self.color = color == undefined ? null : color;
    self.thickness = thickness == undefined ? 1 : thickness;
    self.lineDash = [];
    self.lineCap = 'butt';
}

Border.BUTT = 'butt';
Border.ROUND = 'round';
Border.SQUARE = 'square';