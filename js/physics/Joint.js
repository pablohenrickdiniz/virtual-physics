/**
 * Created by Pablo Henrick Diniz on 12/10/14.
 */

define(function(){
    var Joint = function(bodyA, vertexA, bodyB, vertexB) {
        var self = this;
        self.bodyA = bodyA;
        self.vertexA = vertexA;
        self.bodyB = bodyB;
        self.vertexB = vertexB;
        self.type = 'vertex';
    };

    return Joint;
});
