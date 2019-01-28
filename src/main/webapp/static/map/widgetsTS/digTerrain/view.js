var thisWidget;

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;

    if (thisWidget.config && thisWidget.config.style) {//适应不同样式
        $("body").addClass(thisWidget.config.style);
    }

  
    $("#btnClipping").click(function () {
        thisWidget.createClippingPlane();
    });

    $("#btnClear").click(function () {
        thisWidget.clearClippingPlane();
    });
    
}

 