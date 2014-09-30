/**
 * Created by Pablo Henrick Diniz on 29/09/14.
 */
$(function () {
    $("#anchorStairs a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $("#anchorDomino a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $("#anchorBoxes a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $("#domino,#boxes").removeClass("active");
    $("#anchorStairs a").tab('show');
});
