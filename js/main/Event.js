function Event() {
    this.object = new Object();
    this.pages = new Array();
    this.atualPage = null;
    this.layer = 3;
    this.parent = null;

    this.setContact = function(contact){
        this.contact = contact;
        this.contact.setFather(this);
    };

    this.getCenter = function(){
        return this.contact.getCenter();
    };

    this.getLayer = function () {
        return this.layer;
    };

    this.getAtualPage = function () {
        return this.atualPage;
    };

    this.getContact = function(){
        return this.contact;
    };

    this.addPage = function (label, page) {
        if (this.pages.length == 0) {
            this.atualPage = page;
        }
        this.pages[label] = page;
    };

    this.getPage = function (label) {
        if (this.pages[label] != undefined) {
            return this.pages[label];
        }
        return null;
    };

    this.changePage = function (label) {
        this.atualPage = this.pages[label];
        this.atualPage.init();
    };

    this.setObject = function (object) {
        this.object = object;
    };

    this.getObject = function(){
        return this.object;
    };

    this.setPosicao = function (posicao) {
        this.posicao = posicao;
    };

    this.setCamada = function (camada) {
        if (camada > 0 && camada <= this.parent.getLayers()) {
            this.layer = parseInt(camada);
            this.setElement("#canvas" + camada);
        }
    };

    this.setParent = function (mapa) {
        this.parent = mapa;
    };

    this.getAtualFrame = function () {
        return this.atualPage.sprite.getAtualFrame();
    };

    this.getX = function () {
        return this.contact.getCenter().getX();
    };

    this.getY = function () {
        return this.contact.getCenter().getY();
    };

    this.moveTo = function(x, y) {
        this.contact.moveTo(x, y);
    };

    this.translate = function(x, y) {

        this.contact.translate(x, y);
    };

    this.isMoving = function(){
        return (this.object.vector.getX() != 0 || this.object.vector.getY() != 0 || this.object.angularSpeed != 0);
    };

    this.step = function() {
        if(this.object.dinamic){
            if(this.object.vector.getX() != 0 || this.object.vector.getY() != 0){
                var x = this.object.vector.getX() / METERPIXEL;
                var y = this.object.vector.getY() / METERPIXEL;
                this.contact.translate(x, y);
            }

            if(this.object.vector.getNorm() < VELOCIDADETERMINAL && this.object.gravityInfluence){
                this.object.vector = Vector.sum(this.object.vector, GRAVITY);
            }
        }
        if(this.object.angularSpeed != 0 && this.object.angularInfluence) {
            this.contact.rotate(this.angularSpeed);
        }
    };
}