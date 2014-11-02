/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
    if (document.getElementById(canvas) == null) {
        throw new TypeError('Element canvas doesn\'t exists');
    }
    var self = this;
    self.canvas = canvas;
    self.width = MV.toInt($("#" + canvas).css('width'));
    self.height = MV.toInt($("#" + canvas).css('height'));
    self.context = $("#" + canvas).get(0).getContext('2d');
    self.scale = 1;
    self.center = [this.width / 2, this.height / 2];
    self.min = [0, 0];

    if (!self.context.setLineDash) {
        this.context.setLineDash = function (line) {};
    }

    self.drawShape = function (shape) {
        var self = this;
        if (shape instanceof Body) {
            self.drawBody(shape);
        }
        else if (shape instanceof Polygon) {
            self.drawPolygon(shape);
        }
    };

    self.drawAABB = function (AABB) {
        var self = this;
        self.context.fillStyle = 'transparent';
        self.context.strokeRect(AABB[0] * self.scale, AABB[1] * self.scale, (AABB[2] - AABB[0]) * self.scale, (AABB[3] - AABB[1]) * self.scale);
    };

    self.drawQuadTree = function (quad, sub) {
        var self = this;
        if (sub != true) {
            self.clearScreen();
        }
        self.drawAABB(quad.AABB);
        var size = quad.nodes.length;
        var i;
        var node;
        for (i = 0; i < size; i++) {
            node = quad.nodes[i];
            if (node != undefined && node.qtd > 0) {
                self.drawQuadTree(node, true);
            }
        }
    };

    self.drawWorld = function (world) {
        var self = this;
        self.clearScreen();
        var size = world.bodies.length, bodies = world.bodies, i;
        for (i = 0; i < size; i++) {
            self.drawShape(bodies[i]);
        }
    };

    self.drawCircle = function (circle) {
        self.drawArc(circle);
    };

    self.drawArc = function (arc) {
        var self = this;
        self.fillShadow(arc.shadow);
        self.fillShape(arc);
        self.context.beginPath();
        self.context.arc(arc.center[0], arc.center[1],
            arc.radius, Math.PI * arc.start / 180,
            Math.PI * arc.end / 180);
        self.context.fill();
        self.fillBorder(arc.border);
    };

    self.drawPolygon = function (polygon) {
        var self = this;
        var center = polygon.center;
        var vertices = polygon.vertices;
        var size = vertices.length;
        var i;
        var scale = self.scale;
        self.context.save();
        self.context.translate(center[0] * scale, center[1] * scale);
        self.context.rotate(polygon.theta);
        self.context.beginPath();
        self.context.moveTo(vertices[0][0] * scale, vertices[0][1] * scale);
        for (i = 1; i < size; i++) {
            self.context.lineTo(vertices[i][0] * scale, vertices[i][1] * scale);
        }
        self.context.closePath();
        self.fillShape(polygon);
        self.context.fill();
        self.fillShadow(polygon.shadow);
        self.fillBorder(polygon.border);
        self.context.restore();
    };
    this.drawBody = function (body) {
        var self = this;
        var polygon = body.shape;
        var center = body.center;
        var vertices = polygon.vertices;
        var scale = self.scale;
        var i;
        var size = vertices.length;
        self.context.save();
        self.context.translate(center[0] * scale, center[1] * scale);
        self.context.rotate(polygon.theta);
        self.context.beginPath();
        self.context.moveTo(vertices[0][0] * scale, vertices[0][1] * scale);
        for (i = 1; i < size; i++) {
            self.context.lineTo(vertices[i][0] * scale, vertices[i][1] * scale);
        }
        self.context.closePath();
        self.fillShape(polygon);
        self.context.fill();
        self.fillShadow(polygon.shadow);
        self.fillBorder(polygon.border);
        self.context.restore();
    };

    self.clearScreen = function () {
        self.context.clearRect(self.min[0], self.min[1], self.width, self.height);
    };

    self.move = function (center) {
        var self = this;
        var xa = self.center[0] - center[0];
        var xb = self.center[1] - center[1];
        self.center = center;
        self.min = [center[0] - (self.width / 2), center[1] - (self.height / 2)];
        self.context.translate(xa, xb);
    };

    self.fillGradient = function (shape) {
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
            grad = self.context.createRadialGradient(fxp, fyp, 0, gxp, gyp, rp);
        } else {
            var px0 = gradient.px0;
            var py0 = gradient.py0;
            var px1 = gradient.px1;
            var py1 = gradient.py1;
            var x0 = (cx - wm) + width * (px0 / 100);
            var y0 = (cy - hm) + height * (py0 / 100);
            var x1 = (cx - wm) + width * (px1 / 100);
            var y1 = (cy - hm) + height * (py1 / 100);
            grad = self.context.createLinearGradient(x0, y0, x1, y1);
        }
        var size = gradient.colorsStop.length;
        var i;
        for (i = 0; i < size; i++) {
            grad.addColorStop(gradient.colorsStop[i][0] / 100, self.fillColor(gradient.colorsStop[i][1]));
        }
        return grad;
    };

    self.fillColor = function (color) {
        if (color instanceof Color) {
            return color.toRGBA();
        }
        return color;
    };

    self.fillShadow = function (shadow) {
        if (shadow != null) {
            self.context.save();
            self.context.shadowOffsetX = shadow.x;
            self.context.shadowOffsetY = shadow.y;
            self.context.shadowBlur = shadow.blur;
            self.context.shadowColor = self.fillColor(shadow.color);
            self.context.fill();
            self.context.restore();
        }
    };

    self.fillBorder = function (border) {
        if(border != null){
            self.context.setLineDash(border.lineDash);
            self.context.lineCap = border.lineCap;
            self.context.strokeStyle = self.fillColor(border.color);
            self.context.lineWidth = border.thickness;
            self.context.stroke();
        }
    };

    self.fillShape = function (shape) {
        var color = shape.color;
        if (color instanceof LinearGradient || color instanceof RadialGradient) {
            self.context.fillStyle = self.fillGradient(shape);
        } else if (color instanceof Image) {
            self.context.fillStyle = color.getFillPattern(self.context);
        } else {
            self.context.fillStyle = self.fillColor(color);
        }
    };


    self.drawImage = function (image) {
        if (image instanceof Image) {
            if (image.loaded) {
                var self = this;
                var img = image.getElement();
                var w = image.width;
                var h = image.height;
                var sx = image.sx;
                var sy = image.sy;
                var x = image.x;
                var y = image.y;
                self.context.drawImage(img, sx, sy, w, h, x, y, w, h);
                return true;
            }
        }
    };
}