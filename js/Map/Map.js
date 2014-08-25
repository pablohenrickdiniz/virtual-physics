Map.prototype = new Rect();

function Map(width, height) {
	width = isNaN(width) || width < 0 ? 500 : width;
	height = isNaN(height) || height < 0 ? 500 : height;
	var center =  new Point(width / 2, height / 2);
	Rect.call(this,center , width, height);
	this.quadTree = new QuadTree(1, center, width, height);
    this.events = new Array();
    this.layers = 5;

    this.init = function(){
        for(var i = 0; i < this.layers;i++){
            this.events[i] = new Array();
        }
    };

    this.addEvent = function(event) {
        var layer = event.getLayer();
        if(layer >= 0 && layer < this.layers){
            layer = parseInt(layer);
            event.setParent(this);
            this.events[layer].push(event);
            this.quadTree.addContact(event.getContact());
        }

    };

    this.removeEvent = function(event){
        var layer = event.getLayer();
        if(layer >= 0 && layer < this.layers){
            layer = parseInt(layer);
            event.setParent(null);
            this.events[layer].remove(event);
            this.quadTree.removeContact(event.getContact());
        }
    };

    this.getEvents = function(){
        return this.events;
    };

    this.testColision = function(){
        this.quadTree.testColision();
    };

    this.getQuadTree  = function(){
        return this.quadTree;
    };

    this.getLayers = function(){
        return this.layers;
    };

    this.init();
}
