function Image(url) {
    this.url = url;
    this.sx = 0;
    this.sy = 0;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.element = null;
    this.loaded = false;
    this.pattern = "repeat";
    this.fillPattern = null;

    this.load = function () {
        if (this.element == null) {
            this.element = new Image();
            $(this.element).attr("src", this.url);
            $(this.element).prop("id", this.id);
            var img = this;
            $(this.element).load(function () {
                img.width = $(this).width;
                img.height = $(this).height;
                img.loaded = true;
            });
        }
        return this.element;
    };

    this.getFillPattern = function (contexto) {
        if (this.fillPattern == null) {
            this.fillPattern = contexto.createPattern(document.getElementById(this.id), this.pattern);
        }
        return this.fillPattern;
    };

    this.getElement = function () {
        if (this.element == null) {
            return this.load();
        }
        return this.element;
    };
}

Image.REPEAT = 'repeat';
Image.REPEATX = 'repeat-x';
Image.REPEATY = 'repeat-y';
Image.NOREPEAT = 'no-repeat';
