function Shape(center, color, border, theta) {
    Shape.validateCenter(center);
    Shape.validateTheta(theta);
    var self = this;
    self.center = center;
    self.color = color == undefined ? null : color;
    self.border = border == undefined ? null : border;
    self.shadow = null;
    self.theta = theta;
    self.vertices = [];

    self.setColor = function(color){
        Color.validate(color);
        self.color = color;
    };

    self.setVertices = function(vertices){
        Shape.validateVertices(vertices);
        var self = this;
        self.vertices = vertices;
    };

    self.setCenter = function(center){
        Point.validatePoint(center);
        var self = this;
        self.center = center;
    };

    self.add = function(vertice){
        Point.validatePoint(vertice);
        var self = this;
        self.vertices.push(vertice);
    };
}

Shape.validateVertices = function(vertices){
    var valid = true;
    if(vertices instanceof Array){
        var size = vertices.length;
        var i;
        for(i=0;i< size;i++){
            Point.validatePoint(vertices[i]);
        }
    }
    else{
        valid = false;
    }
    if(!valid){
        throw new TypeError('vertices must be a array of vertices:vertices='+vertices);
    }
};

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