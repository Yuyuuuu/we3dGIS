/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 220,
                height: 200
            }
        },
    },
    //初始化[仅执行1次]
    create: function () { 
        //图层 
        this.layerWork = viewer.mars.getLayer(205087, 'id');//演示裁剪目标图层
    }, 
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        if (this.layerWork) {
            this.lastVisible = this.layerWork._visible;
            if (!this.lastVisible)
                this.layerWork.setVisible(true);
            this.layerWork.centerAt();
        }

    },
    //关闭释放
    disable: function () {       
        this.viewWindow = null;
        if (this.layerWork && !this.lastVisible)
            this.layerWork.setVisible(false);
        this.clearClippingPlane();
    },
    createClippingPlane: function () {
        this.clearClippingPlane();

        //裁剪面
        var clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: [
                new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 1), //水平面
            ],
            edgeWidth: 0.0 
        });
        this.clippingPlanes = clippingPlanes;

        var tileset = this.layerWork.model; //3dtiles模型对象
        tileset.clippingPlanes = clippingPlanes; 

        if (this._enable)
            this.setEditEnable(this._enable);
    },
    updateHeight: function (val) {
        if (this.clippingPlanes == null) return;

        for (var i = 0; i < this.clippingPlanes.length; i++) {
            var plane = this.clippingPlanes.get(i);
            plane.distance = val; 
        } 
    },
    _enable: false,
    setEditEnable: function (enable) { 
        var that = this;

        this._enable = enable;
        if (this.clippingPlanes == null) return;

        if (enable) {
            var scene = this.viewer.scene;
            var targetY = 0.0;
            var selectedPlane;

            //按下鼠标事件
            var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                var pickedObject = scene.pick(movement.position);
                if (Cesium.defined(pickedObject) &&
                    Cesium.defined(pickedObject.id) &&
                    Cesium.defined(pickedObject.id.plane) && pickedObject.id._IsClippingPlanes) {
                    selectedPlane = pickedObject.id.plane;
                    selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
                    selectedPlane.outlineColor = Cesium.Color.WHITE;
                    scene.screenSpaceCameraController.enableInputs = false;
                }
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

            //拖动鼠标事件 
            handler.setInputAction(function (movement) {
                if (Cesium.defined(selectedPlane)) {
                    var deltaY = (movement.startPosition.y - movement.endPosition.y) / 2;
                    targetY += deltaY;
                    
                    var plane = Cesium.Property.getValueOrUndefined(selectedPlane.plane, viewer.clock.currentTime);
                    if (plane)
                        plane.distance = targetY; 
                     
                    that.viewWindow.showHeight(targetY.toFixed(1));
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            //释放鼠标事件 
            handler.setInputAction(function () {
                if (Cesium.defined(selectedPlane)) {
                    selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
                    selectedPlane.outlineColor = Cesium.Color.WHITE;
                    selectedPlane = undefined;
                }
                scene.screenSpaceCameraController.enableInputs = true;
            }, Cesium.ScreenSpaceEventType.LEFT_UP);

            this.handler = handler;


            var tileset = this.layerWork.model; //3dtiles模型对象
            var boundingSphere = tileset.boundingSphere;
            var radius = boundingSphere.radius;

            var arrEntity = [];
            for (var i = 0; i < this.clippingPlanes.length; i++) {
                var plane = this.clippingPlanes.get(i);
                var planeEntity = viewer.entities.add({
                    position: boundingSphere.center,
                    plane: {
                        dimensions: new Cesium.Cartesian2(radius * 1, radius * 1),
                        material: Cesium.Color.WHITE.withAlpha(0.1),
                        plane: new Cesium.CallbackProperty(function (time) {
                            return plane;
                        }, false),
                        outline: true,
                        outlineColor: Cesium.Color.WHITE
                    },
                    _IsClippingPlanes: true
                });
                arrEntity.push(planeEntity);
            }
            this.arrEntity = arrEntity;

        } else {
            if (this.arrEntity) {
                for (var i = 0; i < this.arrEntity.length; i++) {
                    viewer.entities.remove(this.arrEntity[i])
                }
            }
            if (this.handler) {
                this.handler.destroy();
                delete this.handler;
            }   
        }
    },
    clearClippingPlane: function () {  
        var tileset = this.layerWork.model; //3dtiles模型对象
        if (tileset == null) return;

        if (tileset.clippingPlanes) {
            tileset.clippingPlanes.enabled = false;
        }
        if (this.clippingPlanes) {
            this.clippingPlanes.destroy();
            delete this.clippingPlanes;
        }

        if (this.arrEntity) {
            for (var i = 0; i < this.arrEntity.length; i++) {
                viewer.entities.remove(this.arrEntity[i])
            }
        }   
        if (this.handler) {
            this.handler.destroy();
            delete this.handler;
        }       
    }



}));

