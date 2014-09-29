/*
 *The MIT License (MIT)
 *
 *Copyright (c) 2013 Hubert Eichner
 *
 *Permission is hereby granted, free of charge, to any person obtaining a copy
 *of this software and associated documentation files (the "Software"), to deal
 *in the Software without restriction, including without limitation the rights
 *to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *
 *The above copyright notice and this permission notice shall be included in
 *all copies or substantial portions of the Software.
 *
 *THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *THE SOFTWARE.
 */

var Body = function (vertices, center, theta, mInv, moiInv, vLin, vAng) {
    this.vertices = vertices; // array of vertices relative to center
    this.center = center; // center of mass
    this.theta = theta; // rotation angle
    this.mInv = mInv; // inverse of the mass
    this.moiInv = moiInv; // inverse of the moment of inertia
    this.vLin = vLin; // linear (translational) velocity
    this.vAng = vAng; // angular (rotational) velocity
    this.forces = []; // array of forces...
    this.forcePoints = []; // ... and the vertex index of force application.
    // undefined is center of mass.

    var rotMatTheta; // used to avoid unnecessary rotation matrix computations
    var rotationMatrix;

    this.addForce = function (force, forcePoint) {
        this.forces.push(force);
        this.forcePoints.push(forcePoint);
    };
    this.getRotationMatrix = function () {
        // only recompute if theta has changed since the last call.
        if (this.theta !== rotMatTheta) {
            rotationMatrix = [
                [Math.cos(this.theta), -Math.sin(this.theta)],
                [Math.sin(this.theta), Math.cos(this.theta)]
            ];
            rotMatTheta = this.theta;
        }
        return rotationMatrix;
    };
    this.getVerticesInWorldCoords = function () {
        var vertsAbsolute = [];
        var rotationMatrix = this.getRotationMatrix();
        for (var i = 0; i < this.vertices.length; i++) {
            vertsAbsolute.push(MV.VpV(this.center,
                MV.MxV(rotationMatrix, this.vertices[i])));
        }
        return vertsAbsolute;
    };

    this.getRotationMatrix();
};

function getAABB(body) {
    var verticesWorld = body.getVerticesInWorldCoords();
    var AABB = [];
    AABB[0] = MV.min(verticesWorld, 0);
    AABB[1] = MV.min(verticesWorld, 1);
    AABB[2] = MV.max(verticesWorld, 0);
    AABB[3] = MV.max(verticesWorld, 1);
    return AABB;
}

function AABBoverlap(b1, b2, threshold) {
    if (threshold === undefined)
        threshold = 0;
    if (b1[0] + threshold >= b2[2] ||
        b1[2] <= b2[0] + threshold ||
        b1[1] + threshold >= b2[3] ||
        b1[3] <= b2[1] + threshold) {
        return false;
    }
    return true;
}

function getFaceNormals(vertices) {
    var normals = [];
    for (var i = 0; i < vertices.length; i++) {
        var face = MV.VmV(vertices[(i + 1) % vertices.length], vertices[i]);
        var N = [-face[1], face[0]];
        normals.push(MV.normalize(N));
    }
    return normals;
}

function getCollisionCandidates(bodies) {
    var AABBs = [];
    // compute axis aligned bounding boxes for each body
    for (var i = 0; i < bodies.length; i++) {
        AABBs[i] = getAABB(bodies[i]);
    }
    // compare them against each other and store
    // potential collisions in collisionCandidates
    var collisionCandidates = [];
    for (var i = 0; i < AABBs.length - 1; i++) {
        for (var j = i + 1; j < AABBs.length; j++) {
            if (AABBoverlap(AABBs[i], AABBs[j], 0)) {
                collisionCandidates.push([i, j]);
                collisionCandidates.push([j, i]);
            }
        }
    }

    return collisionCandidates;
}

// precompute face normals (once for each body),
// used extensively during collision detection.
function computeFaceNormals(bodies, collisionCandidates) {
    var sortedBodies = collisionCandidates.map(function (cb) {
        return cb[0];
    })
        .sort()
        .filter(function (b, i, arr) {
            return (i === 0 || arr[i] !== arr[i - 1]);
        });
    sortedBodies.forEach(function (bi) {
        bodies[bi].faceNormals = getFaceNormals(bodies[bi].getVerticesInWorldCoords());
    });
}

var Contact = function (bodyA, pA, bodyB, pB, normal) {
    // convention: point pA (world coords) of body bodyA penetrates
    // bodyB at some surface; the projection of pA onto this surface
    // is point pB (world coords), and the outward pointing surface
    // normal is "normal".
    this.bodyA = bodyA;
    this.pA = pA;
    this.bodyB = bodyB;
    this.pB = pB;
    this.normal = normal;
}

function linesIntersect(X, Y, A, B) {
    var denominator = (Y[0] - X[0]) * (B[1] - A[1]) - (Y[1] - X[1]) * (B[0] - A[0]);
    var epsilon = 0.001;
    if (Math.abs(denominator) < epsilon)
        return false;
    var lambdaNominator = (B[0] - A[0]) * (X[1] - A[1]) - (B[1] - A[1]) * (X[0] - A[0]);
    var lambda = lambdaNominator / denominator;
    if (lambda < 0 || lambda > 1)
        return false
    var alphaNominator = (Y[1] - X[1]) * (A[0] - X[0]) - (Y[0] - X[0]) * (A[1] - X[1]);
    var alpha = alphaNominator / denominator;
    if (alpha < 0 || alpha > 1)
        return false;
    return true;
}

function getContactsFromBodyPair(bodyA, bodyB) {
    var contacts = [];
    var pAs = bodyA.getVerticesInWorldCoords();
    var pBs = bodyB.getVerticesInWorldCoords();
    var distances = [];
    var normals = bodyB.faceNormals;
    // test for each point of body A whether it lies inside body B
    for (var i = 0; i < pAs.length; i++) {
        var pA = pAs[i];
        // compute distance of pAcur from each face of B. negative means inward
        for (var k = 0; k < pBs.length; k++) {
            distances[k] = MV.dot(normals[k], MV.VmV(pA, pBs[k]));
        }
        // if any distance is >= 0, then point pAcur of body A is not in body B
        if (distances.some(function (d) {
            return d >= 0;
        })) {
            continue;
        }
        // now determine the right collision face. I define it as the one
        // that intersects with the line pA -> (body A center)
        // if none is found (shouldn't happen), take the closest surface
        var collisionFace = MV.minIndex(distances);
        for (var k = 0; k < pBs.length; k++) {
            if (linesIntersect(pA, bodyA.center, pBs[k], pBs[(k + 1) % pBs.length])) {
                collisionFace = k;
            }
        }
        var pB = MV.VmV(pA, MV.SxV(distances[collisionFace], normals[collisionFace]));
        contacts.push(new Contact(bodyA, pA, bodyB, pB, normals[collisionFace]));
    }
    return contacts;
}

var World = function () {
    this.dt = 1 / 60;
    this.nIterations = 4;
    this.beta = 0.2;
    this.bodies = [];
    this.t = 0;
    this.friction = 0.2;
    this.contacts = [];
    this.step = function () {
        /***** 1. collision detection *****/
        computeContacts.apply(this); // call private function computeContacts but give it the right this

        /***** 2. integrate forces/torques and compute tentative velocities *****/
        for (var i = 0; i < this.bodies.length; i++) {
            var mInv = this.bodies[i].mInv;
            if (mInv == 0)
                continue;
            var moiInv = this.bodies[i].moiInv;
            var rotationMatrix = this.bodies[i].getRotationMatrix();
            // each force independently leads to a change in linear and angular
            // velocity; i.e., add up all these changes by iterating over forces
            for (var j = 0; j < this.bodies[i].forces.length; j++) {
                var force = this.bodies[i].forces[j];
                var forcePoint = this.bodies[i].forcePoints[j];
                // linear motion is simply the integrated force, divided by the mass
                this.bodies[i].vLin = MV.VpV(this.bodies[i].vLin, MV.SxV(this.dt * mInv, force));
                // angular motion depends on the force application point as well via the torque
                if (forcePoint !== undefined) { // 'undefined' means center of mass
                    var torque = MV.cross2(MV.MxV(rotationMatrix, this.bodies[i].vertices[forcePoint]), force);
                    this.bodies[i].vAng += this.dt * moiInv * torque;
                }
            }
        }

        /***** 3. correct velocity errors *****/
        applyImpulses.apply(this);

        /***** 4. update positions *****/
        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i].center = MV.VpV(this.bodies[i].center, MV.SxV(this.dt, this.bodies[i].vLin));
            this.bodies[i].theta += this.dt * this.bodies[i].vAng;
        }
    };

    this.addBody = function (body) {
        this.bodies.push(body);
    };

    this.setFriction = function (friction) {
        this.friction = friction;
    };

    // private function. Make sure to call with apply() and pass in
    // the right world object.
    function computeContacts() {
        // broad phase - compute the axis aligned bounding box for each body and
        // determine overlapping boxes. These list of candidate collisions is then
        // pruned in the narrow phase. Note for an overlap of bodies A and B,
        // [Ai, Bi] and [Bi, Ai] are added to the result.
        var collisionCandidates = getCollisionCandidates(this.bodies);
        computeFaceNormals(this.bodies, collisionCandidates);
        // later, reuse contacts?
        this.contacts = [];
        // narrow phase - for each collision candidate, do some geometry to determine
        // whether two bodies indeed intersect, and if yes, create a Contact object
        // that contains penetrating point, penetrated surface, and surface normal
        for (var i = 0; i < collisionCandidates.length; i++) {
            // NB this function is asymmetrical - i.e., getContactFromBodyPair([A,B])
            // will return a different result than getContactFromBodyPair([B,A]) -
            // a returned contact presents a point of body A penetrating a face of
            // body B in the first example, and vice versa for the second invocation.
            var cs = getContactsFromBodyPair(this.bodies[collisionCandidates[i][0]],
                this.bodies[collisionCandidates[i][1]]);
            this.contacts = this.contacts.concat(cs);
        }

        for (var i = 0; i < this.contacts.length; i++) {
            var c = this.contacts[i];
        }
    };

    function applyImpulses() {
        var bias = [];
        // precompute MInv and bias for each contact - they don't change
        // across iterations
        var MInv = [];
        var bias = [];
        var lambdaAccumulated = [];
        var Jn = [];
        var Jt = [];

        for (var i = 0; i < this.contacts.length; i++) {
            // assemble the inverse mass vector (usually a matrix,
            // but a diagonal one, so I can replace it with a vector
            var contact = this.contacts[i];
            MInv[i] = [contact.bodyA.mInv,
                contact.bodyA.mInv]
                .concat(contact.bodyA.moiInv)
                .concat([contact.bodyB.mInv,
                    contact.bodyB.mInv])
                .concat(contact.bodyB.moiInv);
            // compute the Jacobians (they don't change in the iterations)
            var Jn_vLinA = contact.normal;
            var Jn_vAngA = MV.cross2(MV.VmV(contact.pA, contact.bodyA.center), contact.normal);
            var Jn_vLinB = MV.SxV(-1, contact.normal);
            var Jn_vAngB = -MV.cross2(MV.VmV(contact.pB, contact.bodyB.center), contact.normal);
            Jn[i] = Jn_vLinA.concat(Jn_vAngA).concat(Jn_vLinB).concat(Jn_vAngB);

            // Jacobian for friction - like Jacobian for collision,
            // but with tangent in place of normal
            var tangent = [-contact.normal[1], contact.normal[0]];
            var Jt_vLinA = tangent;
            var Jt_vAngA = MV.cross2(MV.VmV(contact.pA, contact.bodyA.center), tangent);
            var Jt_vLinB = MV.SxV(-1, tangent);
            var Jt_vAngB = -MV.cross2(MV.VmV(contact.pB, contact.bodyB.center), tangent);
            Jt[i] = Jt_vLinA.concat(Jt_vAngA).concat(Jt_vLinB).concat(Jt_vAngB);


            /* for restitution (bouncing off)
             var tmp = MV.VmV(contact.pB, contact.bodyB.center);
             var vB = MV.VpV(contact.bodyB.vLin, MV.SxV(contact.bodyB.vAng, [-tmp[1], tmp[0]]));
             var tmp = MV.VmV(contact.pA, contact.bodyA.center);
             var vA = MV.VpV(contact.bodyA.vLin, MV.SxV(contact.bodyA.vAng, [-tmp[1], tmp[0]]));
             */
            var vPreNormal = 0; //MV.dot(MV.VmV(vA, vB), contact.normal);
            var C = MV.dot(MV.VmV(contact.pA, contact.pB),
                contact.normal);
            bias[i] = this.beta / this.dt * ((C < 0) ? C : 0) + 0.2 * vPreNormal;
            lambdaAccumulated[i] = 0;
        }

        for (var i = 0; i < this.nIterations; i++) {
            for (var j = 0; j < this.contacts.length; j++) {
                var bodyA = this.contacts[j].bodyA;
                var bodyB = this.contacts[j].bodyB;
                var v = bodyA.vLin
                    .concat(bodyA.vAng)
                    .concat(bodyB.vLin)
                    .concat(bodyB.vAng);

                var lambda = -(MV.dot(Jn[j], v) + bias[j]) / MV.dot(Jn[j], MV.VxV(MInv[j], Jn[j]));

                // clamp accumulated impulse to 0
                if (lambdaAccumulated[j] + lambda < 0) {
                    lambda = -lambdaAccumulated[j];
                }

                lambdaAccumulated[j] += lambda;
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambda, Jn[j])));
                bodyA.vLin = v.slice(0, 2);
                bodyA.vAng = v[2];
                bodyB.vLin = v.slice(3, 5);
                bodyB.vAng = v[5];

                // friction stuff
                var lambdaFriction = -(MV.dot(Jt[j], v) + 0 * bias[j]) / MV.dot(Jt[j], MV.VxV(MInv[j], Jt[j]));
                if (lambdaFriction > this.friction * lambda) {
                    lambdaFriction = this.friction * lambda;
                } else if (lambdaFriction < -this.friction * lambda) {
                    lambdaFriction = -this.friction * lambda;
                }
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambdaFriction, Jt[j])));
                bodyA.vLin = v.slice(0, 2);
                bodyA.vAng = v[2];
                bodyB.vLin = v.slice(3, 5);
                bodyB.vAng = v[5];
            }
        }
    };
};
