/**
 * Created by Pablo Henrick Diniz on 29/09/14.
 */
/****************** STAIRS DEMO *****************/
$(function () {
    var worldName = "stairs";
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

        var mass = parseFloat(tabDiv.find("input[name=mass]").val());
        if (mass < 0.001) {
            mass = 0.001;
            tabDiv.find("input[name=mass]").val("0.001");
        }
        var x0 = parseFloat(tabDiv.find("input[name=x0]").val());
        var y0 = parseFloat(tabDiv.find("input[name=y0]").val());
        var vx0 = parseFloat(tabDiv.find("input[name=vx0]").val());
        var vy0 = parseFloat(tabDiv.find("input[name=vy0]").val());
        var vAng0 = parseFloat(tabDiv.find("input[name=vAng0]").val());
        var theta0 = parseFloat(tabDiv.find("input[name=theta0]").val());
        var friction = parseFloat(tabDiv.find("input[name=friction]").val());
        var tStop = parseFloat(tabDiv.find("input[name=tStop]").val());

        var world = new World();
        world.setFriction(friction);
        // cube
        var moi = mass / 12 * (4 + 4);
        var body = new Body([
            [1, -1],
            [-1, -1],
            [-1, 1],
            [1, 1]
        ],
            [x0, y0], theta0, 1 / mass, 1 / moi, [vx0, vy0], vAng0);
        body.addForce([0, -mass * 9.81]);
        world.addBody(body);
        // stair steps
        for (var i = -1; i < 16; i += 2) {
            var stairStep = new Body([
                [10, -1],
                [-10, -1],
                [-10, 1],
                [10, 1]
            ],
                [-3 - i, -2 + i], 0, 0, 0, [0, 0], 0);
            world.addBody(stairStep);
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