/**
 * Created by Pablo Henrick Diniz on 12/10/14.
 */

MouseBody.prototype = new Body(new Rect([0,0],1,1),Material.Iron,true);
function MouseBody(shape) {
    var self = this;
    Body.call(self,new Rect([0,0],1,1),Material.Iron,true);
    Shape.validateShape(shape);
    self.vLin = [0, 0];
    self.vAng = 0;
    self.mInv = 0;
    self.moiInv = 0;
    self.shape = shape;
    self.center = shape.center;

    var rotMatTheta; // used to avoid unnecessary rotation matrix computations
    var rotationMatrix;

    self.getVerticesInWorldCoords = function () {
        var self = this;
        var vertsAbsolute = [];
        var rotationMatrix = self.getRotationMatrix();
        var i;
        var size =  self.shape.vertices.length;
        for (i = 0; i < size;i++) {
            vertsAbsolute.push(MV.VpV(self.center,
                MV.MxV(rotationMatrix, self.shape.vertices[i])));
        }
        return vertsAbsolute;
    };

    self.getRotationMatrix = function () {
        var self = this;
        // only recompute if theta has changed since the last call.
        if (self.shape.theta !== rotMatTheta || rotationMatrix == null) {
            rotationMatrix = [
                [Math.cos(self.shape.theta), -Math.sin(self.shape.theta)],
                [Math.sin(self.shape.theta), Math.cos(self.shape.theta)]
            ];
            rotMatTheta = self.shape.theta;
        }
        return rotationMatrix;
    }
}