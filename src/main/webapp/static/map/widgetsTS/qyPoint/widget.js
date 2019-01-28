/* 2017-12-5 16:47:31 | 修改 木遥（QQ：516584683） */
//模块：
var widgetPointQy = mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        resources: ['map.css'],
    },
    dataSource: null,
    //初始化[仅执行1次]
    create: function () {
        this.dataSource = new Cesium.CustomDataSource();

        var that = this;
        //添加到图层控制 
        bindToLayerControl({
            pid: 30,
            name: '企业',
            visible: true,
            onAdd: function () {//显示回调
                that.viewer.dataSources.add(that.dataSource);
            },
            onRemove: function () {//隐藏回调 
                that.viewer.dataSources.remove(that.dataSource);
            },
            onCenterAt: function (duration) {//定位回调
                that.viewer.flyTo(that.dataSource.entities, { duration: duration });
            },
        });

        ////从图层控制中 移除
        //unbindLayerControl('企业');

        //单击事件
        //var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        //handler.setInputAction(function (event) {
        //    var position = event.position;
        //    var pickedObject = viewer.scene.pick(position);
        //    if (pickedObject && Cesium.defined(pickedObject.id)) {
        //        var entity = pickedObject.id;
        //        if (entity.data && entity._isQyPoint)
        //            that.showXQ(entity.data.ID);
        //    }
        //}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    arrdata: [],
    //打开激活
    activate: function () {
        this.viewer.dataSources.add(this.dataSource);

        var that = this;
        this.arrdata = this.config.dataQy;
        if (this.arrdata) {
            this.addFeature(this.arrdata);

            //地形加载完成后,才能正确显示点,所以定时刷新下 
            setTimeout(function () {
                that.addFeature(that.arrdata);
            }, 6000);
        }
        else {
            $.getJSON(this.path + "data/point.json", function (result) {
                that.arrdata = result.Data;
                for (var j = 0; j < that.arrdata.length; j++) {
                    var item = that.arrdata[j];

                    item.QYZP = 5;
                    item.CPZP = 4;
                    item.QYJJ = "有";
                    item.JJ =
                        [
                            { "NF": "2015", "ZCZ": 6000 + haoutil.math.random(10, j * 1000), "LY": 1000 + haoutil.math.random(10, j * 1000), "NSE": 1000 + haoutil.math.random(10, j * 1000) },
                            { "NF": "2016", "ZCZ": 10000 + haoutil.math.random(10, j * 1000), "LY": 3000 + haoutil.math.random(10, j * 1000), "NSE": 3000 + haoutil.math.random(10, j * 1000) },
                            { "NF": "2017", "ZCZ": 25000 + haoutil.math.random(10, j * 1000), "LY": 5000 + haoutil.math.random(10, j * 1000), "NSE": 5000 + haoutil.math.random(10, j * 1000) }
                        ];
                }

                that.addFeature(that.arrdata, true);

                //地形加载完成后,才能正确显示点,所以定时刷新下 
                setTimeout(function () {
                    that.addFeature(that.arrdata);
                }, 6000);
            });
        }
    },
    //关闭释放
    disable: function () {
        this.viewer.dataSources.remove(this.dataSource);

    },
    clear: function () {
        viewer.mars.tooltip.close();

        this.dataSource.entities.removeAll()
    },
    objData: {},
    addFeature: function (arr, iscenter) {
        this.clear();

        var that = this;

        that.objData = {};
        $(arr).each(function (i, item) {
            that.objData[item.ID] = item;

            var jd = Number(item.JD);
            var wd = Number(item.WD);
            //var z = 0;


            //===========无坐标数据=========== 
            if (isNaN(jd) || jd == 0 || isNaN(wd) || wd == 0)
                return;
            item.JD = jd;
            item.WD = wd;

            var inthtml = '<ul class="qyMarker" onclick="widgetPointQy.showXQ(\'' + item.ID + '\')">'
                + '		<li>' + item.NAME + '</li>'
                + '		<li>' + item.LX + '</li>'
                + '</ul>';


            //添加实体
            var entity = that.dataSource.entities.add({
                name: item.JC,
                position: Cesium.Cartesian3.fromDegrees(jd, wd),
                //billboard: {
                //    image: 'img/marker/mark1.png',
                //    scale: 1,
                //    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                //    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                //    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,   //CLAMP_TO_GROUND RELATIVE_TO_GROUND,
                //    scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1)
                //},
                point: {
                    color: new Cesium.Color.fromCssColorString("#3388ff"),
                    pixelSize: 10,
                    outlineColor: new Cesium.Color.fromCssColorString("#ffffff"),
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,     //贴地
                    scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1)
                },
                label: {
                    text: item.JC,
                    font: '16px Helvetica',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.AZURE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),   //偏移量  
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, //是地形上方的高度 
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000)
                },
                _isQyPoint: true, //标识下，事件中判断
                data: item,
                tooltip: {
                    html: inthtml,
                    anchor: [0, -12],
                },
                click: function (entity) {//单击回调
                    that.showXQ(entity.data.ID);
                }
            });

            item._entity = entity;
        });

        //console.log(JSON.stringify(arr));
        if (iscenter)
            that.viewer.flyTo(that.dataSource.entities, { duration: 3 });

        return arr;
    },
    getData: function () {
        return this.arrdata;
    },
    //打开详情
    showXQ: function (id) {
        var item = this.objData[id];
        if (item === null) return;

        mars3d.widget.activate({
            uri: '/we3dGIS/static/map/widgetsTS/qyDetailsView/widget.js',
            dataQy: item,
        });

        //弹出自己的单独页面或其他站点url页面。
        //layer.open({
        //    type: 2,
        //    title: '详情页面',
        //    fix: true,
        //    shadeClose: false,
        //    maxmin: true,
        //    area: ["80%", "80%"],
        //    content: "test.html?id="+id,
        //    skin: "layer-mars-dialog animation-scale-up",
        //    success: function (layero) {

        //    }
        //});
    },
    queryData: function (params) {
        var newdata = [];

        this.clear();

        var arrdata = this.arrdata;
        for (var i = 0; i < arrdata.length; i++) {
            var item = arrdata[i];
            if (params.key == "" || item.NAME.indexOf(params.key) != -1) {
                newdata.push(item);

                if (item._entity) {
                    this.dataSource.entities.add(item._entity);
                }
            }
        }
        return newdata;
    },
    lastCenter: null,
    clearLastCenter: function () {
        viewer.mars.tooltip.close();
        if (this.lastCenter == null) return;

        //if (this.lastCenter.billboard)
        //    this.lastCenter.billboard.image = this.path + 'img/mark.png';
        if (this.lastCenter.point)
            this.lastCenter.point.color = new Cesium.Color.fromCssColorString("#3388ff");

        this.lastCenter = null;
    },
    centerAt: function (id) {
        this.clearLastCenter();

        var item = this.objData[id];
        if (item === null) return;

        var entity = item._entity;
        if (entity == null) {
            toastr.warning(item.JC + " 无经纬度坐标信息！");
            return;
        }


        viewer.mars.centerAt({ x: item.JD, y: item.WD, minz: 2500 });

        setTimeout(function () {
            viewer.mars.tooltip.show(entity, entity.position.getValue());
        }, 3000);


        this.lastCenter = entity;
        //if (this.lastCenter.billboard)
        //    this.lastCenter.billboard.image = this.path + 'img/mark2.png';
        if (this.lastCenter.point)
            this.lastCenter.point.color = new Cesium.Color.fromCssColorString("#ff0000");


        var that = this;
        setTimeout(function () {
            that.clearLastCenter();
        }, 10000);
    }


}));

