Rect.prototype = new Polygon();
function Rect(center, width, height) {
    Polygon.call(this, center,0);
    this.width = isNaN(width) || width <= 0 ? 100 : width;
    this.height = isNaN(height) || height <= 0 ? 100 : height;
    this.area = this.width*this.height;
    var mw = this.width * 0.5;
    var mh = this.height * 0.5;
    this.vertices = [[mw, -mh],[-mw, -mh],[-mw, mh],[mw, mh]];

    this.moi = function(mass){
        return mass/12 * (this.height*this.height + this.width*this.width);
    };
    this.updateMinAndMax();
}

