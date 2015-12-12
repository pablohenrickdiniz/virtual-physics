/**
 * Created by Pablo Henrick Diniz on 15/10/14.
 */
define(['Joint'],function(Joint){
    var Distance = function (bodyA, vertexA, bodyB, vertexB) {
        var self = this;
        Joint.apply(self, [bodyA, vertexA, bodyB, vertexB]);
    };
    Distance.prototype = new Joint;
    return Distance;
});

