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

        this.drawControl = new mars3d.Draw(viewer, { hasEdit: true });

        //事件监听  
        var that = this;
        this.drawControl.on(mars3d.draw.event.DrawCreated, function (e) {
            var entity = e.entity;
            if (entity._attribute.attr.id == null || entity._attribute.attr.id == "")
                entity._attribute.attr.id = (new Date()).format("MMddHHmmss");

            if (that.viewWindow)
                that.viewWindow.plotlist.plotEnd();
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
        this.drawControl.setVisible(true);
    },
    //释放插件
    disable: function () {
        this.viewWindow = null;
        this.drawControl.stopDraw();

        if (this.lastEditEntity) {
            this.lastEditEntity._polyline.show = false;
            this.lastEditEntity._attribute.style.show = false;
            this.lastEditEntity = null;
        }

        this.drawControl.hasEdit(false);
        this.drawControl.setVisible(false);
    },

    //开始标记
    startDraw: function (defval) {
        //console.log(JSON.stringify(defval));
        this.drawControl.startDraw(defval);
    },
    startEditingById: function (id) {
        var entity = this.drawControl.getEntityById(id);
        if (entity == null) return;

        this.viewer.flyTo(entity);

        this.drawControl.startEditing(entity);
    },
    lastEditEntity: null,
    startEditing: function (entity) {
        //编辑时只显示本身路线，其他路线隐藏
        if (this.lastEditEntity) {
            this.lastEditEntity._polyline.show = false;
            this.lastEditEntity._attribute.style.show = false;
            this.lastEditEntity = null;
        }
        this.lastEditEntity = entity;

        entity._polyline.show = true;
        entity._attribute.style.show = true;


        debugger
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
        }
        else {
            for (var i = 0; i < coords.length; i += 2) {
                var point = Cesium.Cartesian3.fromDegrees(coords[i], coords[i + 1], 0);
                positions.push(point);
            }
        }
        this.drawControl.setPositions(positions);

        if (positions.length <= 3) {
            this.centerCurrentEntity();
        }

        return positions;
    },
    centerCurrentEntity: function () {
        var entity = this.drawControl.getCurrentEntity();
        if (entity == null) return;
        this.viewer.flyTo(entity);
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
        this.deleteAllData();
    },
    deleteEntity: function (id) {
        var entity = this.drawControl.getEntityById(id);
        if (entity == null) return;

        this.delEntity(id);
        this.drawControl.deleteEntity(entity);
    },
    deleteCurrentEntity: function () {
        var entity = this.drawControl.getCurrentEntity();
        if (entity == null) return;

        this.delEntity(entity._attribute.attr.id);
        this.drawControl.deleteEntity(entity);
    },
    hasEdit: function (val) {
        this.drawControl.hasEdit(val);
    },

    //数据保存处理
    storageName: "marsgis_roam",
    arrFlyTable: [],
    getList: function () {
        var that = this;

        var laststorage = haoutil.storage.get(this.storageName); //读取localStorage值 
        if (laststorage != null)
            this.arrFlyTable = eval(laststorage);

        if (this.arrFlyTable == null || this.arrFlyTable.length == 0) {
            this.arrFlyTable = [];

            var that = this;
            $.getJSON(this.path + "data/fly.json", function (result) {
                that.arrFlyTable = that.arrFlyTable.concat(result);
                that.showData(that.arrFlyTable);
                if (that.viewWindow)
                    that.viewWindow.tableWork.loadData(this.arrFlyTable);
            });
        } else {
            this.showData(this.arrFlyTable);
            if (this.viewWindow)
                this.viewWindow.tableWork.loadData(this.arrFlyTable);
        }
    },
    showData: function (arr) { //加载历史保存数据
        var arrjson = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            item.properties.style.show = false;

            var json = {
                type: "Feature",
                properties: item.properties,
                geometry: item.geometry
            };
            json.properties.attr.id = item.id;
            json.properties.attr.name = item.name;

            arrjson.push(json);
        }
        this.drawControl.jsonToEntity({ type: "FeatureCollection", features: arrjson }, true, false);
    },
    deleteAllData: function () {
        this.arrFlyTable = [];
        haoutil.storage.add(this.storageName, JSON.stringify(this.arrFlyTable));
        if (this.isActivate && this.viewWindow != null)
            this.viewWindow.tableWork.loadData(this.arrFlyTable);
    },
    delEntity: function (id) {
        for (var index = this.arrFlyTable.length - 1; index >= 0; index--) {
            if (this.arrFlyTable[index].id == id) {
                this.arrFlyTable.splice(index, 1);
                break;
            }
        }
        haoutil.storage.add(this.storageName, JSON.stringify(this.arrFlyTable));
        if (this.isActivate && this.viewWindow != null)
            this.viewWindow.tableWork.loadData(this.arrFlyTable);
    },
    saveEntity: function (entity) {
        if (entity._attribute.attr.id == null || entity._attribute.attr.id == "")
            entity._attribute.attr.id = (new Date()).format("MMddHHmmss");

        if (entity._attribute.attr.name == null || entity._attribute.attr.name == "")
            entity._attribute.attr.name = '路线' + entity._attribute.attr.id;

        var json = this.drawControl.toGeoJSON(entity);
        if (json.geometry.coordinates.length < 2) {//路线点数小于2个

            return;
        }

        var item = {
            id: json.properties.attr.id,
            name: json.properties.attr.name,

            geometry: json.geometry,
            properties: json.properties,
        };

        var isFind = false;
        for (var index = this.arrFlyTable.length - 1; index >= 0; index--) {
            if (this.arrFlyTable[index].id == item.id) {
                isFind = true;
                this.arrFlyTable[index] = item;
                break;
            }
        }

        if (!isFind)
            this.arrFlyTable.push(item);

        haoutil.storage.add(this.storageName, JSON.stringify(this.arrFlyTable));
        if (this.isActivate && this.viewWindow != null)
            this.viewWindow.tableWork.loadData(this.arrFlyTable);
    },
    toRoamFly: function (data) {
        mars3d.widget.activate({
            uri: '/we3dGIS/static/map/widgets/roamFly/widget.js',
            data: data
        });
    },



}));