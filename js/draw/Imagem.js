function Image(url) {
    var self = this;
    self.url = url;
    self.sx = 0;
    self.sy = 0;
    self.x = 0;
    self.y = 0;
    self.width = 0;
    self.height = 0;
    self.element = null;
    self.loaded = false;
    self.pattern = "repeat";
    self.fillPattern = null;

    self.load = function () {
        var self = this;
        if (self.element == null) {
            self.element = new Image();
            $(self.element).attr("src", self.url);
            $(self.element).prop("id", self.id);
            $(self.element).load(function () {
                self.width = $(this).width;
                self.height = $(this).height;
                self.loaded = true;
            });
        }
        return self.element;
    };

    self.getFillPattern = function (context) {
        var self = this;
        if (self.fillPattern == null) {
            self.fillPattern = context.createPattern(document.getElementById(self.id), self.pattern);
        }
        return self.fillPattern;
    };

    self.getElement = function () {
        var self = this;
        if (self.element == null) {
            return self.load();
        }
        return self.element;
    };
}

Image.REPEAT = 'repeat';
Image.REPEATX = 'repeat-x';
Image.REPEATY = 'repeat-y';
Image.NOREPEAT = 'no-repeat';
