/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
    if (document.getElementById(canvas) == null) {
        throw new TypeError('Element canvas doesn\'t exists');
    }
    this.canvas = canvas;
    this.width = MV.toInt($("#" + canvas).css('width'));
    this.height = MV.toInt($("#" + canvas).css('height'));
    this.context = $("#" + canvas).get(0).getContext('2d');
    this.scale = 1;
    this.center = [this.width / 2, this.height / 2];
    this.min = [0, 0];

    if (!this.context.setLineDash) {
        this.context.setLineDash = function (line) {
        };
    }

    this.drawShape = function (shape) {
        if (shape instanceof Body) {
            this.drawBody(shape);
        }
        else if (shape instanceof Polygon) {
            this.drawPolygon(shape);
        }
    };

    this.drawAABB = function(AABB){
        this.context.fillStyle = 'transparent';
        this.context.strokeRect(AABB[0]*this.scale,AABB[1]*this.scale,(AABB[2]-AABB[0])*this.scale,(AABB[3]-AABB[1])*this.scale);
    };

    this.drawQuadTree = function(quad,sub){
        if(sub != true){
            this.clearScreen();
        }

        this.drawAABB(quad.AABB);
        var size = quad.nodes.length, i,node;
        for(i = 0; i <size;i++){
            node = quad.nodes[i];
            if(node != null){
                this.drawQuadTree(node,true);
            }
        }
    };

    this.drawWorld = function (world) {
        this.clearScreen();
        var size = world.bodies.length,bodies = world.bodies,i;
        for(i=0;i<size;i++){
            this.drawShape(bodies[i]);
        }
    };

    this.drawCircle = function (circle) {
        if (circle instanceof Circle) {
            this.drawArc(circle);
        }
    };

    this.drawArc = function (arc) {
        if (arc instanceof Arc) {
            this.fillShadow(arc.shadow);
            this.fillShape(arc);
            this.context.beginPath();
            this.context.arc(arc.center[0], arc.center[1],
                arc.radius, Math.PI * arc.start / 180,
                Math.PI * arc.end / 180);
            this.context.fill();
            this.preencherBorda(arc.border);
        }
    };

    this.drawPolygon = function (polygon) {
        var center = polygon.center,vertices = polygon.vertices,size = vertices.length,i,scale = this.scale;
        this.context.save();
        this.context.translate(center[0] *scale, center[1] *scale);
        this.context.rotate(polygon.theta);
        this.context.beginPath();
        this.context.moveTo(vertices[0][0] *scale, vertices[0][1] *scale);
        for(i=1;i<size;i++){
            this.context.lineTo(vertices[i][0] * scale, vertices[i][1] * scale);
        }
        this.context.closePath();
        this.fillShape(polygon);
        this.context.fill();
        this.fillShadow(polygon.shadow);
        this.preencherBorda(polygon.border);
        this.context.restore();
    };
    this.drawBody = function (body) {
        var polygon = body.shape,center = body.center,vertices = polygon.vertices,scale = this.scale,
        i,size = vertices.length;
        this.context.save();
        this.context.translate(center[0] * scale, center[1] * scale);
        this.context.rotate(polygon.theta);
        this.context.beginPath();
        this.context.moveTo(vertices[0][0] * scale, vertices[0][1] * scale);
        for(i=1;i<size;i++){
            this.context.lineTo(vertices[i][0] * scale, vertices[i][1] * scale);
        }
        this.context.closePath();
        this.fillShape(polygon);
        this.context.fill();
        this.fillShadow(polygon.shadow);
        this.preencherBorda(polygon.border);
        this.context.restore();
    };

    this.clearScreen = function () {
        this.context.clearRect(this.min[0], this.min[1], this.width, this.height);
    };

    this.move = function (center) {
        var xa = this.center[0] - center[0];
        var xb = this.center[1] - center[1];
        this.center = center;
        this.min = [center[0] - (this.width / 2), center[1] - (this.height / 2)];
        this.context.translate(xa, xb);
    };

    this.fillGradient = function (shape) {
        var gradient = shape.color;
        var grad = null;
        var quad = shape.updateMinAndMax()
        var width = quad.max[0] - quad.min[0];
        var height = quad.max[1] - quad.min[1];
        var wm = width / 2;
        var hm = height / 2;
        var cx = quad.min[0] + (wm);
        var cy = quad.min[1] + (hm);

        if (gradient instanceof RadialGradient) {
            var r = gradient.r;
            cx = gradient.cx;
            cy = gradient.cy;
            var fx = gradient.fx;
            var fy = gradient.fy;

            var gxp = (cx - wm) + width * (cx / 100);
            var gyp = (cy - hm) + height * (cy / 100);
            var fxp = (cx - wm) + width * (fx / 100);
            var fyp = (cy - hm) + height * (fy / 100);
            var rp = width * (r / 100);
            grad = this.context.createRadialGradient(fxp, fyp, 0, gxp, gyp, rp);
        } else {
            var px0 = gradient.px0;
            var py0 = gradient.py0;
            var px1 = gradient.px1;
            var py1 = gradient.py1;
            var x0 = (cx - wm) + width * (px0 / 100);
            var y0 = (cy - hm) + height * (py0 / 100);
            var x1 = (cx - wm) + width * (px1 / 100);
            var y1 = (cy - hm) + height * (py1 / 100);
            grad = this.context.createLinearGradient(x0, y0, x1, y1);
        }

        for (var i = 0; i < gradient.colorsStop.length; i++) {
            grad.addColorStop(gradient.colorsStop[i][0] / 100, this.fillColor(gradient.colorsStop[i][1]));
        }
        return grad;
    };

    this.fillColor = function (color) {
        if (color instanceof Color) {
            return color.toRGBA();
        }
        return color;
    };

    this.fillShadow = function (shadow) {
        this.context.save();
        if (shadow != null) {
            this.context.shadowOffsetX = shadow.x;
            this.context.shadowOffsetY = shadow.y;
            this.context.shadowBlur = shadow.blur;
            this.context.shadowColor = this.fillColor(shadow.color);
        }
        this.context.fill();
        this.context.restore();
    };

    this.preencherBorda = function (border) {
        this.context.setLineDash(border.lineDash);
        this.context.lineCap = border.lineCap;
        this.context.strokeStyle = this.fillColor(border.color);
        this.context.lineWidth = border.thickness;
        this.context.stroke();
    };

    this.fillShape = function (shape) {
        var color = shape.color;
        if (color instanceof LinearGradient || color instanceof RadialGradient) {
            this.context.fillStyle = this.fillGradient(shape);
        } else if (color instanceof Image) {
            this.context.fillStyle = color.getFillPattern(this.context);
        } else {

            this.context.fillStyle = this.fillColor(color);
        }
    };


    this.drawImage = function (image) {
        if (image instanceof Image) {
            if (image.loaded) {
                var img = image.getElement();
                var w = image.width;
                var h = image.height;
                var sx = image.sx;
                var sy = image.sy;
                var x = image.x;
                var y = image.y;
                this.context.drawImage(img, sx, sy, w, h, x, y, w, h);
                return true;
            }
        }
    };
}