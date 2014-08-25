/**
 * Created by Pablo Henrick Diniz on 13/08/14.
 */

function CanvasList(){}
$(document).ready(function(){
    CanvasList.canvas = {
        0:new Canvas('layer1'),
        1:new Canvas('layer2'),
        2:new Canvas('layer3'),
        3:new Canvas('layer4'),
        4:new Canvas('layer5')
    };
});

CanvasList.layer1 = 0;
CanvasList.layer2 = 1;
CanvasList.layer3 = 2;
CanvasList.layer4 = 3;
CanvasList.layer5 = 4;