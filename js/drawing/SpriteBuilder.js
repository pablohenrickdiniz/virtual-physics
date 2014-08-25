/**
 * Created by Pablo Henrick Diniz on 17/08/14.
 */
function SpriteBuilder(){}
SpriteBuilder.images = new Array();
SpriteBuilder.getSprite = function(url, rows, cols){
    return new Sprite(url, rows, cols);
}