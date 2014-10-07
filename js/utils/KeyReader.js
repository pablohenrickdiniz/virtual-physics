/**
 * Created by Pablo Henrick Diniz on 07/10/14.
 */

var KeyReader = {
    pressed:[],
    keydownaction:[],
    keyupaction:[],
    isPressed:function (keyName) {
        var index = this.keys[keyName];
        if (this.pressedKeys[index] != undefined) {
            return this.pressedKeys[index];
        }
        return false;
    },
    onkeydown:function (key, action) {

        if (this.keydownaction[key] == undefined) {
            this.keydownaction[key] = [];
        }
        this.keydownaction[key].push(action);
    },
    onkeyup:function (key, action) {
        if (this.keyupaction[key] == undefined) {
            this.keyupaction[key] = [];
        }
        this.keyupaction[key].push(action);
    },
    keydown:function (keyCode) {
        if (this.keydownaction[keyCode] != undefined) {
            if (this.keydownaction[keyCode] != undefined) {
                for (var i = 0; i < this.keydownaction[keyCode].length; i++) {
                    this.keydownaction[keyCode][i].call();
                }
            }
        }
    },
    keyup:function (keyCode) {
        if (this.keyupaction[keyCode] != undefined) {
            if (this.keyupaction[keyCode] != undefined) {
                for (var i = 0; i < this.keyupaction[keyCode].length; i++) {
                    this.keyupaction[keyCode][i].call();
                }
            }
        }
    },
    KEY_DOWN: 40,
    KEY_UP: 38,
    KEY_LEFT: 37,
    KEY_RIGHT: 39,
    KEY_END: 35,
    KEY_BEGIN: 36,
    KEY_BACK_TAB: 8,
    KEY_TAB: 9,
    KEY_SH_TAB: 16,
    KEY_ENTER: 13,
    KEY_ESC: 27,
    KEY_SPACE: 32,
    KEY_DEL: 46,
    KEY_A: 65,
    KEY_B: 66,
    KEY_C: 67,
    KEY_D: 68,
    KEY_E: 69,
    KEY_F: 70,
    KEY_G: 71,
    KEY_H: 72,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_M: 77,
    KEY_N: 78,
    KEY_O: 79,
    KEY_P: 80,
    KEY_Q: 81,
    KEY_R: 82,
    KEY_S: 83,
    KEY_T: 84,
    KEY_U: 85,
    KEY_V: 86,
    KEY_W: 87,
    KEY_X: 88,
    KEY_Y: 89,
    KEY_Z: 90,
    KEY_PF1: 112,
    KEY_PF2: 113,
    KEY_PF3: 114,
    KEY_PF4: 115,
    KEY_PF5: 116,
    KEY_PF6: 117,
    KEY_PF7: 118,
    KEY_PF8: 119
};

$(document).keydown(function (event) {
    console.log('keyPressed');
    var keyCode = event.which;
    KeyReader.pressed[keyCode] = true;
    $("#" + keyCode).html('true');
    KeyReader.keydown(keyCode);
});

$(document).keyup(function (event) {
    var keyCode = event.which;
    KeyReader.pressed[keyCode] = false;
    $("#" + keyCode).html('false');
    KeyReader.keyup(keyCode);
});

