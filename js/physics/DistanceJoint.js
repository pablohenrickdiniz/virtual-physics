(function(w){
    if(w.Joint == undefined){
        "DistanceJoint requires Joint"
    }

    var DistanceJoint = function (bodyA, vertexA, bodyB, vertexB) {
        var self = this;
        Joint.apply(self, [bodyA, vertexA, bodyB, vertexB]);
    };

    DistanceJoint.prototype = Object.create(Joint.prototype);
    DistanceJoint.constructor = DistanceJoint;
})(window);
