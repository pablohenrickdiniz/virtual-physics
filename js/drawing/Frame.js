/**
 * Created by Pablo Henrick Diniz on 14/08/14.
 */
function Frame(image, sx,sy,swidth,sheight){
    this.sx = sx;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
    this.image = image;

    this.getImage= function(){
        return this.image;
    };

    this.getSx = function(){
        return this.sx;
    };

    this.getSy = function(){
        return this.sy;
    };

    this.getSwidth = function(){
        return this.swidth;
    };

    this.getSheight = function(){
        return this.sheight;
    };
}