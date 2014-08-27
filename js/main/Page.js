/**
 * Created by Pablo Henrick Diniz on 15/08/14.
 */
function Page(sprite){
    this.action = function(){};
    this.sprite = sprite;
    this.playing = false;

    this.init = function(){
        this.action.call();
    };

    this.setAction = function(action){
        this.action = action;
    };

    this.setSprite = function(sprite){
        this.sprite = sprite;
    };

    this.getSprite = function(){
        return this.sprite;
    };
}