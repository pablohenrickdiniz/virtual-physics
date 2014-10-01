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
        //console.log(vertices[i]);
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
            //console.log(pA);
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
            if (linesIntersect(pA, bodyA.shape.center, pBs[k], pBs[(k + 1) % pBs.length])) {
                collisionFace = k;
            }
        }
        //console.log(normals[collisionFace]);
        var pB = MV.VmV(pA, MV.SxV(distances[collisionFace], normals[collisionFace]));
        contacts.push(new Contact(bodyA, pA, bodyB, pB, normals[collisionFace]));
    }
    return contacts;
}

