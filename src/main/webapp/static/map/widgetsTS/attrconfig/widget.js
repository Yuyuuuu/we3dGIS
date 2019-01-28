/* 2017-12-6 11:11:44 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 250,
                position: {
                    "top": 5,
                    "right": 5,
                    "bottom": 5
                }
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

        this.viewWindow.plotEdit.startEditing({ });
    },
    //激活插件
    activate: function () {
       
    },
    //释放插件
    disable: function () {
        this.viewWindow = null;

    },
    updateAttr2map: function (attr) {
        

    },



}));