/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "divwindow",
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
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {

        $("#qyVideo").attr('src', this.config.filename);
    },
    //打开激活
    activate: function () { 
        $(".layer-mars-dialog .layui-layer-title").css({
            "background": "rgb(0, 0, 0)",
            "border-color": "#000000",
            //"height": 0
        });
    },
    //关闭释放
    disable: function () {


    }, 
    getData: function () {
        return this.config.filename;
    },
    shoData: function (filename) {
        this.config.filename = filename;
        $("#qyVideo").attr('src', this.config.filename);
    },



}));

