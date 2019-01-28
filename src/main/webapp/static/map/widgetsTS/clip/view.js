var thisWidget;

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;

    if (thisWidget.config && thisWidget.config.style) {//适应不同样式
        $("body").addClass(thisWidget.config.style);
    }

    $("#chkIsEditng").change(function () {//鼠标拖拽
        var val = $(this).is(':checked');

        thisWidget.setEditEnable(val);
    });

    $("#txtHeight").change(function () {
        var val = Number( $(this).val());

        thisWidget.updateHeight(val);
    });

    
    $("#btnClipping").click(function () {
        thisWidget.createClippingPlane();
    });

    $("#btnClear").click(function () {
        thisWidget.clearClippingPlane();
    });
    
}

function showHeight(val) {
    $("#txtHeight").val(val);
}