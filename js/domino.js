/**
 * Created by Pablo Henrick Diniz on 29/09/14.
 */
/****************** DOMINO DEMO *****************/
$(function () {
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

        var mass = 1;
        var dominoSpacing = parseFloat(tabDiv.find("input[name=dominoSpacing]").val());
        var usrVAng0 = parseFloat(tabDiv.find("input[name=vAng0]").val());
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
        var leftSidePlane = new Body([
            [2, -10],
            [-2, -10],
            [-2, 10],
            [2, 10]
        ],
            [-12, 10], 0, 0, 0, [0, 0], 0);
        world.addBody(leftSidePlane);
        var rightSidePlane = new Body([
            [2, -10],
            [-2, -10],
            [-2, 10],
            [2, 10]
        ],
            [12, 10], 0, 0, 0, [0, 0], 0);
        world.addBody(rightSidePlane);
        var secondFloorPlane = new Body([
            [10, -1],
            [-10, -1],
            [-10, 1],
            [10, 1]
        ],
            [-5, 7.5], 0, 0, 0, [0, 0], 0);
        world.addBody(secondFloorPlane);
        console.log("mass: " + mass);
        var W = 0.4, H = 4, i = 0;
        for (var x = -7.5; x <= 5; x += dominoSpacing) {
            for (var y = 10.5; y > 0; y -= 8.5) {
                var vAng0;
                if (i == 0) {
                    vAng0 = usrVAng0;
                } else {
                    vAng0 = 0;
                }
                var moi = mass / 12 * (H * H + W * W);
                var domino = new Body([
                    [W / 2, -H / 2],
                    [-W / 2, -H / 2],
                    [-W / 2, H / 2],
                    [W / 2, H / 2]
                ],
                    [x, y], 0, 1 / mass, 1 / moi, [0, 0], vAng0);
                domino.addForce([0, -9.81 * mass]);
                world.addBody(domino);
                i++;
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