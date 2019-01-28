/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 250,
                height: 270
            }
        },
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
    //打开激活
    activate: function () {
 
    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;
        this.clear();
    },
    drawPolygon: function () {
        var that = this;
        this.clear();

        this.drawControl.startDraw({
            type: "polygon",
            style: {
                color: "#007be6",
                opacity: 0.5, 
                perPositionHeight: true,
                outline:false
            },
            success: function (entity) { //绘制成功后回调
                that.drawOk(entity);
            }
        });
    },
    entity:null,
    drawOk: function (entity) {
        if (this.viewWindow == null) return;

        this.entity = entity;

        //求最大、最小高度值  
        var result = this.computePolygonHeightRange(this.entity.polygon.hierarchy.getValue());

        this.viewWindow.updateHeightForDraw(result.minHeight, result.maxHeight); 
    }, 
    //计算面内最大、最小高度值
    computePolygonHeightRange: function (positions) {
        var maxHeight = 0;
        var minHeight = 9999;

        var granularity = (Math.PI / Math.pow(2, 11)) / 64; 
        var polygonGeometry = new Cesium.PolygonGeometry.fromPositions({
            positions: positions,
            vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            granularity: granularity
        }); 
        var geom = new Cesium.PolygonGeometry.createGeometry(polygonGeometry);
         
        var i0, i1, i2;
        var height1, height2, height3;
        var cartesian; 

        for (var i = 0; i < geom.indices.length; i += 3) {
            i0 = geom.indices[i];
            i1 = geom.indices[i + 1];
            i2 = geom.indices[i + 2];

            cartesian = new Cesium.Cartesian3(geom.attributes.position.values[i0 * 3],
                geom.attributes.position.values[i0 * 3 + 1],
                geom.attributes.position.values[i0 * 3 + 2]); 
            height1 = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(cartesian)); 

            if (minHeight > height1)
                minHeight = height1;
            if (maxHeight < height1)
                maxHeight = height1;

            cartesian = new Cesium.Cartesian3(geom.attributes.position.values[i1 * 3],
                geom.attributes.position.values[i1 * 3 + 1],
                geom.attributes.position.values[i1 * 3 + 2]); 
            height2 = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(cartesian));

            if (minHeight > height2)
                minHeight = height2;
            if (maxHeight < height2)
                maxHeight = height2;

            cartesian = new Cesium.Cartesian3(geom.attributes.position.values[i2 * 3],
                geom.attributes.position.values[i2 * 3 + 1],
                geom.attributes.position.values[i2 * 3 + 2]); 
            height3 = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(cartesian));

            if (minHeight > height3)
                minHeight = height3;
            if (maxHeight < height3)
                maxHeight = height3;
        }

        return {
            maxHeight: maxHeight,
            minHeight: minHeight
        };
    },
    startFx: function (height) {
        if (this.entity == null) {
            haoutil.msg('请首先绘制分析区域！');
            return false;
        }

        viewer.scene.globe.depthTestAgainstTerrain = true;

        var that = this;
        this.extrudedHeight = height;
        this.entity.polygon.extrudedHeight = new Cesium.CallbackProperty(function (time) {
            return that.extrudedHeight;
        }, false);

        //修改高度值
        var positions = this.entity.polygon.hierarchy.getValue();
        var lonlats = []; 
        for (var i = 0; i < positions.length; i++) {
            var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(positions[i]);
             
            var tempcarto = {
                lon: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                hgt: height
            };
            var lonlat = [tempcarto.lon, tempcarto.lat, tempcarto.hgt];
            lonlats = lonlats.concat(lonlat);
        }
        positions = Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);
        this.entity.polygon.hierarchy = positions;
  
        return true;
    },
    clear: function () {
        viewer.scene.globe.depthTestAgainstTerrain = false;
         
        this.drawControl.deleteAll();
        this.entity = null;
    },
    updateHeight: function (height) {
        this.extrudedHeight = height;
        //this.entity.polygon.extrudedHeight = height;
  
    }



}));

