
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {

    },
    //初始化[仅执行1次]
    create: function () {
        this.bindEvent();

        this.layerWork = viewer.mars.getLayer(203011, 'id');

        var url = this.config.data || "../data/geojson/changfang_dth.json";
        this.addPolygon(url, '房屋单体化');

        //单击事件
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (event) {
            var position = event.position;
            var pickedObject = viewer.scene.pick(position);
            if (pickedObject && Cesium.defined(pickedObject.id)) {
                var entity = pickedObject.id;
                if (entity.isDTH) {
                    //单击单体化对象后 
                    var data = entity.properties; //对象的属性

                    //haoutil.msg('您单击了：' + data.name);
                    //layer.open({
                    //    type: 2,
                    //    title: '选择数据',
                    //    fix: true,
                    //    shadeClose: false,
                    //    maxmin: true,
                    //    area: ["80%", "80%"],
                    //    content: "https://www.baidu.com/?id=" + data.id,
                    //    skin: "layer-mars-dialog animation-scale-up",
                    //    success: function (layero) {

                    //    }
                    //});

                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //打开激活
    activate: function () {
        viewer.mars.centerAt({ "y": 40.412079, "x": 115.458642, "z": 937.7, "heading": 193, "pitch": -53.1, "roll": 359.9 });

        if (this.layerWork) {
            this.lastVisible = this.layerWork._visible;
            if (!this.lastVisible)
                this.layerWork.setVisible(true);
            //this.layerWork.centerAt();
        }

        this.setVisible(true);
    },
    //关闭释放
    disable: function () {

        if (this.layerWork && !this.lastVisible)
            this.layerWork.setVisible(false);
        this.setVisible(false);
    },
    layers: {},
    setVisible: function (value) {
        for (var key in this.layers) {
            this.layers[key].setVisible(value);
        }
    },

    addPolygon: function (json, name) {
        var that = this;

        //添加叠加的单体化数据 
        $.ajax({
            type: "get",
            dataType: "json",
            url: json,
            success: function (featureCollection) {
                var dataSource = Cesium.GeoJsonDataSource.load(featureCollection);
                dataSource.then(function (dataSource) {
                    var entities = dataSource.entities.values;
                    var arrEntity = that.showResult(entities);

                    //添加到图层控制 
                    that.layers[name] = bindToLayerControl({
                        "pid": 20,
                        name: name,
                        visible: true,
                        entities: arrEntity,
                        onAdd: function () {//显示回调  
                            $(this.entities).each(function (i, item) {
                                that.viewer.entities.add(item);
                            });
                        },
                        onRemove: function () {//隐藏回调 
                            $(this.entities).each(function (i, item) {
                                that.viewer.entities.remove(item);
                            });
                        },
                        onCenterAt: function (duration) {//定位回调 
                            that.viewer.flyTo(this.entities, { duration: duration });
                        },
                    });

                }).otherwise(function (error) {
                    if (!error) error = '未知错误';
                    console.log('arcDynamicLayer错误:' + error);
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                haoutil.alert("Json文件" + json + "加载失败！");
            }

        }); 
    },

    showResult: function (entities) {
        var arrEntitie = [];

        for (var i = 0; i < entities.length; i++) {
            var entityOld = entities[i];

            var hierarchy = entityOld.polygon.hierarchy;

            var inhtml = "名称：" + entityOld.properties.name;

            var entitie = viewer.entities.add({
                properties: entityOld.properties,
                description: entityOld.description,
                polygon: {
                    perPositionHeight: false,
                    classificationType: Cesium.ClassificationType.BOTH,
                    hierarchy: hierarchy,
                    material: new Cesium.Color.fromCssColorString("#ffffff").withAlpha(0.01)
                },
                isDTH: true, //标识，用于事件中判断
                popup: {
                    html: inhtml,
                    anchor: [0, -12],//左右、上下的偏移像素值。
                },
            });
            arrEntitie.push(entitie);
        }

        return arrEntitie;
    },
    bindEvent: function () {
        var highlighted_hierarchy;
        var highlightedEntity = viewer.entities.add({
            isDTH: true,
            polygon: {
                perPositionHeight: false,
                classificationType: Cesium.ClassificationType.BOTH,
                material: new Cesium.Color.fromCssColorString("#ffff00").withAlpha(0.6),
                hierarchy: new Cesium.CallbackProperty(function (time) {
                    return highlighted_hierarchy;
                }, false)
            }
        });


        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (event) {
            if (Cesium.defined(highlightedEntity)) {
                highlightedEntity.polygon.show = false;
            }
            // Pick a new feature
            var position = event.endPosition;
            var pickedObject = viewer.scene.pick(position);
            if (pickedObject && Cesium.defined(pickedObject.id)) {
                var entity = pickedObject.id;
                if (entity && entity.isDTH) {
                    highlighted_hierarchy = entity.polygon.hierarchy.getValue(); 
                    highlightedEntity.polygon.show = true;

                    highlightedEntity.properties = entity.properties;
                    highlightedEntity.tooltip = entity.tooltip ? entity.tooltip : null;
                    highlightedEntity.popup = entity.popup ? entity.popup : null;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    },




}));

