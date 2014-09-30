/**
 * Created by Pablo Henrick Diniz on 29/09/14.
 */
/****************** BOXES DEMO *****************/
$(function () {
    var worldName = "boxes";
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

        var mass = 1;
        var friction = parseFloat(tabDiv.find("input[name=friction]").val());
        var tStop = parseFloat(tabDiv.find("input[name=tStop]").val());

        var world = new World();
        world.setFriction(friction);
        var groundPlane = new Body([
            [10, -2],
            [-10, -2],
            [-10, 2],
            [10, 2]
        ],
            [0, -2], 0, 0, 0, [0, 0], 0);
        world.addBody(groundPlane);
        for (var x = -5; x <= 5; x += 2.5) {
            for (var y = 4; y <= 32; y += 2.5) {
                var w = 1.3 + 0.5 * Math.random();
                var moi = mass / 12 * (w * w + w * w);
                var box = new Body([
                    [w / 2, -w / 2],
                    [-w / 2, -w / 2],
                    [-w / 2, w / 2],
                    [w / 2, w / 2]
                ],
                    [x, y], Math.random(), 1 / mass, 1 / moi, [0, 0], 0);
                box.addForce([0, -9.81 * mass]);
                world.addBody(box);
            }
        }

        drawWorld(plot, world);

        var tStepAcc = 0;
        var nSteps = 0;

        function stepAndDraw() {
            world.step();
            drawWorld(plot, world);
        }

        var t = 0;
        nStepsForDtAvg = Math.ceil(0.2 / world.dt);
        var t1, t2, dtAvg = 0;
        var timeP = tabDiv.find("p#time");

        function step() {
            if (nSteps == 0) {
                t1 = new Date();
            }

            if (t >= tStop || simulationRunning == false) {
                startStopButton.html("Start");
                simulationRunning = false;
                return;
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