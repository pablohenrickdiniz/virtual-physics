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

function getAABB2(verticesWorld){
    var AABB = [];
    AABB[0] = MV.min(verticesWorld, 0);
    AABB[1] = MV.min(verticesWorld, 1);
    AABB[2] = MV.max(verticesWorld, 0);
    AABB[3] = MV.max(verticesWorld, 1);
    return AABB;
}


function AABBoverlap(b1, b2, threshold) {
    if (threshold === undefined) {
        threshold = 0;
    }

    return !((b1[0] + threshold) >= b2[2] || b1[2] <= (b2[0] + threshold) || (b1[1] + threshold) >= b2[3] || b1[3] <= (b2[1] + threshold));
}

function AABBInside(b1,b2){
    return ((b1[0] >= b2[0] && b1[2] <= b2[2] && b1[1] >= b2[1] && b1[3] <= b2[3])||(b2[0] >= b1[0] && b2[2] <= b1[2] && b2[1] >= b1[1] && b2[3] <= b1[3]));
}

/*
function circleIntersectLine(cc, r, va, vb) {
    var med = MV.med(va, vb);
    var degree = MV.getDegree(va, vb)
    va = MV.rotate(va, -degree, med);
    vb = MV.rotate(vb, -degree, med);
    cc = MV.rotate(cc, -degree, med);
    var cpMiny = Math.min(va[1], vb[1]);
    var cpMaxy = Math.max(va[1], vb[1]);
    var cpMinx = Math.min(va[0], vb[0]);
    var cpMaxx = Math.max(va[0], vb[0]);
    var minX = cpMinx - r;
    var minY = cpMiny - r;
    var maxX = cpMaxx + r;
    var maxY = cpMaxy + r;
    return (((cc[0] <= va[0] && cc[0] >= minX) || (cc[0] >= va[0] && cc[0] <= maxX)) && (cc[1] <= maxY && cc[1] >= minY));
}*/

function getFaceNormals(vertices) {
    var normals = [], size = vertices.length, i, face, N;
    for (i = 0; i < size; i++) {
        face = MV.VmV(vertices[(i + 1) % size], vertices[i]);
        N = [-face[1], face[0]];
        normals.push(MV.normalize(N));
    }
    return normals;
}

function getCollisionCandidates(world) {
    var AABBsGroups = world.quadTree.getAABBsGroups(), collisionCandidates = [],
        bodies, AABBs, size1 = AABBsGroups.length, size2, i, j, AABBsGroup, groupA, groupB, g,compared=[],indexA,indexB, a,b;
    for (g = 0; g < size1; g++) {
        AABBsGroup = AABBsGroups[g];
        bodies = AABBsGroup[0];
        AABBs = AABBsGroup[1];
        size2 = bodies.length;
        for (i = 0; i < size2 - 1; i++) {
            for (j = i + 1; j < size2; j++) {
                indexA = bodies[i].index;
                indexB = bodies[j].index;
                a= indexA+''+indexB;
                b= indexB+''+indexA;
                if(compared[a]==undefined || compared[b] == undefined){
                    groupA = bodies[i].groups;
                    groupB = bodies[j].groups;
                    if (compare(groupA, groupB) && AABBoverlap(AABBs[i], AABBs[j], 0)) {
                        collisionCandidates.push([indexA, indexB]);
                        collisionCandidates.push([indexB, indexA]);
                        compared[a] = true;
                        compared[b] = true;
                    }
                }
            }
        }
    }
    return collisionCandidates;
}

function compare(groupA, groupB) {
    var i, j;
    for (i = 0; i < groupA.length; i++) {
        for (j = 0; j < groupB.length; j++) {
            if (groupA[i] == groupB[j]) {
                return true;
            }
        }
    }
    return false;
}

// precompute face normals (once for each body),
// used extensively during collision detection.
function computeFaceNormals(bodies, collisionCandidates) {
    var sortedBodies = collisionCandidates.map(function (cb) {
        return cb[0];
    }).sort().filter(function (b, i, arr) {
            return (i === 0 || arr[i] !== arr[i - 1]);
        });
    var size = sortedBodies.length;
    for (var i = 0; i < size; i++) {
        if(sortedBodies[i]== undefined){
            throw new TypeError('body cannot be undefined');
        }
        bodies[sortedBodies[i]].faceNormals = getFaceNormals(bodies[sortedBodies[i]].getVerticesInWorldCoords());
    }
}

var Contact = function (bodyA, pA, bodyB, pB, normal) {
    // convention: point pA (world coords) of body bodyA penetrates
    // bodyB at some surface; the projection of pA onto this surface
    // is point pB (world coords), and the outward pointing surface
    // normal is "normal".
    var self = this;
    self.bodyA = bodyA;
    self.pA = pA;
    self.bodyB = bodyB;
    self.pB = pB;
    self.normal = normal;
};

function linesIntersect(X, Y, A, B) {
    var denominator = (Y[0] - X[0]) * (B[1] - A[1]) - (Y[1] - X[1]) * (B[0] - A[0]),epsilon = 0.000000001;
    if (Math.abs(denominator) < epsilon)
        return false;
    var lambdaNominator = (B[0] - A[0]) * (X[1] - A[1]) - (B[1] - A[1]) * (X[0] - A[0]),lambda = lambdaNominator / denominator;
    if (lambda < 0 || lambda > 1)
        return false;
    var alphaNominator = (Y[1] - X[1]) * (A[0] - X[0]) - (Y[0] - X[0]) * (A[1] - X[1]),alpha = alphaNominator / denominator;
    return !(alpha < 0 || alpha > 1);
}

function line_intersects(pa, pb, pc, pd) {
    var p0_x = pa[0];
    var p0_y = pa[1];
    var p1_x = pb[0];
    var p1_y = pb[1];
    var p2_x = pc[0];
    var p2_y = pc[1];
    var p3_x = pd[0];
    var p3_y = pd[1];

    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return 1;
    }

    return 0; // No collision
}

/*
function polygonsIntersect(polygonA, polygonB){
    var pAs = polygonA.getVerticesInWorldCoords();
    var pBs = polygonB.getVerticesInWorldCoords();
    var sizeA = pAs.length;
    var sizeB = pBs.length;
    var i;
    var j;
    var pa;
    var pb;
    var pc;
    var pd;

    for(i=0;i<sizeA;i++){
        pa = pAs[i];
        pb = pAs[i+1==sizeA?0:i+1];
        for(j=0;j<sizeB;j++){
            pc = pBs[j];
            pd = pBs[j+1==sizeA?0:j+1];
            if (linesIntersect(pAs[i], polygonA.center, pBs[j], pBs[(j + 1) % pBs.length])) {
                return true;
            }
        }
    }
    return false;
};*/

function getContactsFromBodyPair(bodyA, bodyB) {
    var contacts = [];
    var pAs = bodyA.getVerticesInWorldCoords();
    var pBs = bodyB.getVerticesInWorldCoords();
    var distances = [];
    var normals = bodyB.faceNormals;
    var sizeA = pAs.length;
    var sizeB = pBs.length;
    var i;
    var j;
    var pA;
    var pB;
    var collisionFace;
    // test for each point of body A whether it lies inside body B

    for (i = 0; i < sizeA; i++) {
        pA = pAs[i];
        for (j = 0; j < sizeB; j++) {
            distances[j] = MV.dot(normals[j], MV.VmV(pA, pBs[j]));
        }

        if (distances.some(function (d) {
            return d >= 0;
        })) {
            continue;
        }

        collisionFace = MV.minIndex(distances);
        for (j = 0; j < sizeB; j++) {
            pB = pBs[j];
            if (linesIntersect(pA, bodyA.center, pB, pBs[(j + 1) % pBs.length])) {
                collisionFace = j;
            }
        }

        pB = MV.VmV(pA, MV.SxV(distances[collisionFace], normals[collisionFace]));
        contacts.push(new Contact(bodyA, pA, bodyB, pB, normals[collisionFace]));
    }
    return contacts;
}


