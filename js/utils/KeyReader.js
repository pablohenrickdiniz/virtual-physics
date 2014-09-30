function KeyReader() {
};
KeyReader.pressedKeys = new Array();
KeyReader.keyDownAction = new Array();
KeyReader.keyUpAction = new Array();

KeyReader.isPressed = function (keyName) {
    var index = KeyReader.keys[keyName];
    if (KeyReader.pressedKeys[index] != undefined) {
        return KeyReader.pressedKeys[index];
    }
    return false;
};


KeyReader.onKeyDown = function (key, action) {
    if (KeyReader.keyDownAction[key] == undefined) {
        KeyReader.keyDownAction[key] = new Array();
    }
    KeyReader.keyDownAction[key].push(action);
};

KeyReader.onKeyUp = function (key, action) {
    if (KeyReader.keyUpAction[key] == undefined) {
        KeyReader.keyUpAction[key] = new Array();
    }
    KeyReader.keyUpAction[key].push(action);
};

KeyReader.keyDown = function (keyCode) {
    if (KeyReader.keyDownAction[keyCode] != undefined) {
        if (KeyReader.keyDownAction[keyCode] != undefined) {
            for (var i = 0; i < KeyReader.keyDownAction[keyCode].length; i++) {
                KeyReader.keyDownAction[keyCode][i].call();
            }
        }
    }
};

KeyReader.keyUp = function (keyCode) {
    if (KeyReader.keyUpAction[keyCode] != undefined) {
        if (KeyReader.keyUpAction[keyCode] != undefined) {
            for (var i = 0; i < KeyReader.keyUpAction[keyCode].length; i++) {
                KeyReader.keyUpAction[keyCode][i].call();
            }
        }
    }
}

$(document).keydown(function (event) {
    console.log('keyPressed');
    var keyCode = event.which;
    KeyReader.pressedKeys[keyCode] = true;
    $("#" + keyCode).html('true');
    KeyReader.keyDown(keyCode);
});

$(document).keyup(function (event) {
    var keyCode = event.which;
    KeyReader.pressedKeys[keyCode] = false;
    $("#" + keyCode).html('false');
    KeyReader.keyUp(keyCode);
});

KeyReader.keys = {
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
