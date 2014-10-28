
function QuadTree(AABB, l) {
    this.AABB = AABB;
    this.l = l;
    this.bodies = [];
    this.AABBs = [];
    this.nodeA = null;
    this.nodeB = null;
    this.nodeC = null;
    this.nodeD = null;
    this.qtd = 0;

    this.clear = function () {
        this.nodeA = null;
        this.nodeB = null;
        this.nodeC = null;
        this.nodeD = null;
        this.bodies = [];
        this.AABBs = [];
    };

    this.getAABBsGroups = function (AABBsGroups) {
        AABBsGroups = AABBsGroups == undefined ? [] : AABBsGroups;
        if (this.bodies.length > 0 && this.qtd > 1) {
            AABBsGroups.push([this.bodies, this.AABBs]);
        }
        else {
            if (this.nodeA != null) {
                this.nodeA.getAABBsGroups(AABBsGroups);
            }
            if (this.nodeB != null) {
                this.nodeB.getAABBsGroups(AABBsGroups);
            }
            if (this.nodeC != null) {
                this.nodeC.getAABBsGroups(AABBsGroups);
            }
            if (this.nodeD != null) {
                this.nodeD.getAABBsGroups(AABBsGroups);
            }
        }

        return AABBsGroups;
    };


    this.addBody = function (body, AABB) {
        AABB = AABB == undefined ? getAABB(body) : AABB;

        if (this.qtd <= 5 || this.l == 8) {
            this.bodies.push(body);
            this.AABBs.push(AABB);
        }
        else {
            if (this.bodies.length > 0) {
                for (var i = 0; i < this.bodies.length; i++) {
                    this.processInsert(this.bodies[i], this.AABBs[i]);
                }
                this.bodies = [];
                this.AABBs = [];
            }
            this.processInsert(body, AABB);
        }
        this.qtd++;
    };

    this.removeBody = function (body) {
        var removed = false;
        if (this.bodies.length > 0 && this.qtd > 0) {
            var index = this.bodies.indexOf(body);
            if (index != -1) {
                this.bodies.splice(index, 1);
                this.AABBs.splice(index, 1);
                removed = true;
            }
        }
        else {
            if (this.nodeA != null) {
                if (this.nodeA.removeBody(body)) {
                    removed = true;
                    if (this.nodeA.qtd == 0) {
                        this.nodeA = null;
                    }
                }
            }
            if (this.nodeB != null) {
                if (this.nodeB.removeBody(body)) {
                    removed = true;
                    if (this.nodeB.qtd == 0) {
                        this.nodeB = null;
                    }
                }
            }
            if (this.nodeC != null) {
                if (this.nodeC.removeBody(body)) {
                    removed = true;
                    if (this.nodeC.qtd == 0) {
                        this.nodeC = null;
                    }
                }
            }
            if (this.nodeD != null) {
                if (this.nodeD.removeBody(body)) {
                    removed = true;
                    if (this.nodeD.qtd == 0) {
                        this.nodeD = null;
                    }
                }
            }
        }

        if (removed) {
            this.qtd--;
        }
        return removed;
    };

    this.processInsert = function (body, AABB) {
        var x0 = this.AABB[0];
        var y0 = this.AABB[1];
        var x1 = this.AABB[2];
        var y1 = this.AABB[3];

        var AABBA = [x0, y0, x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2)];
        var AABBB = [x0 + ((x1 - x0) / 2), y0, x1, y0 + ((y1 - y0) / 2)];
        var AABBC = [x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2), x1, y1];
        var AABBD = [x0, y0 + ((y1 - y0) / 2), x0 + ((x1 - x0) / 2), y1];

        if (AABBoverlap(AABBA, AABB, 0)) {
            this.getNodeA(AABBA).addBody(body, AABB);
        }
        if (AABBoverlap(AABBB, AABB, 0)) {
            this.getNodeB(AABBB).addBody(body, AABB);
        }
        if (AABBoverlap(AABBC, AABB, 0)) {
            this.getNodeC(AABBC).addBody(body, AABB);
        }
        if (AABBoverlap(AABBD, AABB, 0)) {
            this.getNodeD(AABBD).addBody(body, AABB);
        }
    };

    this.getNodeA = function (AABB) {
        if (this.nodeA == null) {
            if (AABB == undefined) {
                var x0 = this.AABB[0];
                var y0 = this.AABB[1];
                var x1 = this.AABB[2];
                var y1 = this.AABB[3];
                AABB = [x0, y0, x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2)];
            }
            this.nodeA = new QuadTree(AABB, this.l + 1);
        }
        return this.nodeA;
    };

    this.getNodeB = function (AABB) {
        if (this.nodeB == null) {
            if (AABB == undefined) {
                var x0 = this.AABB[0];
                var y0 = this.AABB[1];
                var x1 = this.AABB[2];
                var y1 = this.AABB[3];
                AABB = [x0 + ((x1 - x0) / 2), y0, x1, y0 + ((y1 - y0) / 2)];
            }
            this.nodeB = new QuadTree(AABB, this.l + 1);
        }
        return this.nodeB;
    };

    this.getNodeC = function (AABB) {
        if (this.nodeC == null) {
            if (AABB == undefined) {
                var x0 = this.AABB[0];
                var y0 = this.AABB[1];
                var x1 = this.AABB[2];
                var y1 = this.AABB[3];
                AABB = [x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2), x1, y1];
            }
            this.nodeC = new QuadTree(AABB, this.l + 1);
        }
        return this.nodeC;
    };

    this.getNodeD = function (AABB) {
        if (this.nodeD == null) {
            if (AABB == undefined) {
                var x0 = this.AABB[0];
                var y0 = this.AABB[1];
                var x1 = this.AABB[2];
                var y1 = this.AABB[3];
                AABB = [x0, y0 + ((y1 - y0) / 2), x0 + ((x1 - x0) / 2), y1];
            }
            this.nodeD = new QuadTree(AABB, this.l + 1);
        }
        return this.nodeD;
    };
}


