//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        resources: [
            'view.css',
        ],
        //直接添加到index
        view: {
            type: "append",
            url: 'view.html',
            parent: 'body'
        },
    },
    create: function () {
        var inhtml = '<div id="centerDivEx" style="position:absolute;right:0px;top:0px;border:1px solid #ccc;top: 0px;bottom: 0px;width:50%;overflow: hidden;">'
            + '<div id="cesiumContainerEx" style="height:100%;width:100%;overflow: hidden;"></div>'
            + '</div>';
        $("body").append(inhtml);
         
        var configdata = this.viewer.mars.getConfig();
        configdata.controls = [];

        this.viewerEx = mars3d.createMap({
            id: 'cesiumContainerEx',
            data: configdata,
            "homeButton": false,
            "geocoder": false,
            "sceneModePicker": false,
            "navigationHelpButton": false,
            "vrButton": false,
            "fullscreenButton": false,
            "baseLayerPicker": true,
            success: function (_viewer, gisdata, jsondata) {//地图成功加载完成后执行

            }
        });

        var that = this;
        this.viewer.scene.morphComplete.addEventListener(function (event) {//切换场景前事件 
            if (that.viewer.scene.mode === Cesium.SceneMode.SCENE2D) { 
                that.viewerEx.scene.screenSpaceCameraController.enableTilt = false;
            }
            else {  
                that.viewerEx.scene.screenSpaceCameraController.enableTilt = true;
            }
        });


    },
    typeFP: false,//true:垂直，false水平
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        var that = this;

        if (this.config && this.config.style) {
            $(".mapCompareBar").addClass(this.config.style);
        }

        $("#btn_mapCompare_sp").click(function () {
            that.typeFP = false;
            $("#centerDiv").css({
                height: "100%",
                width: "50%"
            });
            $("#centerDivEx").css({
                top: "0px",
                bottom: "0px",
                right: "0px",
                height: "100%",
                width: "50%"
            });
            that.invalidateSize();
        });
        $("#btn_mapCompare_cz").click(function () {
            that.typeFP = true;
            $("#centerDiv").css({
                height: "50%",
                width: "100%"
            });
            $("#centerDivEx").css({
                top: "50%",
                bottom: "0px",
                right: "0px",
                height: "50%",
                width: "100%"
            });
            that.invalidateSize();
        });

        $("#btn_mapCompare_close").click(function () {
            that.disableBase();
        });
    },
    viewerEx: null,
    //激活插件
    activate: function () {
        if (this.typeFP) {
            $("#centerDiv").css({
                position: "absolute",
                height: "50%",
                width: "100%"
            });
        } else {
            $("#centerDiv").css({
                position: "absolute",
                height: "100%",
                width: "50%"
            }); 
        }



        $("#centerDivEx").show();
        this.invalidateSize();

        this.viewer.camera.changed.addEventListener(this._map_extentChangeHandler, this);
        this.viewer.camera.percentageChanged = 0.01;

        this.viewerEx.camera.changed.addEventListener(this._mapEx_extentChangeHandler, this);
        this.viewerEx.camera.percentageChanged = 0.01;

        this._map_extentChangeHandler();
    },
    updateLayerVisible: function (cfg, visible) {
        if (!this.isActivate) return;

        var layersCfg = this.viewerEx.gisdata.config.operationallayers;
        if (layersCfg && layersCfg.length > 0) {
            for (var i = 0; i < layersCfg.length; i++) {
                var item = layersCfg[i];
                if (item.id == cfg.id && item.pid == cfg.pid && item.name == cfg.name) {
                    if (item._layer)
                        item._layer.setVisible(visible);
                    break;
                }
            }
        }

    },
    //释放插件
    disable: function () {
        this.viewer.camera.changed.removeEventListener(this._map_extentChangeHandler, this);
        this.viewerEx.camera.changed.removeEventListener(this._mapEx_extentChangeHandler, this);

        ////this.viewerEx.mars.destroy();
        ////this.viewerEx.destroy();
        ////this.viewerEx = null; 
        ////$("#centerDivEx").remove();
        ////$("#btnMapComType").remove();

        $("#centerDivEx").hide();
        $("#centerDiv").css({
            position: "",
            height: "100%",
            width: "100%"
        });
        this.invalidateSize();
    },
    invalidateSize: function () {

    },
    _map_extentChangeHandler: function (e) {
        this.viewerEx.camera.changed.removeEventListener(this._mapEx_extentChangeHandler, this);
        this.updateView(this.viewer, this.viewerEx);
        this.viewerEx.camera.changed.addEventListener(this._mapEx_extentChangeHandler, this);
    },
    _mapEx_extentChangeHandler: function (e) {
        this.viewer.camera.changed.removeEventListener(this._map_extentChangeHandler, this);
        this.updateView(this.viewerEx, this.viewer);
        this.viewer.camera.changed.addEventListener(this._map_extentChangeHandler, this);
    },
    //“变化屏”viewerChange变化，将“被更新屏”viewerUpdate同步更新
    updateView: function (viewerChange, viewerUpdate) {

        //if (viewerUpdate.scene.mode === Cesium.SceneMode.SCENE2D && viewerChange.scene.mode !== Cesium.SceneMode.SCENE2D) {
        //    //被更新屏”是二维，并且“变化屏”不是二维时
        //    var point = mars3d.point.getCenter(viewerChange);
        //    //console.log(JSON.stringify(point));

        //    viewerUpdate.scene.camera.lookAt(Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z),
        //        new Cesium.Cartesian3(0.0, 0.0, point.cameraZ));
        //}
        //else if (viewerUpdate.scene.mode !== Cesium.SceneMode.SCENE2D && viewerChange.scene.mode === Cesium.SceneMode.SCENE2D) {
        //    //“变化屏”是二维时 ,并且“被更新屏”不是二维 

        //////[该部分无法解决，暂时关闭sceneModePicker，不能二三维联动]
                
        //}
        //else {
            var point = mars3d.point.getCameraView(viewerChange);
            viewerUpdate.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z),
                orientation: {
                    heading: Cesium.Math.toRadians(point.heading),
                    pitch: Cesium.Math.toRadians(point.pitch),
                    roll: Cesium.Math.toRadians(point.roll)
                }
            });
        //}


    }



}));