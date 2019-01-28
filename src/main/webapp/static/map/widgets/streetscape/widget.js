/* 2017-11-16 14:40:45 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        resources: [
            'view.css',
            //'http://api.map.baidu.com/api?v=2.0&ak=3lyTGoSaiEo7Tt0803bfgMSN1FW53nws'
            'http://api.map.baidu.com/getscript?v=2.0&ak=3lyTGoSaiEo7Tt0803bfgMSN1FW53nws&services='
        ],
        //直接添加到index
        view: {
            type: "append",
            url: 'view.html',
            parent: 'body'
        },
    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        var that = this;

        $("#btn_streetscapeBar_close").click(function () {
            that.disableBase();
        });
    },
    markerXY: null,
    handler: null,
    //激活插件
    activate: function () {
        var inhtml = '<div id="streetscapeView" style="position:absolute;right:0px;top:0px;border:1px solid #ccc;top: 0px;bottom: 0px;width:50%;overflow: hidden;">'
            + '<div id="streetscapeMap" style="height:100%;width:100%;overflow: hidden;color:#000;"></div>'
            + '</div>';
        $("body").append(inhtml);

        $("#centerDiv").css({
            position: "absolute",
            height: "100%",
            width: "50%"
        });
        $(".no-print-view").hide();

        var that = this;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (movement) {
            var cartesian = mars3d.point.getCurrentMousePosition(that.viewer.scene, movement.position);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

                var jd = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
                var wd = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
                //var height = Number(cartographic.height.toFixed(1));

                var wgsPoint = viewer.mars.point2wgs({ x: jd, y: wd }); //坐标转换为wgs
                jd = wgsPoint.x;
                wd = wgsPoint.y;

                that.centerAt(wgsPoint);

                //点击地图的事件,触发街景改变 
                var point = that.getBaiduPoint({ x: jd, y: wd });
                if (that.panorama) {
                    that.panorama.setPosition(new BMap.Point(point.x, point.y)); //根据经纬度坐标展示全景图
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        $('.cesium-viewer').css('cursor', 'crosshair');


        var that = this;
        var idx = setInterval(function () {
            if (window["BMap"] == null) return;
            
            clearInterval(idx);
            that.addSecondMap();
        }, 500);

    },
    //释放插件
    disable: function () {
        if (this.handler) {
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler.destroy();
            this.handler = null;
        }

        $('.cesium-viewer').css('cursor', '');

        if (this.markerXY) {
            this.viewer.entities.remove(this.markerXY);
            this.markerXY = null;
        }
        this.panorama = null;
        $("#streetscapeView").remove();

        $("#centerDiv").css({
            position: "",
            height: "100%",
            width: "100%"
        });
        $(".no-print-view").show();
    },
    getBaiduPoint: function (point) {
        var jd = point.x;
        var wd = point.y;

        point = mars3d.pointconvert.wgs2bd([jd, wd]);
        jd = point[0];
        wd = point[1];

        return { x: jd, y: wd };
    },
    centerAt: function (_latlng) {
        var val = viewer.mars.point2map(_latlng); //坐标转换为map一致的坐标系 

        var position = Cesium.Cartesian3.fromDegrees(val.x, val.y);

        if (this.markerXY == null) {
            this.markerXY = this.viewer.entities.add({
                position: position,
                billboard: {
                    image: this.path + "img/streetimg.png",
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER ,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND   //CLAMP_TO_GROUND RELATIVE_TO_GROUND
                }
            });
        }
        else {
            this.markerXY.position = position;
        }
         
        viewer.mars.centerAt({ x: val.x, y: val.y }); 
    },
    //增加街景的对象以及初始化以及相关街景事件
    panorama: null,
    addSecondMap: function () {
        var that = this;
        var point = mars3d.point.getCenter(this.viewer, true);
        this.centerAt(point);

        var point = this.getBaiduPoint(point);

        var panorama = new BMap.Panorama('streetscapeMap');
        panorama.setPosition(new BMap.Point(point.x, point.y)); //根据经纬度坐标展示全景图
        panorama.setPov({ heading: -40, pitch: 6 });
        panorama.addEventListener('position_changed', function (e) { //全景图位置改变后，普通地图中心点也随之改变
            var pos = panorama.getPosition();//街景变换返回触发的回调函数
            pos = mars3d.pointconvert.bd2wgs([pos.lng, pos.lat]);
       
            that.centerAt({ x: pos[0], y: pos[1] });

            //var pov = panorama.getPov();  
        });
        this.panorama = panorama;
    },





}));