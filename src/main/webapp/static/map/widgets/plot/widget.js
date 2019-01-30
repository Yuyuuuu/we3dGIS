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
    drawControl: null,
    //初始化[仅执行1次]
    create: function () {
        var that = this;

        this.drawControl = new mars3d.Draw(this.viewer, {
            hasEdit: false,
            nameTooltip: true,
        });

        //事件监听  
        this.drawControl.on(mars3d.draw.event.DrawCreated, function (e) {
            var entity = e.entity;
            that.startEditing(entity);
        });
        this.drawControl.on(mars3d.draw.event.EditStart, function (e) {
            var entity = e.entity;
            that.startEditing(entity);
        });
        this.drawControl.on(mars3d.draw.event.EditMovePoint, function (e) {
            var entity = e.entity;
            that.startEditing(entity);
        });
        this.drawControl.on(mars3d.draw.event.EditRemovePoint, function (e) {
            var entity = e.entity;
            that.startEditing(entity);
        });
        this.drawControl.on(mars3d.draw.event.EditStop, function (e) {
            var entity = e.entity;
            that.stopEditing(entity);
            that.saveEntity(entity);
        });

        ////编辑时拖拽点颜色（修改内部默认值）
        //mars3d.draw.dragger.PointColor.Control = new Cesium.Color.fromCssColorString("#1c197d");          //位置控制拖拽点
        //mars3d.draw.dragger.PointColor.MoveHeight = new Cesium.Color.fromCssColorString("#9500eb");       //上下移动高度的拖拽点
        //mars3d.draw.dragger.PointColor.EditAttr = new Cesium.Color.fromCssColorString("#f73163");         //辅助修改属性（如半径）的拖拽点
        //mars3d.draw.dragger.PointColor.AddMidPoint = new Cesium.Color.fromCssColorString("#04c2c9").withAlpha(0.3);     //增加新点，辅助拖拽点

        ////标绘时的tooltip（修改内部默认值）
        //mars3d.draw.tooltip.draw.point.start = '单击 完成绘制';
        //mars3d.draw.tooltip.draw.polyline.start = '单击 开始绘制';
        //mars3d.draw.tooltip.draw.polyline.cont = '单击增加点，右击删除点';
        //mars3d.draw.tooltip.draw.polyline.end = '单击增加点，右击删除点<br/>双击完成绘制';
        //mars3d.draw.tooltip.draw.polyline.end2 = '单击完成绘制';
        //mars3d.draw.tooltip.edit.start = '单击后 激活编辑';
        //mars3d.draw.tooltip.edit.end = '释放后 完成修改';
        //mars3d.draw.tooltip.dragger.def = '拖动 修改位置'; //默认拖拽时提示  
        //mars3d.draw.tooltip.dragger.addMidPoint = '拖动 增加点';
        //mars3d.draw.tooltip.dragger.moveHeight = '拖动 修改高度';
        //mars3d.draw.tooltip.dragger.editRadius = '拖动 修改半径';
        //mars3d.draw.tooltip.del.def = '<br/>右击 删除该点';
        //mars3d.draw.tooltip.del.min = '无法删除，点数量不能少于';

        //添加到图层控制 
        bindToLayerControl({
            pid: 0,
            name: '标绘',
            visible: true,
            onAdd: function () {//显示回调 
                that.drawControl.setVisible(true);
            },
            onRemove: function () {//隐藏回调 
                that.drawControl.setVisible(false);
            },
            onCenterAt: function (duration) {//定位回调
                var arr = that.drawControl.getEntitys();
                that.viewer.flyTo(arr, { duration: duration });
            },
        });
        this.getList();
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {
        this.drawControl.hasEdit(true);
    },
    //释放插件
    disable: function () {
        this.viewWindow = null;
        this.drawControl.hasEdit(false);
        //this.deleteAll(); 
    },

    //开始标记
    startDraw: function (defval) {
        console.log(JSON.stringify(defval));
        this.drawControl.startDraw(defval);
    },
    startEditingById: function (id) {
        var entity = this.drawControl.getEntityById(id);
        if (entity == null) return;

        this.viewer.flyTo(entity);

        entity.startEditing();
    },
    startEditing: function (entity) {
        var lonlats = this.drawControl.getCoordinates(entity);
        this.viewWindow.plotEdit.startEditing(entity.attribute, lonlats);
    },
    stopEditing: function (layer) {
        if (this.viewWindow)
            this.viewWindow.plotEdit.stopEditing();
    },
    //更新图上的属性
    updateAttr2map: function (attr) {
        this.drawControl.updateAttribute(attr);
    },
    //更新图上的几何形状、坐标等
    updateGeo2map: function (coords, withHeight) {
        var positions = [];
        if (withHeight) {
            for (var i = 0; i < coords.length; i += 3) {
                var point = Cesium.Cartesian3.fromDegrees(coords[i], coords[i + 1], coords[i + 2]);
                positions.push(point);
            }
        } else {
            for (var i = 0; i < coords.length; i += 2) {
                var point = Cesium.Cartesian3.fromDegrees(coords[i], coords[i + 1], 0);
                positions.push(point);
            }
        }

        this.drawControl.setPositions(positions.length == 1 ? positions[0] : positions);//更新当前编辑的entity

        if (positions.length <= 3) {
            this.centerCurrentEntity();
        }

        return positions;
    },
    centerCurrentEntity: function () {
        var entity = this.drawControl.getCurrentEntity();
        if (entity == null) return;

        var positions = this.drawControl.getPositions(entity);
        if (positions.length > 1) {
            this.viewer.camera.flyTo({
                destination: Cesium.Rectangle.fromCartesianArray(positions),
            });
        } else {
            this.viewer.flyTo(entity);
        }
    },
    //文件处理
    getGeoJson: function () {
        return this.drawControl.toGeoJSON();
    },
    jsonToLayer: function (json, isClear, isFly) {
        if (json == null) return;

        return this.drawControl.jsonToEntity(json, isClear, isFly);
    },
    deleteAll: function () {
        this.drawControl.deleteAll();

        //本地存储
        haoutil.storage.del(this.storageName);
    },
    deleteEntity: function (id) {
        var entity = this.drawControl.getEntityById(id);
        if (entity == null) return;

        this.drawControl.deleteEntity(entity);
    },
    deleteCurrentEntity: function () {
        var entity = this.drawControl.getCurrentEntity();
        if (entity == null) return;

        this.drawControl.deleteEntity(entity);

        //var that = this;
        //sendAjax({
        //    url: 'kjAirspace/del/' + entity._attribute.attr.id,
        //    type: 'get',
        //    success: function (id) { 
        //    }
        //}); 

        //本地存储
        var storagedata = JSON.stringify(this.getGeoJson());
        haoutil.storage.add(this.storageName, storagedata);
    },
    hasEdit: function (val) {
        this.drawControl.hasEdit(val);
    },
    //搜索
    query: function (text, maxcount) {
        var arrEntity = this.drawControl.getEntitys();

        var arr = [];
        var counts = 0;
        for (var i = 0; i < arrEntity.length; i++) {
            var entity = arrEntity[i];

            var name;
            if (entity.attribute.type === "label") {
                name = entity.attribute.style.text;
            }
            else if (entity.attribute.attr) {
                name = entity.attribute.attr.name;
            }

            if (name == null || name.indexOf(text) == -1) continue;

            arr.push({
                name: name,
                type: '标绘 - ' + entity.attribute.name,
                _datatype: 'plot',
                _entity: entity
            });

            if (maxcount) {
                counts++;
                if (counts > maxcount) break;
            }
        }
        return arr;
    },
    //弹窗属性编辑处理
    last_window_param: null,
    showEditAttrWindow: function (param) {
        this.last_window_param = param;

        //layer.open({
        //    type: 2,
        //    title: '选择数据',
        //    fix: true,
        //    shadeClose: false,
        //    maxmin: true,
        //    area: ["100%", "100%"],
        //    content: "test.html?name=" + param.attrName + "&value=" + param.attrVal,
        //    skin: "layer-mars-dialog animation-scale-up",
        //    success: function (layero) {

        //    }
        //});
    },
    saveWindowEdit: function (attrVal) {
        this.viewWindow.plotEdit.updateAttr(this.last_window_param.parname, this.last_window_param.attrName, attrVal);
        layer.close(layer.index);
    },
    storageName: "marsgis_plot",
    getList: function () {
        var that = this;


        //读取本地存储
        var laststorage = haoutil.storage.get(this.storageName); //读取localStorage值  
        if (laststorage == null || laststorage == 'null') {
            //实际系统时可以注释下面代码，该代码是加载演示数据
            $.getJSON("../data/geojson/plot.json", function (result) {
                if (!that.isActivate) return;
                that.jsonToLayer(result, true, true);
            });
        } else {
            that.jsonToLayer(JSON.parse(laststorage), true, true);
        }

        //读取服务端存储
        //sendAjax({
        //    url: '/kjAirspace/getAll',
        //    type: 'get',
        //    success: function (arr) { 
        //        var arrjson = [];
        //        for (var i = 0; i < arr.length; i++) {
        //            var item = arr[i];
        //            var json = {
        //                type: "Feature",
        //                properties: JSON.parse(item.properties),
        //                geometry: JSON.parse(item.coordinates)
        //            };
        //            json.properties.attr.id = item.id;
        //            json.properties.attr.name = item.name;
        //            json.properties.attr.remark = item.remark;

        //            arrjson.push(json);
        //        }
        //        that.drawControl.jsonToEntity({ type: "FeatureCollection", features: arrjson }, true, false);
        //    }
        //});

    },
    saveEntity: function (entity) {
        entity._attribute.attr = entity._attribute.attr || {};
        entity._attribute.attr.id = (new Date()).format("yyyyMMddHHmmss");


        //本地存储
        var storagedata = JSON.stringify(this.getGeoJson());
        haoutil.storage.add(this.storageName, storagedata);


        //服务端存储
        var json = this.drawControl.toGeoJSON(entity); 
        sendAjax({
            url: '/we3dGIS/map/plot/savePlot.jhtml',
            data: JSON.stringify(this.getGeoJson()),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: 'post',
           success: function (data) {
                entity._attribute.attr.id = data;
            }
        });

    },

}));