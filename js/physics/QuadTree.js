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
            this.nodes.forEach(function(node){
                node.getAABBsGroups(AABBsGroups);
            });
        }
        return AABBsGroups;
    };


    this.addBody = function (body, AABB) {
        AABB = AABB == undefined ? getAABB(body) : AABB;

        if (this.qtd <= 10 || this.l == 5) {
            this.bodies.push(body);
            this.AABBs.push(AABB);
        }
        else {
            console.log(this);
            if(this.nodes[0] == undefined){
                this.split();
            }
            if (this.bodies.length > 0) {
                var quad = this;
                this.bodies.forEach(function(elem,index){
                    quad.insert(elem,quad.AABBs[index]);
                });
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
            var count = 0;
            this.nodes.forEach(function(node){
               if(node != null  && node.removeBody(body)){
                   removed = true;
                   if (node.qtd == 0) {
                       count++;
                   }
               }
            });
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
        this.nodes.forEach(function(node){
            if (AABBoverlap(node.AABB, AABB, 0)) {
                node.addBody(body, AABB);
            }
        });
    };

    this.split = function(){
        var x0 = this.AABB[0];
        var y0 = this.AABB[1];
        var x1 = this.AABB[2];
        var y1 = this.AABB[3];

        this.nodes[0] = new QuadTree([x0, y0, x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2)], this.l + 1);
        this.nodes[1] = new QuadTree([x0 + ((x1 - x0) / 2), y0, x1, y0 + ((y1 - y0) / 2)], this.l + 1);
        this.nodes[2] = new QuadTree([x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2), x1, y1], this.l + 1);
        this.nodes[3] = new QuadTree([x0, y0 + ((y1 - y0) / 2), x0 + ((x1 - x0) / 2), y1], this.l + 1);
    };
}


