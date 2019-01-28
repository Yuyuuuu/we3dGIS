/* 2017-12-4 15:31:23 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 470,
                height: 460
            }
        }
    },
    drawControl: null,
    //初始化[仅执行1次]
    create: function () {
        this.drawControl = new mars3d.Draw(this.viewer, { hasEdit: false });

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {

    },
    //释放插件
    disable: function () {
        this.clearDraw();
        this.clearShowFeature();
    },
    clearDraw: function () {
        this.drawControl.clearDraw();
    },
    drawPolygon: function () {
        this.drawControl.clearDraw();

        this.drawControl.startDraw({
            type: "polygon",
            style: {
                color: "#55ff33",
                opacity: 0.5,
                clampToGround: true
            },
        });
    },
    hasDraw: function () {
        return this.drawControl.hasDraw();
    },
    //查询后全部显示处理
    clearShowFeature: function () {
        if (!this.dataSource) return;

        this.viewer.dataSources.remove(this.dataSource);
        this.dataSource = null;
    },
    query: function (param) {
        var query = L.esri.query({
            url: param.url
        });

        if ((param.where != null && param.where.length > 0)) {
            query.where(param.where);
        }

        var polygon;
        if (param.extenttype == "1") {
            //当前视域内
            var extent = mars3d.point.getExtent(this.viewer);
            query.intersects(L.latLngBounds(L.latLng(extent.ymin, extent.xmin), L.latLng(extent.ymax, extent.xmax)));
        }
        else if (param.extenttype == "2") {
            this.drawControl.stopDraw();

            polygon = this.drawControl.getEntitys()[0]; 
            query.intersects(this.drawControl.toGeoJSON(polygon));
        }

        var that = this;

        query.run(function (error, featureCollection, response) {
            param.end();//回调

            if (error != null && error.code > 0) {
                toastr.error(error.message, '服务访问出错');
                return;
            }
            if (featureCollection == undefined || featureCollection == null || featureCollection.features.length == 0) {
                toastr.info("未找到符合查询条件的要素！")
                return;
            }
            else {
                if (polygon != null) {

                    var polyline = mars3d.draw.attr.polyline.style2Entity({
                        "color": '#55ff33',
                        "width": 3,
                        "opacity": 1,
                        "clampToGround": true
                    });
                    polyline.positions = polygon.polygon.hierarchy.getValue();
                    polyline.positions.push(polyline.positions[0]);

                    that.drawControl.clearDraw();
                    that.drawControl.dataSource.entities.add({
                        polyline: polyline,
                    });
                }

                //剔除有问题数据 
                var featuresOK = [];
                for (i = 0; i < featureCollection.features.length; i++) {
                    var feature = featureCollection.features[i];
                    if (feature == null || feature.geometry == null
                        || feature.geometry.coordinates == null || feature.geometry.coordinates.length == 0)
                        continue;

                    featuresOK.push(feature);
                }
                featureCollection.features = featuresOK;

                var dataSource = Cesium.GeoJsonDataSource.load(featureCollection, {
                    clampToGround: true
                });
                dataSource.then(function (dataSource) {
                    that.showQueryResult(dataSource);
                }).otherwise(function (error) {
                    that.showError("服务出错", error);
                });
            }
        });



    },
    objResultFeature: {},
    showQueryResult: function (dataSource) {
        var that = this;
        this.clearShowFeature();

        this.dataSource = dataSource;
        this.viewer.dataSources.add(dataSource);

        var config = this.viewWindow.selectedLayer; 

        var arrResultData = [];
        var entities = dataSource.entities.values;
        for (var i = 0, len = entities.length; i < len; i++) {
            var entity = entities[i];

            var atrr = entity.properties;

            //样式
            if (!config.symbol || config.symbol == "default") {
                this.setDefSymbol(entity);
            }
            else {
                this.setConfigSymbol(entity, config);
            }

            //popup弹窗
            if (config.columns || config.popup) {
                entity.popup = {
                    html: function (entity) {
                        return that.viewer.mars.popup.getPopupForConfig(config, entity.properties);
                    },
                    anchor: config.popupAnchor || [0, -10],
                };
            }

            atrr.rowID = (i + 1).toString();
            arrResultData.push(atrr);
            this.objResultFeature[atrr.rowID] = entity;
        };

        this.viewWindow.showResult(arrResultData);
    },
    centerAt: function (rowID) {
        var entity = this.objResultFeature[rowID];
        if (entity)
            this.viewer.flyTo(entity);
    },


    //默认symbol
    colorHash: {},
    setDefSymbol: function (entity) {
        if (entity.polygon) {
            var name = entity.properties.OBJECTID;
            var color = this.colorHash[name];
            if (!color) {
                color = Cesium.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: this._opacity
                });
                this.colorHash[name] = color;
            }
            entity.polygon.material = color;
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Cesium.Color.WHITE;
        }
        else if (entity.polyline) {

            var name = entity.properties.OBJECTID;
            var color = this.colorHash[name];
            if (!color) {
                color = Cesium.Color.fromRandom({
                    minimumGreen: 0.75,
                    maximumBlue: 0.75,
                    alpha: this._opacity
                });
                this.colorHash[name] = color;
            }
            entity.polyline.material = color;
            entity.polyline.width = 2;
        }
        else if (entity.billboard) {
            entity.billboard.scale = 0.5;
            entity.billboard.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
            entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
        }
    },
    //外部配置的symbol
    setConfigSymbol: function (entity, config) {
        var symbol = config.symbol;

        var attr = entity.properties;
        var styleOpt = symbol.styleOptions;

        if (symbol.styleField) {//存在多个symbol，按styleField进行分类
            var styleFieldVal = attr[symbol.styleField];
            var styleOptField = symbol.styleFieldOptions[styleFieldVal];
            if (styleOptField != null) {
                styleOpt = clone(styleOpt);
                styleOpt = $.extend(styleOpt, styleOptField);
            }
        }
        styleOpt = styleOpt || {};


        if (entity.polygon) { 
            mars3d.draw.attr.polygon.style2Entity(styleOpt, entity.polygon);

            //加上线宽
            if (styleOpt.outlineWidth && styleOpt.outlineWidth > 1) {
                entity.polygon.outline = false;

                var newopt = {
                    "color": styleOpt.outlineColor,
                    "width": styleOpt.outlineWidth,
                    "opacity": styleOpt.outlineOpacity,
                    "lineType": "solid",
                    "clampToGround": true,
                    "outline": false,
                };
                var polyline = mars3d.draw.attr.polyline.style2Entity(newopt);
                polyline.positions = entity.polygon.hierarchy._value.positions;
                this.dataSource._entityCollection.add({
                    polyline: polyline,
                });
            }

            //是建筑物时
            if (config.buildings) {
                var floor = Number(attr[config.buildings.cloumn] || 1); //层数
                var height = Number(config.buildings.height || 5);//层高

                entity.polygon.extrudedHeight = floor * height;
            }
        }
        else if (entity.polyline) {
            mars3d.draw.attr.polyline.style2Entity(styleOpt, entity.polyline);
        }
        else if (entity.billboard) {
            entity.billboard.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;

            mars3d.draw.attr.billboard.style2Entity(styleOpt, entity.billboard);

            //加上文字标签 
            if (styleOpt.label && styleOpt.label.field) {
                styleOpt.label.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;

                entity.label = mars3d.draw.attr.label.style2Entity(styleOpt.label);
                entity.label.text = attr[styleOpt.label.field];
            }
        }
        entity.attribute = styleOpt;
    },






}));