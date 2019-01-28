var thisWidget;

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;

    if (thisWidget.config && thisWidget.config.style) {//适应不同样式
        $("body").addClass(thisWidget.config.style);
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.getElementById('echartsView1'), 'dark');
    myChart1.setOption(getOption1());

    // 基于准备好的dom，初始化echarts实例
    var myChart2 = echarts.init(document.getElementById('echartsView2'), 'dark');
    myChart2.setOption(getOption2());


    $(window).resize(function () {
        myChart1.resize();
        myChart2.resize();
    });
}

function getOption1() {
    // 企业总数
    var totalCount = thisWidget.getAllCount();

    //统计计算：按类型统计企业数量
    var arrObj = thisWidget.getArrForTypeCount();

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>共{c}个&nbsp;({d}%)'
        },
        title: [{
            text: '企业总数',
            left: '49%',
            top: '40%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
                color: '#eeeeee',
                fontWeight: 'normal',
                fontSize: 17
            }
        }, {
            text: totalCount,
            left: '49%',
            top: '55%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
                color: '#ffffff',
                fontWeight: 'normal',
                fontSize: 30
            }
        }],
        series: [{
            hoverAnimation: false, //设置饼图默认的展开样式
            radius: ["60%", "80%"],
            name: 'pie',
            type: 'pie',
            selectedMode: 'single',
            selectedOffset: 16, //选中是扇区偏移量
            clockwise: true,
            startAngle: 90,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 3,
                    borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 5,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
            },
            data: arrObj
        }]
    };

    return option;
}

function getOption2(arrdata) {

    //统计计算：按年份统计企业总产值、利润、纳税额
    var arrObj = thisWidget.getArrForYearJJ();


    var arrNF = [];    //x轴(年份)
    var arrZCZ = [];   //总产值
    var arrLY = [];    //利润
    var arrNSE = [];   //纳税额

    var arrZCZ_SD = [0];
    var arrLY_SD = [0];
    var arrNSE_SD = [0];
    for (var i = 0; i < arrObj.length; i++) {
        var item = arrObj[i];

        item.ZCZ = Number(item.ZCZ);
        item.LY = Number(item.LY);
        item.NSE = Number(item.NSE);

        arrNF.push(item.NF + "年");
        arrZCZ.push(item.ZCZ);
        arrLY.push(item.LY);
        arrNSE.push(item.NSE);

        //计算同比增长率
        if (i > 0) {
            var lastItem = arrObj[i - 1];
            if (item.ZCZ != 0)
                arrZCZ_SD.push(Math.round((item.ZCZ - lastItem.ZCZ) * 100 / lastItem.ZCZ));
            else
                arrZCZ_SD.push(0);

            if (item.LY != 0)
                arrLY_SD.push(Math.round((item.LY - lastItem.LY) * 100 / lastItem.LY));
            else
                arrLY_SD.push(0);

            if (item.NSE != 0)
                arrNSE_SD.push(Math.round((item.NSE - lastItem.NSE) * 100 / lastItem.NSE));
            else
                arrNSE_SD.push(0);
        }
    }


    var option = {
        title: {
            text: "全区企业年度统计",
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            position: function (point, params, dom, rect, size) {
                return ["10%", "10%"];
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
                        //else if (item.value < 10000) {
                        //    inhtml += "<label style='color:" + item.color + ";'>" + item.value + "</label>&nbsp;万元";
                        //}
                    else {
                        var val = item.value;//Math.round(item.value / 1000) / 10;
                        inhtml += "<label style='color:" + item.color + ";'>" + val + "</label>&nbsp;亿元";
                    }


                    if (item.dataIndex > 0) {
                        var value = 100;
                        if (item.seriesName == "总产值")
                            value = arrZCZ_SD[item.dataIndex];
                        else if (item.seriesName == "利润")
                            value = arrLY_SD[item.dataIndex];
                        else if (item.seriesName == "纳税额")
                            value = arrNSE_SD[item.dataIndex];
                        inhtml += "，&nbsp;同比增长<label style='color:" + item.color + ";'>" + value + "</label>%<br />";
                    }
                    else {
                        inhtml += "<br />";
                    }
                }
                return inhtml;
            }
        },
        toolbox: {
            top: 10,
            left: 10,
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
            }
        },
        legend: {
            top: 30,
            right: 0,
            orient: "vertical",
            data: ['总产值', '利润', '纳税额']
        },
        xAxis: {
            data: arrNF,
            axisLine: {
                show: false,
                //lineStyle: { color: '#2e2e4b', }
            },
            //axisLabel: {
            //    textStyle: { color: '#92a9de', },//x轴文字颜色
            //    fontSize: 15,
            //    interval: 0,
            //    rotate: 30
            //},
        },
        yAxis: {
            axisLabel: {
                rotate: 60
            }
        },
        series: [
            {
                name: '总产值',
                type: 'bar',
                data: arrZCZ
            },
            {
                name: '利润',
                type: 'bar',
                data: arrLY
            },
            {
                name: '纳税额',
                type: 'bar',
                data: arrNSE
            }
        ]
    };

    return option;

}

