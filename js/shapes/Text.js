/**
 * Created by Pablo Henrick Diniz on 23/08/14.
 */
Text.prototype = new Shape();
function Text(center,text){
    Shape.call(this, center, text,null,0);
    this.text = text;
    this.fontStyle = 'Verdana';
    this.fontSize = 20;

    this.getText = function(){
        return this.text;
    };

    this.setText = function(text){
        this.text = text;
    };

    this.getFontStyle = function(){
        return this.fontStyle;
    };

    this.setFontStyle = function(style){
        this.style = style;
    };

    this.getFontSize = function(){
        return this.fontSize;
    };

    this.setFontSize = function(fontSize){
        this.fontSize = fontSize;
    };
}