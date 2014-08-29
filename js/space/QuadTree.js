QuadTree.prototype = new Rect();
function QuadTree(level, center, width, height) {
	Rect.call(this, center, width, height);
	this.a = null;
	this.b = null;
	this.c = null;
	this.d = null;
	this.contacts = new Array();
	this.level = level;

	this.addContact = function(contact) {
		this.contacts.push(contact);
		if (this.contacts.length > 1 && this.level < 5) {
			var box = contact.getCircumscribedSquare();
			var cw = this.width / 2;
			var ch = this.height / 2;
			var cx = this.center.getX();
			var cy = this.center.getY();

			if (Colision.boundingBox(box, cx - cw, cy - ch, cw, ch)) {
				if (this.a == null) {
					this.a = new QuadTree(this.level + 1, new Point(cx
							- (cw / 2), cy - (ch / 2)), cw, ch);
					this.a.setColor('transparent');
				}
			}
			if (Colision.boundingBox(box, cx, cy - ch, cw, ch)) {
				if (this.b == null) {
					this.b = new QuadTree(this.level + 1, new Point(cx
							+ (cw / 2), cy - (ch / 2)), cw, ch);
					this.b.setColor('transparent');
				}
			}
			if (Colision.boundingBox(box, cx - cw, cy, cw, ch)) {
				if (this.c == null) {
					this.c = new QuadTree(this.level + 1, new Point(cx
							- (cw / 2), cy + (ch / 2)), cw, ch);
					this.c.setColor('transparent');
				}
			}
			if (Colision.boundingBox(box, cx, cy, cw, ch)) {
				if (this.d == null) {
					this.d = new QuadTree(this.level + 1, new Point(cx
							+ (cw / 2), cy + (ch / 2)), cw, ch);
				}
				this.d.addContact(contact);
			}
		}
	};

    this.testColision = function() {
        if (this.contacts.length > 1) {
            for (var i = 0; i < this.contacts.length; i++) {
                var contA = this.contacts[i];
                for (var j = i + 1; j < this.contacts.length; j++) {
                    var contB = this.contacts[j];
                    var eventA = contA.getFather();
                    var eventB = contB.getFather();
                    if (eventA.isMoving() || eventB.isMoving()){
                        var objA = eventA.getObject();
                        var objB = eventB.getObject();
                        var cp = Colision.forms(contA, contB);
                        if(cp instanceof Point || cp === true){
                            Colision.applyForces(objA, objB, contA, contB,cp);
                        }
                    }
                }
             }
         }
    };

	this.removeContact = function(contact){
		this.contacts.remove(contact);
		if (this.contacts.length < 2) {
			this.a = null;
			this.b = null;
			this.c = null;
			this.d = null;
		} else {
			var box = contact.getCircumscribedSquare();
			var cw = this.width / 2;
			var ch = this.height / 2;
			var cx = this.center.getX();
			var cy = this.center.getY();

			if (this.a != null && Colision.boundingBox(box, cx - cw, cy - ch, cw, ch)) {
				this.a.removeContact(contact);
			}
			if (this.b != null && Colision.boundingBox(box, cx, cy - ch, cw, ch)) {
				this.b.removeContact(contact);
			}
			if (this.c != null && Colision.boundingBox(box, cx - cw, cy, cw, ch)) {
				this.c.removeContact(contact);
			}
			if (this.d != null && Colision.boundingBox(box, cx, cy, cw, ch)) {
				this.d.removeContact(contact);
			}
		}
	};
}