function Shape(center, color, border, theta) {
    Shape.validateCenter(center);
    Shape.validateTheta(theta);
    this.center = center;
    this.color = color == undefined ? null : color;
    this.border = border == undefined ? null : border;
    this.shadow = null;
    this.theta = isNaN(theta) ? 0 : theta;
    this.vertices = [];
}

Shape.validateCenter = function(center){
    if(!(center instanceof Array)||isNaN(center[0])|| isNaN(center[1])){
        throw new TypeError('center must be a array of double values:center='+center);
    }
};

Shape.validateTheta = function(theta){
    if(isNaN(theta)){
        throw new TypeError('theta must be a double number:theta='+theta);
    }
};

Shape.validateShape = function(shape){
    if(!(shape instanceof Shape)){
        throw new TypeError('shape must be a instace of Shape');
    }
};