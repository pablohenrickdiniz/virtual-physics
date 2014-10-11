function Shape(center, color, border, theta) {
    this.center = center;
    this.color = color == undefined ? null : color;
    this.border = border == undefined ? null : border;
    this.shadow = null;
    this.theta = isNaN(theta)?0:theta;
}
