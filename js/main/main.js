/**
 * Created by Pablo Henrick Diniz on 15/10/14.
 */

require(['paths'],function(){
    require(['jquery','GameEditor'], function($,GameEditor){
        $(document).ready(function(){
            GameEditor.initialize();
        });
    });
});
