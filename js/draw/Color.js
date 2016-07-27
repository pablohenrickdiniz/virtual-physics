(function(w){
    var Color = function(red, blue, green, alpha) {
        var self = this;
        if (arguments.length == 1) {
            var color = Color.parse(arguments[0]);
            self.red = color.red;
            self.blue = color.blue;
            self.green = color.green;
            self.alpha = color.alpha;
        } else {
            self.red = isNaN(red) || red < 0 ? 0 : red > 255 ? 255 : red;
            self.blue = isNaN(blue) || blue < 0 ? 0 : blue > 255 ? 255 : blue;
            self.green = isNaN(green) || green < 0 ? 0 : green > 255 ? 255 : green;
            self.alpha = isNaN(alpha) || alpha < 0 || alpha > 1 ? 1 : alpha;
        }
    };
    Color.prototype.toRGB = function () {
        var self = this;
        return "rgb(" + self.red + "," + self.blue + "," + self.green + ")";
    };

    Color.prototype.toRGBA= function () {
        var self = this;
        return "rgba(" + self.red + "," + self.blue + "," + self.green + ","
            + self.alpha + ")";
    };

    Color.prototype.toHEX = function () {
        var self = this;
        var r = self.red.toString(16);
        var g = self.blue.toString(16);
        var b = self.green.toString(16);
        r = r.length < 2 ? r + "0" : r;
        g = g.length < 2 ? g + "0" : g;
        b = b.length < 2 ? b + "0" : b;
        return ("#" + r + g + b).toUpperCase();
    };

    Color.prototype.toString = function () {
        var self = this;
        return self.toRGBA();
    };

    Color.prototype.reverse = function () {
        var self = this;
        self.red = self.red < 128 ? 128 + (128 - self.red)
            : 128 - (self.red - 128);
        self.blue = self.blue < 128 ? 128 + (128 - self.blue)
            : 128 - (self.blue - 128);
        self.green = self.green < 128 ? 128 + (128 - self.green)
            : 128 - (self.green - 128);
    };

    Color.asName = function () {
        var self = this;
        for (var index in Color.Name) {
            if (Color.Name[index] == self.toHEX()) {
                return index;
            }
        }
        return "";
    };

    Color.Name = {
        Snow: '#FFFAFA',
        GhostWhite: '#F8F8FF',
        WhiteSmoke: '#F5F5F5',
        Gainsboro: '#DCDCDC',
        FloralWhite: '#FFFAF0',
        OldLace: '#FDF5E6',
        Linen: '#FAF0E6',
        AntiqueWhite: '#FAEBD7',
        PapayaWhip: '#FFEFD5',
        BlanchedAlmond: '#FFEBCD',
        Bisque: '#FFE4C4',
        PeachPuff: '#FFDAB9',
        NavajoWhite: '#FFDEAD',
        Moccasin: '#FFE4B5',
        Cornsilk: '#FFF8DC',
        Ivory: '#FFFFF0',
        LemonChiffon: '#FFFACD',
        Seashell: '#FFF5EE',
        Honeydew: '#F0FFF0',
        MintCream: '#F5FFFA',
        Azure: '#F0FFFF',
        AliceBlue: '#F0F8FF',
        lavender: '#E6E6FA',
        LavenderBlush: '#FFF0F5',
        MistyRose: '#FFE4E1',
        White: '#FFFFFF',
        Black: '#000000',
        DarkSlateGray: '#2F4F4F',
        DimGrey: '#696969',
        SlateGrey: '#708090',
        LightSlateGray: '#778899',
        Grey: '#BEBEBE',
        LightGray: '#D3D3D3',
        MidnightBlue: '#191970',
        NavyBlue: '#000080',
        CornflowerBlue: '#6495ED',
        DarkSlateBlue: '#483D8B',
        SlateBlue: '#6A5ACD',
        MediumSlateBlue: '#7B68EE',
        LightSlateBlue: '#8470FF',
        MediumBlue: '#0000CD',
        RoyalBlue: '#4169E1',
        Blue: '#0000FF',
        DodgerBlue: '#1E90FF',
        DeepSkyBlue: '#00BFFF',
        SkyBlue: '#87CEEB',
        LightSkyBlue: '#87CEFA',
        SteelBlue: '#4682B4',
        LightSteelBlue: '#B0C4DE',
        LightBlue: '#ADD8E6',
        PowderBlue: '#B0E0E6',
        PaleTurquoise: '#AFEEEE',
        DarkTurquoise: '#00CED1',
        MediumTurquoise: '#48D1CC',
        Turquoise: '#40E0D0',
        Cyan: '#00FFFF',
        LightCyan: '#E0FFFF',
        CadetBlue: '#5F9EA0',
        MediumAquamarine: '#66CDAA',
        Aquamarine: '#7FFFD4',
        DarkGreen: '#006400',
        DarkOliveGreen: '#556B2F',
        DarkSeaGreen: '#8FBC8F',
        SeaGreen: '#2E8B57',
        MediumSeaGreen: '#3CB371',
        LightSeaGreen: '#20B2AA',
        PaleGreen: '#98FB98',
        SpringGreen: '#00FF7F',
        LawnGreen: '#7CFC00',
        Green: '#00FF00',
        Chartreuse: '#7FFF00',
        MedSpringGreen: '#00FA9A',
        GreenYellow: '#ADFF2F',
        LimeGreen: '#32CD32',
        YellowGreen: '#9ACD32',
        ForestGreen: '#228B22',
        OliveDrab: '#6B8E23',
        DarkKhaki: '#BDB76B',
        PaleGoldenrod: '#EEE8AA',
        LtGoldenrodYello: '#FAFAD2',
        LightYellow: '#FFFFE0',
        Yellow: '#FFFF00',
        Gold: '#FFD700',
        LightGoldenrod: '#EEDD82',
        goldenrod: '#DAA520',
        DarkGoldenrod: '#B8860B',
        RosyBrown: '#BC8F8F',
        IndianRed: '#CD5C5C',
        SaddleBrown: '#8B4513',
        Sienna: '#A0522D',
        Peru: '#CD853F',
        Burlywood: '#DEB887',
        Beige: '#F5F5DC',
        Wheat: '#F5DEB3',
        SandyBrown: '#F4A460',
        Tan: '#D2B48C',
        Chocolate: '#D2691E',
        Firebrick: '#B22222',
        Brown: '#A52A2A',
        DarkSalmon: '#E9967A',
        Salmon: '#FA8072',
        LightSalmon: '#FFA07A',
        Orange: '#FFA500',
        DarkOrange: '#FF8C00',
        Coral: '#FF7F50',
        LightCoral: '#F08080',
        Tomato: '#FF6347',
        OrangeRed: '#FF4500',
        Red: '#FF0000',
        HotPink: '#FF69B4',
        DeepPink: '#FF1493',
        Pink: '#FFC0CB',
        LightPink: '#FFB6C1',
        PaleVioletRed: '#DB7093',
        Maroon: '#B03060',
        MediumVioletRed: '#C71585',
        VioletRed: '#D02090',
        Magenta: '#FF00FF',
        Violet: '#EE82EE',
        Plum: '#DDA0DD',
        Orchid: '#DA70D6',
        MediumOrchid: '#BA55D3',
        DarkOrchid: '#9932CC',
        DarkViolet: '#9400D3',
        BlueViolet: '#8A2BE2',
        Purple: '#A020F0',
        MediumPurple: '#9370DB',
        Thistle: '#D8BFD8',
        Snow1: '#FFFAFA',
        Snow2: '#EEE9E9',
        Snow3: '#CDC9C9',
        Snow4: '#8B8989',
        Seashell1: '#FFF5EE',
        Seashell2: '#EEE5DE',
        Seashell3: '#CDC5BF',
        Seashell4: '#8B8682',
        AntiqueWhite1: '#FFEFDB',
        AntiqueWhite2: '#EEDFCC',
        AntiqueWhite3: '#CDC0B0',
        AntiqueWhite4: '#8B8378',
        Bisque1: '#FFE4C4',
        Bisque2: '#EED5B7',
        Bisque3: '#CDB79E',
        Bisque4: '#8B7D6B',
        PeachPuff1: '#FFDAB9',
        PeachPuff2: '#EECBAD',
        PeachPuff3: '#CDAF95',
        PeachPuff4: '#8B7765',
        NavajoWhite1: '#FFDEAD',
        NavajoWhite2: '#EECFA1',
        NavajoWhite3: '#CDB38B',
        NavajoWhite4: '#8B795E',
        LemonChiffon1: '#FFFACD',
        LemonChiffon2: '#EEE9BF',
        LemonChiffon3: '#CDC9A5',
        LemonChiffon4: '#8B8970',
        Cornsilk1: '#FFF8DC',
        Cornsilk2: '#EEE8CD',
        Cornsilk3: '#CDC8B1',
        Cornsilk4: '#8B8878',
        Ivory1: '#FFFFF0',
        Ivory2: '#EEEEE0',
        Ivory3: '#CDCDC1',
        Ivory4: '#8B8B83',
        Honeydew1: '#F0FFF0',
        Honeydew2: '#E0EEE0',
        Honeydew3: '#C1CDC1',
        Honeydew4: '#838B83',
        LavenderBlush1: '#FFF0F5',
        LavenderBlush2: '#EEE0E5',
        LavenderBlush3: '#CDC1C5',
        LavenderBlush4: '#8B8386',
        SlateGray4: '#6C7B8B',
        LightSteelBlue1: '#CAE1FF',
        LightSteelBlue2: '#BCD2EE',
        LightSteelBlue3: '#A2B5CD',
        LightSteelBlue4: '#6E7B8B',
        LightBlue1: '#BFEFFF',
        LightBlue2: '#B2DFEE',
        LightBlue3: '#9AC0CD',
        LightBlue4: '#68838B',
        LightCyan1: '#E0FFFF',
        LightCyan2: '#D1EEEE',
        LightCyan3: '#B4CDCD',
        LightCyan4: '#7A8B8B',
        PaleTurquoise1: '#BBFFFF',
        PaleTurquoise2: '#AEEEEE',
        PaleTurquoise3: '#96CDCD',
        PaleTurquoise4: '#668B8B',
        CadetBlue1: '#98F5FF',
        CadetBlue2: '#8EE5EE',
        CadetBlue3: '#7AC5CD',
        CadetBlue4: '#53868B',
        Turquoise1: '#00F5FF',
        Turquoise2: '#00E5EE',
        Turquoise3: '#00C5CD',
        Turquoise4: '#00868B',
        Cyan1: '#00FFFF',
        Cyan2: '#00EEEE',
        Cyan3: '#00CDCD',
        Cyan4: '#008B8B',
        DarkSlateGray1: '#97FFFF',
        DarkSlateGray2: '#8DEEEE',
        DarkSlateGray3: '#79CDCD',
        DarkSlateGray4: '#528B8B',
        Aquamarine1: '#7FFFD4',
        Aquamarine2: '#76EEC6',
        Aquamarine3: '#66CDAA',
        Aquamarine4: '#458B74',
        DarkSeaGreen1: '#C1FFC1',
        DarkSeaGreen2: '#B4EEB4',
        DarkSeaGreen3: '#9BCD9B',
        DarkSeaGreen4: '#698B69',
        SeaGreen1: '#54FF9F',
        SeaGreen2: '#4EEE94',
        MistyRose1: '#FFE4E1',
        MistyRose2: '#EED5D2',
        MistyRose3: '#CDB7B5',
        MistyRose4: '#8B7D7B',
        Azure1: '#F0FFFF',
        Azure2: '#E0EEEE',
        Azure3: '#C1CDCD',
        Azure4: '#838B8B',
        SlateBlue1: '#836FFF',
        SlateBlue2: '#7A67EE',
        SlateBlue3: '#6959CD',
        SlateBlue4: '#473C8B',
        RoyalBlue1: '#4876FF',
        RoyalBlue2: '#436EEE',
        RoyalBlue3: '#3A5FCD',
        RoyalBlue4: '#27408B',
        Blue1: '#0000FF',
        Blue2: '#0000EE',
        Blue3: '#0000CD',
        Blue4: '#00008B',
        DodgerBlue1: '#1E90FF',
        DodgerBlue2: '#1C86EE',
        DodgerBlue3: '#1874CD',
        DodgerBlue4: '#104E8B',
        SteelBlue1: '#63B8FF',
        SteelBlue2: '#5CACEE',
        SteelBlue3: '#4F94CD',
        SteelBlue4: '#36648B',
        DeepSkyBlue1: '#00BFFF',
        DeepSkyBlue2: '#00B2EE',
        DeepSkyBlue3: '#009ACD',
        DeepSkyBlue4: '#00688B',
        SkyBlue1: '#87CEFF',
        SkyBlue2: '#7EC0EE',
        SkyBlue3: '#6CA6CD',
        SkyBlue4: '#4A708B',
        LightSkyBlue1: '#B0E2FF',
        LightSkyBlue2: '#A4D3EE',
        LightSkyBlue3: '#8DB6CD',
        LightSkyBlue4: '#607B8B',
        SlateGray1: '#C6E2FF',
        SlateGray2: '#B9D3EE',
        SlateGray3: '#9FB6CD',
        Firebrick4: '#8B1A1A',
        Brown1: '#FF4040',
        Brown2: '#EE3B3B',
        Brown3: '#CD3333',
        Brown4: '#8B2323',
        Salmon1: '#FF8C69',
        Salmon2: '#EE8262',
        Salmon3: '#CD7054',
        Salmon4: '#8B4C39',
        LightSalmon1: '#FFA07A',
        LightSalmon2: '#EE9572',
        LightSalmon3: '#CD8162',
        LightSalmon4: '#8B5742',
        Orange1: '#FFA500',
        Orange2: '#EE9A00',
        Orange3: '#CD8500',
        Orange4: '#8B5A00',
        DarkOrange1: '#FF7F00',
        DarkOrange2: '#EE7600',
        DarkOrange3: '#CD6600',
        DarkOrange4: '#8B4500',
        Coral1: '#FF7256',
        Coral2: '#EE6A50',
        Coral3: '#CD5B45',
        Coral4: '#8B3E2F',
        Tomato1: '#FF6347',
        Tomato2: '#EE5C42',
        Tomato3: '#CD4F39',
        Tomato4: '#8B3626',
        OrangeRed1: '#FF4500',
        OrangeRed2: '#EE4000',
        OrangeRed3: '#CD3700',
        OrangeRed4: '#8B2500',
        Red1: '#FF0000',
        Red2: '#EE0000',
        Red3: '#CD0000',
        Red4: '#8B0000',
        DeepPink1: '#FF1493',
        DeepPink2: '#EE1289',
        DeepPink3: '#CD1076',
        DeepPink4: '#8B0A50',
        HotPink1: '#FF6EB4',
        HotPink2: '#EE6AA7',
        Gold2: '#EEC900',
        HotPink3: '#CD6090',
        HotPink4: '#8B3A62',
        Pink1: '#FFB5C5',
        Pink2: '#EEA9B8',
        Pink3: '#CD919E',
        Pink4: '#8B636C',
        LightPink1: '#FFAEB9',
        LightPink2: '#EEA2AD',
        LightPink3: '#CD8C95',
        LightPink4: '#8B5F65',
        PaleVioletRed1: '#FF82AB',
        PaleVioletRed2: '#EE799F',
        PaleVioletRed3: '#CD6889',
        PaleVioletRed4: '#8B475D',
        Maroon1: '#FF34B3',
        Maroon2: '#EE30A7',
        Maroon3: '#CD2990',
        Maroon4: '#8B1C62',
        VioletRed1: '#FF3E96',
        VioletRed2: '#EE3A8C',
        VioletRed3: '#CD3278',
        VioletRed4: '#8B2252',
        Magenta1: '#FF00FF',
        Magenta2: '#EE00EE',
        Magenta3: '#CD00CD',
        Magenta4: '#8B008B',
        Orchid1: '#FF83FA',
        Orchid2: '#EE7AE9',
        Orchid3: '#CD69C9',
        Orchid4: '#8B4789',
        Plum1: '#FFBBFF',
        Plum2: '#EEAEEE',
        Plum3: '#CD96CD',
        Plum4: '#8B668B',
        MediumOrchid1: '#E066FF',
        MediumOrchid2: '#D15FEE',
        MediumOrchid3: '#B452CD',
        MediumOrchid4: '#7A378B',
        DarkOrchid1: '#BF3EFF',
        DarkOrchid2: '#B23AEE',
        DarkOrchid3: '#9A32CD',
        DarkOrchid4: '#68228B',
        Purple1: '#9B30FF',
        Purple2: '#912CEE',
        SeaGreen3: '#43CD80',
        SeaGreen4: '#2E8B57',
        PaleGreen1: '#9AFF9A',
        PaleGreen2: '#90EE90',
        PaleGreen3: '#7CCD7C',
        PaleGreen4: '#548B54',
        SpringGreen1: '#00FF7F',
        SpringGreen2: '#00EE76',
        SpringGreen3: '#00CD66',
        SpringGreen4: '#008B45',
        Green1: '#00FF00',
        Green2: '#00EE00',
        Green3: '#00CD00',
        Green4: '#008B00',
        Chartreuse1: '#7FFF00',
        Chartreuse2: '#76EE00',
        Chartreuse3: '#66CD00',
        Chartreuse4: '#458B00',
        OliveDrab1: '#C0FF3E',
        OliveDrab2: '#B3EE3A',
        OliveDrab3: '#9ACD32',
        OliveDrab4: '#698B22',
        DarkOliveGreen1: '#CAFF70',
        DarkOliveGreen2: '#BCEE68',
        DarkOliveGreen3: '#A2CD5A',
        DarkOliveGreen4: '#6E8B3D',
        Khaki1: '#FFF68F',
        Khaki2: '#EEE685',
        Khaki3: '#CDC673',
        Khaki4: '#8B864E',
        LightGoldenrod1: '#FFEC8B',
        LightGoldenrod2: '#EEDC82',
        LightGoldenrod3: '#CDBE70',
        LightGoldenrod4: '#8B814C',
        LightYellow1: '#FFFFE0',
        LightYellow2: '#EEEED1',
        LightYellow3: '#CDCDB4',
        LightYellow4: '#8B8B7A',
        Yellow1: '#FFFF00',
        Yellow2: '#EEEE00',
        Yellow3: '#CDCD00',
        Yellow4: '#8B8B00',
        Gold1: '#FFD700',
        Gold3: '#CDAD00',
        Gold4: '#8B7500',
        Goldenrod1: '#FFC125',
        Goldenrod2: '#EEB422',
        Goldenrod3: '#CD9B1D',
        Goldenrod4: '#8B6914',
        DarkGoldenrod1: '#FFB90F',
        DarkGoldenrod2: '#EEAD0E',
        DarkGoldenrod3: '#CD950C',
        DarkGoldenrod4: '#8B658B',
        RosyBrown1: '#FFC1C1',
        RosyBrown2: '#EEB4B4',
        RosyBrown3: '#CD9B9B',
        RosyBrown4: '#8B6969',
        IndianRed1: '#FF6A6A',
        IndianRed2: '#EE6363',
        IndianRed3: '#CD5555',
        IndianRed4: '#8B3A3A',
        Sienna1: '#FF8247',
        Sienna2: '#EE7942',
        Sienna3: '#CD6839',
        Sienna4: '#8B4726',
        Burlywood1: '#FFD39B',
        Burlywood2: '#EEC591',
        Burlywood3: '#CDAA7D',
        Burlywood4: '#8B7355',
        Wheat1: '#FFE7BA',
        Wheat2: '#EED8AE',
        Wheat3: '#CDBA96',
        Wheat4: '#8B7E66',
        Tan1: '#FFA54F',
        Purple3: '#7D26CD',
        Purple4: '#551A8B',
        MediumPurple1: '#AB82FF',
        MediumPurple2: '#9F79EE',
        MediumPurple3: '#8968CD',
        MediumPurple4: '#5D478B',
        Thistle1: '#FFE1FF',
        Thistle2: '#EED2EE',
        Thistle3: '#CDB5CD',
        Thistle4: '#8B7B8B',
        grey11: '#1C1C1C',
        grey21: '#363636',
        grey31: '#4F4F4F',
        grey41: '#696969',
        grey51: '#828282',
        grey61: '#9C9C9C',
        grey71: '#B5B5B5',
        gray81: '#CFCFCF',
        gray91: '#E8E8E8',
        DarkGrey: '#A9A9A9',
        DarkBlue: '#00008B',
        DarkCyan: '#008B8B',
        DarkMagenta: '#8B008B',
        DarkRed: '#8B0000',
        LightGreen: '#90EE90',
        Chocolate3: '#CD661D',
        Chocolate4: '#8B4513',
        Firebrick1: '#FF3030',
        Firebrick2: '#EE2C2C',
        Firebrick3: '#CD2626',
        Tan2: '#EE9A49',
        Tan3: '#CD853F',
        Tan4: '#8B5A2B',
        Chocolate1: '#FF7F24',
        Chocolate2: '#EE7621'
    };

    Color.Patterns = {
        HEXADECIMAL: '^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$',
        RGB: "^rgb\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*\\)$",
        RGBA: "^rgba\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*((0.[1-9])|[01])\\s*\\)$",
        NAME: '^[A-Z]{1}[a-zA-z0-9]{2,15}$'
    };

    Color.validate = function(color){
        if(!(color instanceof Color)){
            color = Color.parse(color);
            if(color == null){
                throw new TypeError('the color must be a a rgb, rgba, hexadecimal, color name ou instance of Color');
            }
        }
    };



    Color.parse = function (str) {
        var exp = new RegExp(Color.Patterns.HEXADECIMAL);
        var color = null;
        var r;
        var g;
        var b;
        if (exp.test(str)) {
            str = str.substr(str.indexOf("#") + 1, str.length);
            r = parseInt(str.substr(0, 2), 16);
            g = parseInt(str.substr(2, 2), 16);
            b = parseInt(str.substr(4, 2), 16);
            color = new Color(r, g, b);
        } else {
            exp = new RegExp(Color.Patterns.RGB);
            if (exp.test(str)) {
                str = str.replace("rgb(", "").replace(")", "").split(",");
                r = parseInt(str[0]);
                g = parseInt(str[1]);
                b = parseInt(str[2]);
                color = new Color(r, g, b);
            } else {
                exp = new RegExp(Color.Patterns.RGBA);
                if (exp.test(str)) {
                    str = str.replace("rgba(", "").replace(")", "").split(",");
                    r = parseInt(str[0]);
                    g = parseInt(str[1]);
                    b = parseInt(str[2]);
                    var a = parseFloat(str[3]);
                    color = new Color(r, g, b, a);
                } else {
                    exp = new RegExp(Color.Patterns.NAME);
                    if (exp.test(str)) {
                        color = Color.parse(Color.Name[str]);
                    }
                }
            }
        }
        return color;
    };

    w.Color = Color;
})();
