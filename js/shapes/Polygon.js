Polygon.prototype = new Shape();

function Polygon(center, theta) {
	Shape.call(this, center, 'white', new Border('black', 1), theta);
	this.vertices = [];

    this.rotate = function(theta, origin){
        if(origin == undefined){
            origin = this.center;
        }
        else{
            this.center = MV.rotate(this.center,theta,origin);
        }
        for(var i = 0; i < this.vertices.length;i++){
            this.vertices[i] = MV.rotate(this.vertices[i],theta, origin);
        }
    };
}
