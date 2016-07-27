/**
 * Created by Pablo Henrick Diniz on 01/10/14.
 */

(function(w){
    var Triangle = function(va, vb, vc, theta) {
        var centroid = [(va[0] + vb[0] + vc[0]) / 3, (va[1] + vb[1] + vc[1]) / 3];
        Polygon.apply(this, [centroid, theta]);
        this.vertices = [va, vb, vc];
    };

    Triangle.prototype = Object.create(Polygon);
    Triangle.constructor = Triangle;

    w.Triangle = Triangle;
})(window);

