/**
 * Created by Pablo Henrick Diniz on 29/09/14.
 */
/****************** DOMINO DEMO *****************/
$(function () {
    var canvas = new Canvas('canvas');
    var worldName = "domino";
    var tabDiv = $("div#" + worldName);
    var plot = $.plot("div#" + worldName + " div.flotPlot", [
        []
    ],
        {xaxis: {min: -10, max: 10}, yaxis: {min: -2, max: 15}});
    var simulationRunning = false;
    var startStopButton = tabDiv.find("[name=startStopButton]");
    startStopButton.click(function () {
        if (simulationRunning == false) {
            simulationRunning = true;
            startStopButton.html("Stop");
        } else {
            simulationRunning = false;
            return;
        }

        var world = new World();
        world.setFriction(0.2);
        var shapeA = new Rect([0, -2],20,4);
        var shapeB = new Rect([-12, 10],4,20);
        var shapeC = new Rect([12, 10],4,20);
        var shapeD = new Rect([-5, 7.5],20,2);

        var groundPlane = new Body(shapeA,0, [0, 0], 0);
        var leftSidePlane = new Body(shapeB, 0, [0, 0], 0);
        var rightSidePlane = new Body(shapeC,0, [0, 0], 0);
        var secondFloorPlane = new Body(shapeD,0, [0, 0], 0);
        world.addBody(groundPlane);
        world.addBody(leftSidePlane);
        world.addBody(secondFloorPlane);
        world.addBody(rightSidePlane);

        var W=0.4, H=4, i=0;

        for (var x = -7.5; x <= 5; x+= 1.5) {
            for (var y=10.5; y>0; y-=8.5) {
                var shape = new Rect([x, y],W,H);
                var domino = new Body(shape,5,  [0,0], 0);
                domino.addForce([0, -9.81 * 5]);
                if(x == -7.5 && y == 10.5){
                    domino.vAng = 1;
                }
                world.addBody(domino);
                i++;
            }
        }

        canvas.drawWorld(world);
        drawWorld(plot,world);

        var tStepAcc = 0;
        var nSteps = 0;

        function stepAndDraw() {
            world.step();
            canvas.drawWorld(world);
            drawWorld(plot,world);
        }

        function drawWorld(plotObject, world) {
            var bodiesVertices = [];
            for (var i=0; i<world.bodies.length; i++) {
                var bodyVerts = world.bodies[i].getVerticesInWorldCoords();
                bodyVerts.push(bodyVerts[0]);
                bodiesVertices.push(bodyVerts);
            }
            plotObject.setData(bodiesVertices);
            plotObject.draw();
        }


        var t = 0;
        nStepsForDtAvg = Math.ceil(0.2 / world.dt);
        var t1, t2, dtAvg = 0;
        var timeP = tabDiv.find("p#time");

        function step() {
            if (nSteps == 0) {
                t1 = new Date();
            }

            setTimeout(step, world.dt * 1000);
            stepAndDraw();

            t += world.dt;

            if (nSteps == nStepsForDtAvg) {
                var t2 = new Date();
                dtAvg = (t2 - t1) / nSteps;
                nSteps = 0;
            } else {
                nSteps++;
            }
            timeP.html(t.toPrecision(3) + "s (" + dtAvg.toPrecision(3) + "ms/frame)");
        }

        step();
    });
});