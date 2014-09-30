function Border(color, thickness) {
    this.color = color == undefined ? null : color;
    this.thickness = thickness == undefined ? 1 : thickness;
    this.lineDash = [];
    this.lineCap = 'butt';
}

Border.BUTT = 'butt';
Border.ROUND = 'round';
Border.SQUARE = 'square';