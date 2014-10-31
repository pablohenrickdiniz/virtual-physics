function QuadTree(AABB, l) {
    this.AABB = AABB;
    this.l = l;
    this.bodies = [];
    this.AABBs = [];
    this.nodes = [];
    this.qtd = 0;

    this.clear = function () {
        this.qtd = 0;
        this.nodes = [];
        this.bodies = [];
        this.AABBs = [];
    };

    this.getAABBsGroups = function (AABBsGroups) {
        AABBsGroups = AABBsGroups == undefined ? [] : AABBsGroups;
        if (this.bodies.length > 0 && this.qtd > 1) {
            AABBsGroups.push([this.bodies, this.AABBs]);
        }
        else {
            var size = this.nodes.length;
            for(var i = 0; i < size;i++){
                this.nodes[i].getAABBsGroups(AABBsGroups);
            }
        }
        return AABBsGroups;
    };


    this.addBody = function (body, AABB) {
        AABB = AABB == undefined ? getAABB(body) : AABB;

        if (this.qtd <= 5 || this.l == 5) {
            this.bodies.push(body);
            this.AABBs.push(AABB);
        }
        else {
            if(this.nodes[0] == undefined){
                this.split();
            }
            var size = this.bodies.length;
            if (size > 0) {
                for(var i = 0; i < size;i++){
                    this.insert(this.bodies[i],this.AABBs[i]);
                }
                this.bodies = [];
                this.AABBs = [];
            }
            this.insert(body, AABB);
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
        else{
            var count = 0,size = this.nodes.length, node,i;
            for(i = 0; i < size;i++){
                node = this.nodes[i];
                if(node != null  && node.removeBody(body)){
                    removed = true;
                    if (node.qtd == 0) {
                        count++;
                    }
                }
            }
            if(count == 4){
                this.nodes = [];
            }
        }
        if (removed) {
            this.qtd--;
        }
        return removed;
    };

    this.insert = function (body, AABB) {
        var i,size=this.nodes.length,node;
        for(i = 0; i < size;i++){
            node = this.nodes[i];
            if (AABBoverlap(node.AABB, AABB, 0)) {
                node.addBody(body, AABB);
            }
        }
    };

    this.split = function(){
        var x0 = this.AABB[0];
        var y0 = this.AABB[1];
        var x1 = this.AABB[2];
        var y1 = this.AABB[3];
        var w = (x1 - x0) / 2;
        var h = (y1 - y0) / 2;
        var xw = x0 + w;
        var yh = y0 + h;
        var l = this.l+1;
        this.nodes[0] = new QuadTree([x0, y0, xw, yh], l);
        this.nodes[1] = new QuadTree([xw, y0, x1, yh], l);
        this.nodes[2] = new QuadTree([xw, yh, x1, y1], l);
        this.nodes[3] = new QuadTree([x0, yh, xw, y1], l);
    };
}


