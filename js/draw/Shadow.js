function Shadow(x, y, blur, color) {
    this.x = isNaN(x) ? 2 : x;
    this.y = isNaN(y) ? 2 : y;
    this.blur = isNaN(blur) ? 3 : blur;
    this.color = color;
}
