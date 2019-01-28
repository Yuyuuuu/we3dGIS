/* 2017-12-4 08:27:25 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 200,
                height: 500
            }
        }
    },
    //初始化[仅执行1次]
    create: function () {

        //this.tileset = new Cesium.Cesium3DTileset({
        //    url: this.url
        //});
        //this.viewer.scene.primitives.add(this.tileset);


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
    //定位
    centerAt: function (nodename, nodesphere) {
        //飞行过去 
        console.log(nodesphere);

        var center = new Cesium.Cartesian3(nodesphere[0], nodesphere[1], nodesphere[2]);
        var sphere = new Cesium.BoundingSphere(center, nodesphere[3]);
        this.viewer.camera.flyToBoundingSphere(sphere, {
            duration: 0.5
        });

        //设置tileset的样式
        if (this.tileset) {
            this.tileset.style = new Cesium.Cesium3DTileStyle({
                color: {
                    conditions: [
                        ["${name} ==='" + nodename + "'", "rgb(255, 255, 255)"],
                        ["true", "rgba(255, 200, 200,0.2)"]
                    ]
                }
            });
        }
    },



}));
