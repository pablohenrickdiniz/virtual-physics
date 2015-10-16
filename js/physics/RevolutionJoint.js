/**
 * Created by Pablo Henrick Diniz on 12/10/14.
 */

define(function(){
    var RevolutionJoint = new function (bodyA, vertexA, bodyB, vertexB) {
        var self = this;
        self.bodyA = bodyA;
        self.bodyB = bodyB;
        self.vertexA = vertexA;
        self.vertexB = vertexB;
    };
    return RevolutionJoint;
});

