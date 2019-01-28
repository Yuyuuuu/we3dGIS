/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 350,
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
        if (!window.widgetPointQy) {
            toastr.warning('请先加载企业点分布模块');
            return [];
        }
        return widgetPointQy.arrdata;
    },
    centerAt: function (id) { 
        widgetPointQy.centerAt(id);
    },
    //打开详情
    showXQ: function (id) {
        widgetPointQy.showXQ(id); 
    },
    queryData: function (params) { 
        return widgetPointQy.queryData(params);
    }





}));

