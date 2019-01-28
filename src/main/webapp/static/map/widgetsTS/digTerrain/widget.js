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
                height: 100
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {
        this.drawControl = new mars3d.Draw(this.viewer,{ hasEdit: false });
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        this._last_depthTestAgainstTerrain = this.viewer.scene.globe.depthTestAgainstTerrain;
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },
    //关闭释放
    disable: function () {
        this.viewer.scene.globe.depthTestAgainstTerrain = this._last_depthTestAgainstTerrain;
        this.clearClippingPlane();
    },
    clearClippingPlane: function () {
        if (this.viewer.scene.globe.clippingPlanes)
            this.viewer.scene.globe.clippingPlanes.enabled = false;

        if (this.arrEntity) {
            for (var i = 0; i < this.arrEntity.length; i++) {
                viewer.entities.remove(this.arrEntity[i]);
            }
            delete this.arrEntity;
        }
        this.drawControl.deleteAll();
    },
    createClippingPlane: function () {
        var that = this;
        this.clearClippingPlane();

        this.drawControl.startDraw({
            type: "polygon",
            style: {
                color: "#29cf34",
                opacity: 0.5,
                clampToGround: true
            },
            success: function (entity) { //绘制成功后回调 
                var points = entity.polygon.hierarchy.getValue();
                that.showClippingPlanes(points);

                that.drawControl.deleteAll();
            }
        });
    },
    showClippingPlanes: function (points) {
        var newArr = [];
        var clippingPlanes = [];
        var pointsLength = points.length;

        var cartesian3 = new Cesium.Cartesian3();

        var direction = Cesium.Cartesian3.subtract(points[0], points[1], cartesian3);//方向： 
        direction = direction.x > 0;//是否顺时针

        for (var i = 0; i < pointsLength; ++i) {
            var nextIndex = (i + 1) % pointsLength;
            var midpoint = Cesium.Cartesian3.midpoint(points[i], points[nextIndex], new Cesium.Cartesian3());

            newArr.push(points[i]);
            newArr.push(midpoint);

            var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
            var right;
            if (direction) {//顺时针
                right = Cesium.Cartesian3.subtract(points[i], midpoint, new Cesium.Cartesian3());
            }
            else {
                right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3());
            }
            right = Cesium.Cartesian3.normalize(right, right);

            var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
            normal = Cesium.Cartesian3.normalize(normal, normal);

            // Compute distance by pretending the plane is at the origin
            var originCenteredPlane = new Cesium.Plane(normal, 0.0);
            var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

            clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
        }

        this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: clippingPlanes,
            edgeWidth: 1.0,
            edgeColor: Cesium.Color.WHITE,
            enabled: true
        });

        this.addClippingImageMaterial(newArr);
    },
    //加上裁剪区域的贴图
    addClippingImageMaterial: function (points) {
        var wallHeight = 50;//开挖地下多少米

        var minimumHeights = [];
        var maximumHeights = [];
        var wallPoints = [];
        var polygonPoints = [];

        for (var i = 0; i < points.length; ++i) {
            var carto = Cesium.Cartographic.fromCartesian(points[i]);

            var _height = carto.height;
            var _heightNew = viewer.scene.sampleHeight(carto);
            if (_height != null && _heightNew > _height)
                _height = _heightNew;

            minimumHeights.push(-wallHeight);
            maximumHeights.push(_height);
            wallPoints.push(Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, 0));

            polygonPoints.push(Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, -wallHeight));
        }
        //添加第1点，形成闭合墙
        wallPoints.push(wallPoints[0]);
        minimumHeights.push(minimumHeights[0]);
        maximumHeights.push(maximumHeights[0]);


        var entityDMBJ = viewer.entities.add({
            name: '挖地四周墙',
            wall: {
                positions: wallPoints,
                maximumHeights: maximumHeights,
                minimumHeights: minimumHeights,
                material: new Cesium.ImageMaterialProperty({
                    image: this.path + 'img/excavationregion_top.jpg',
                    repeat: new Cesium.Cartesian2(10, wallHeight)
                }),
            }
        });


        var entityDM = viewer.entities.add({
            name: '挖地底面',
            polygon: {
                hierarchy: polygonPoints,
                perPositionHeight: true,
                material: new Cesium.ImageMaterialProperty({
                    image: this.path + 'img/excavationregion_side.jpg',
                    repeat: new Cesium.Cartesian2(10, 10)
                }),
            }
        });

        this.arrEntity = [entityDMBJ, entityDM];
    },


}));

