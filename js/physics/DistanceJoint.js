/**
 * Created by Pablo Henrick Diniz on 15/10/14.
 */
Distance.prototype = new Joint();
function Distance(bodyA, vertexA, bodyB, vertexB) {
    var self = this;
    Joint.call(self, bodyA, vertexA, bodyB, vertexB);
}