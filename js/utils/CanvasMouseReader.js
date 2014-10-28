var CanvasMouseReader = {
    element: '#game',
    vertex: [0, 0],
    leftdown: [],
    rightdown: [],
    middledown: [],
    leftup: [],
    rightup: [],
    middleup: [],
    left: false,
    middle: false,
    right: false,
    start: function () {
        var reader = this;

        $(this.element).mousemove(function (event) {
            var vd = 0;
            var hd = 0;
            $(this).parents().each(function () {
                vd += $(this).scrollTop();
                hd += $(this).scrollLeft();
            });
            vd -= $(this).scrollTop();
            hd -= $(this).scrollLeft();
            reader.vertex[0] = (event.pageX - (document.getElementById($(this).prop('id')).offsetLeft - pageXOffset)) - hd;
            reader.vertex[1] = (event.pageY - (document.getElementById($(this).prop('id')).offsetTop - pageYOffset)) - vd;
        });

        $(this.element).mousedown(function (event) {
            switch (event.which) {
                case 1:
                    reader.left = true;
                    reader.leftdown.map(function (val) {
                        val.call();
                        return val;
                    });
                    break;
                case 2:
                    reader.middle = true;
                    reader.middledown.map(function (val) {
                        val.call();
                        return val;
                    });
                    break;
                case 3:
                    reader.right = true;
                    reader.rightdown.map(function (val) {
                        val.call();
                        return val;
                    });
            }
        });
        $(this.element).mouseup(function (event) {
            switch (event.which) {
                case 1:
                    reader.left = false;
                    reader.leftup.map(function (val) {
                        val.call();
                        return val;
                    });
                    break;
                case 2:
                    reader.middle = false;
                    reader.middleup.map(function (val) {
                        val.call();
                        return val;
                    });
                    break;
                case 3:
                    reader.right = false;
                    reader.rightup.map(function (val) {
                        val.call();
                        return val;
                    });
            }
        });
    },

    onmousedown: function (which, action) {
        switch (which) {
            case 1:
                this.leftdown.push(action);
                break;
            case 2:
                this.middledown.push(action);
                break;
            case 3:
                this.rightdown.push(action);
        }
    },

    onmouseup: function (which, action) {
        switch (which) {
            case 1:
                this.leftup.push(action);
                break;
            case 2:
                this.middleup.push(action);
                break;
            case 3:
                this.rightup.push(action);
        }
    },

    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3
};
