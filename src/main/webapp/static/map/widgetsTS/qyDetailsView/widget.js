/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 250,
                height: 300
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {


    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;


    },
    getData: function () {
        var item = this.config.dataQy;


        //测试数据
        if (item == null) {
            item = { "ID": "B0FFHH68OO", "NAME": "合肥火星科技有限公司", "JC": "火星科技", "LX": "信息技术", "JD": 117.222121, "WD": 31.832724, "DZ": "安徽省合肥市蜀山区望江西路129号", "LXDH": "0551-67191191" };
        }
        item.ID = "B0FFHH68OO";
        item.QYZP = 5;
        item.CPZP = 4;
        item.QYJJ = "有";
        item.JJ =
            [
                { "NF": "2015", "ZCZ": 6000 + haoutil.math.random(1000, 3000), "LY": 1000 + haoutil.math.random(100, 1000), "NSE": 1000 + haoutil.math.random(100, 1000) },
                { "NF": "2016", "ZCZ": 10000 + haoutil.math.random(2000, 3000), "LY": 3000 + haoutil.math.random(100, 1000), "NSE": 3000 + haoutil.math.random(100, 1000) },
                { "NF": "2017", "ZCZ": 25000 + haoutil.math.random(3000, 5000), "LY": 5000 + haoutil.math.random(100, 1000), "NSE": 5000 + haoutil.math.random(100, 1000) }
            ];
        //测试数据


        return item;
    },
    //打开视频监控
    showSPJK: function () {
        var item = this.config.dataQy;
        if (item === null) return;

        var filename = '../data/video/jk.mp4';

        var jkWidgetUri = '/we3dGIS/static/map/widgetsTS/qyVideo/widget.js';
        var roamingJK = mars3d.widget.getClass(jkWidgetUri);
        if (roamingJK && roamingJK.isActivate) {
            roamingJK.shoData(filename);
        }
        else {
            mars3d.widget.activate({
                uri: jkWidgetUri, 
                filename: filename
            });
        }

    },



}));

