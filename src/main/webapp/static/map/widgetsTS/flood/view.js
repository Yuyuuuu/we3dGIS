var thisWidget;

var currentHeight = 0;
var maxValue = 0;
var minValue = 0;
var int = null;


//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;

    if (thisWidget.config && thisWidget.config.style) {
        $("body").addClass(thisWidget.config.style);
    }


    $("#btnDraw").click(function () {
        thisWidget.drawPolygon();
    });

    $("#begin").click(function () {
        minValue = Number($("#minHeight").val());
        maxValue = Number($("#maxHeight").val());
        currentHeight = minValue;

        var result = thisWidget.startFx(currentHeight);
        if (result) {
            $("#paramView").hide();
            $("#resultView").show();
            int = self.setInterval(flood, 100);
        }
    });
    $("#clear").click(function () {
        thisWidget.clear();
        stopFX();
    });
}


window.flood = function () {
    if (currentHeight > maxValue) {
        stopFX();
        return;
    }
    thisWidget.updateHeight(currentHeight);
    currentHeight += (Number(document.getElementById("speed").value)) / 10;

    $("#msg").html('当前高度：' + currentHeight.toFixed(1));
};

function stopFX() {
    self.clearInterval(int);

    $("#resultView").hide();
    $("#paramView").show();
    $("#msg").html('');
}


function updateHeightForDraw(minDraw, maxDraw) {

    //最小值
    minValue = Number($("#minHeight").val());
    if (isNaN(minValue) || minValue == 0)
        $("#minHeight").val(minDraw.toFixed(1));
    else if (minDraw < minValue)
        $("#minHeight").val(minDraw.toFixed(1));


    //最大值
    maxValue = Number($("#maxHeight").val());
    if (isNaN(maxValue) || maxValue == 0)
        $("#maxHeight").val((maxDraw*1.1).toFixed(1));
    else if (maxDraw > maxValue)
        $("#maxHeight").val(maxDraw.toFixed(1));
}