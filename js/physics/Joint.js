/**
 * Created by Pablo Henrick Diniz on 12/10/14.
 */
function Joint(bodyA, vertexA, bodyB, vertexB) {
    var self = this;
    Joint.validateBody(bodyA);
    Point.validatePoint(vertexA);
    Joint.validateBody(bodyB);
    Point.validatePoint(vertexB);
    self.bodyA = bodyA;
    self.vertexA = vertexA;
    self.bodyB = bodyB;
    self.vertexB = vertexB;
    self.type = 'vertex';
}

Joint.validateBody = function(body){
    if(!(body instanceof Body)){
        throw new TypeError('body must be a instance of Body');
    }
};