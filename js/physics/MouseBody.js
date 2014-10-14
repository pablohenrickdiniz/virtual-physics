/**
 * Created by Pablo Henrick Diniz on 12/10/14.
 */
function MouseBody(shape) {
    this.vLin = [0, 0];
    this.vAng = 0;
    this.mInv = 0
    this.moiInv = 0;
    this.shape = shape;
    this.center = shape.center;

    var rotMatTheta; // used to avoid unnecessary rotation matrix computations
    var rotationMatrix;

    this.getVerticesInWorldCoords = function () {
        var vertsAbsolute = [];
        var rotationMatrix = this.getRotationMatrix();
        for (var i = 0; i < this.shape.vertices.length; i++) {
            vertsAbsolute.push(MV.VpV(this.shape.center,
                MV.MxV(rotationMatrix, this.shape.vertices[i])));
        }
        return vertsAbsolute;
    };

    this.getRotationMatrix = function () {
        // only recompute if theta has changed since the last call.
        if (this.shape.theta !== rotMatTheta || rotationMatrix == null) {
            rotationMatrix = [
                [Math.cos(this.shape.theta), -Math.sin(this.shape.theta)],
                [Math.sin(this.shape.theta), Math.cos(this.shape.theta)]
            ];
            rotMatTheta = this.shape.theta;
        }
        return rotationMatrix;
    }
}