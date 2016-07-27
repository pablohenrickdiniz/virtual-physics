/**
 * Created by Pablo Henrick Diniz on 12/10/14.
 */
(function(w){
    var MouseBody = function(shape) {
        var self = this;
        self.vLin = [0, 0];
        self.vAng = 0;
        self.mInv = 0;
        self.moiInv = 0;
        self.shape = shape;
        self.center = shape.center;

        self.rotMatTheta = null; // used to avoid unnecessary rotation matrix computations
        self.rotationMatrix = null;
    };

    MouseBody.prototype = Object.create(Body.prototype);
    MouseBody.constructorr = MouseBody;

    MouseBody.prototype.getVerticesInWorldCoords = function () {
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

    MouseBody.prototype.getRotationMatrix = function () {
        var self = this;
        // only recompute if theta has changed since the last call.
        if (self.shape.theta !== self.rotMatTheta || self.rotationMatrix == null) {
            self.rotationMatrix = [
                [Math.cos(self.shape.theta), -Math.sin(self.shape.theta)],
                [Math.sin(self.shape.theta), Math.cos(self.shape.theta)]
            ];
            self.rotMatTheta = self.shape.theta;
        }
        return self.rotationMatrix;
    };
})(window);



