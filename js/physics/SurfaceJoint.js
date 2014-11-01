/**
 * Created by Pablo Henrick Diniz on 14/10/14.
 */
function SurfaceJoint(bodyA, vertexA, bodyB, vertexB) {
    this.bodyA = bodyA==undefined?null:bodyA;
    this.vertexA = vertexA==undefined?null:vertexA;
    this.bodyB = bodyB==undefined?null:bodyB;
    this.vertexB = vertexB==undefined?null:vertexB;
}