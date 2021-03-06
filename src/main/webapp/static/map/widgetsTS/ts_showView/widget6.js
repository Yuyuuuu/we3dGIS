/* 2017-12-4 15:31:55 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view6.html",
            windowOptions: {
                width: 500,
                height: 380,
            }
        },
    },
    layerWork: null,
    //初始化[仅执行1次]
    create: function () {
 
        var item = {
            "name": "乡镇",
            "type": "arcgis_dynamic",
            "url": "http://arc.marsgis.cn/arcgis/rest/services/mars/hefei/MapServer", 
            "layers": "20",
            "center": { "y": 31.814176, "x": 117.225362, "z": 5105.3, "heading": 359.2, "pitch": -83.1, "roll": 360 },
            "popup": "all"
        };

        this.layerWork = mars3d.layer.createLayer(item, this.viewer);
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        this.layerWork.setVisible(true);
        this.layerWork.centerAt();
    },
    //关闭释放
    disable: function () {
        this.layerWork.setVisible(false);
    },

 



}));