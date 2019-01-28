var thisWidget;

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;

    if (thisWidget.config && thisWidget.config.style) {//适应不同样式
        $("body").addClass(thisWidget.config.style);
    }


    var height = ($(window).height() - 30);
    $("#echartsView1").height(height * 0.4);
    $("#echartsView2").height(height * 0.6);


    var myChart1 = echarts.init(document.getElementById('echartsView1'), 'dark');
    var myChart2 = echarts.init(document.getElementById('echartsView2'), 'dark');

    $(window).resize(function () {
        myChart1.resize();
        myChart2.resize();
    });

    var index = -1;
    $("#btn_zcz").click(function () {
        index = 0;
        $(".active").removeClass('active');
        $(this).addClass('active');

        myChart1.setOption(getOption1("ZCZ", "总产值"));
        myChart2.setOption(getOption2("ZCZ", "总产值"));
    });
    $("#btn_ly").click(function () {
        index = 1;
        $(".active").removeClass('active');
        $(this).addClass('active');

        myChart1.setOption(getOption1("LY", "利润"));
        myChart2.setOption(getOption2("LY", "利润"));
    });
    $("#btn_nse").click(function () {
        index = 2;
        $(".active").removeClass('active');
        $(this).addClass('active');

        myChart1.setOption(getOption1("NSE", "纳税额"));
        myChart2.setOption(getOption2("NSE", "纳税额"));
    });

    //默认选择第1个
    $("#btn_zcz").click();


    timePlay.init(function () {
        index = (index + 1) % 3;
        if (index == 0)
            $("#btn_zcz").click();
        else if (index == 1)
            $("#btn_ly").click();
        else if (index == 2)
            $("#btn_nse").click();
    });
}

//定时轮播
var timePlay = {
    interval: -1,
    fun: null,
    init: function (fun) {
        this.fun = fun;

        var that = this;
        $("body").on({
            mouseover: function (e) {
                that.stop();
            },
            mouseout: function (e) {
                that.start();
            }
        });
    },
    start: function (fun) {
        var that = this;
        this.interval = setInterval(function () {
            that.fun();
        }, 8000);
    },
    stop: function () {
        if (this.interval != -1)
            clearInterval(this.interval);
        this.interval = -1;
    }
};





function getOption1(column, name) {
    //统计计算：按“行业类型”统计“企业总产值 利润 纳税额”
    var arrObj = thisWidget.getArrForTypeJJ(column);

    var option = {
        title: {
            text: "行业分类" + name + "统计图",
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (item) {
                var inhtml = item.marker + item.name + "&nbsp;" + item.seriesName + "<br/>";
                if (item.value < 10000) {
                    inhtml += "<label style='color:" + item.color + ";'>" + item.value + "</label>&nbsp;万元&nbsp;(" + item.percent + "%)";
                }
                else {
                    var val = Math.round(item.value / 1000) / 10;
                    inhtml += "<label style='color:" + item.color + ";'>" + val + "</label>&nbsp;亿元&nbsp;(" + item.percent + "%)";
                }
                return inhtml;
            }
        },
        toolbox: {
            show: true,
            feature: {
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                }
            }
        },
        calculable: true,
        series: [{
            name: name,
            type: 'pie',
            radius: [20, 85],
            center: ['50%', '50%'],
            minAngle: 10,
            roseType: 'area', //radius  area
            data: arrObj
        }]
    };
    return option;
}



function getOption2(column, name) {
    //排序计算：按“各企业”的指定“企业总产值 利润 纳税额”进行排序
    var arrObj = thisWidget.getArrForSortQy(column);

    var arrNames = [];
    var arrValues = [];
    for (var index = 0; index < arrObj.length; index++) {
        var item = arrObj[index];

        arrNames.push((arrObj.length - index) + "." + item.name);
        arrValues.push(item.value);
    }


    var option = {
        title: {
            text: "企业" + name + "排名",
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params) {
                var inhtml = "";
                for (var i in params) {
                    var item = params[i];
                    if (item == null || item.value == null) continue;

                    inhtml += item.marker + item.seriesName + "&nbsp;";

                    if (item.value == 0) {
                        inhtml += "无数据<br />";
                        continue;
                    }
                    else if (item.value < 10000) {
                        inhtml += "<label style='color:" + item.color + ";'>" + item.value + "</label>&nbsp;万元";
                    }
                    else {
                        var val = Math.round(item.value / 1000) / 10;
                        inhtml += "<label style='color:" + item.color + ";'>" + val + "</label>&nbsp;亿元";
                    }
                }
                return inhtml;

            },
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: 30,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: arrNames
        },
        dataZoom: [
            {
                type: 'inside',
                start: Math.ceil((arrObj.length - 10) * 100 / arrObj.length),   //数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
                end: 100,    //数据窗口范围的结束百分比。范围是：0 ~ 100。
                yAxisIndex: 0,
            },
            {
                type: 'slider',
                yAxisIndex: 0,
                width: 10,
                height: '65%',
                right: 0
            }
        ],
        series: [
            {
                name: name,
                type: 'bar',
                data: arrValues
            },
        ]
    };
    return option;
}