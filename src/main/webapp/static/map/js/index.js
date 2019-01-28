/* 2017-12-7 10:33:50 | 修改 木遥（QQ：516584683） */
//loading bar
var loadingBar = document.getElementById('loadbar');
var oldTime = new Date().getTime();
function run() {
    var curTime = new Date().getTime();
    if (curTime - oldTime >= 3500) {
        loadingBar.className = "";
        if (curTime - oldTime >= 3550) {
            loadingBar.className = "ins";
            oldTime = curTime;
        }
    }
    if (Window.LOADING_FLAG == true) {
        clearInterval(loadIdx);
    }
}
function loaderOK() {
    $("#loadOverlay").hide();
    $('#loadbar').removeClass('ins');
    Window.LOADING_FLAG = true;
}
var loadIdx = setInterval(run, 100);


//地图
$(document).ready(function () {
    if (!mars3d.util.webglreport()) {
        toastr.error('系统检测到您当前使用的浏览器WebGL功能无效');
        layer.open({
            type: 1,
            title: "当前浏览器WebGL功能无效",
            skin: "layer-mars-dialog animation-scale-up",
            resize: false,
            area: ['600px', '200px'], //宽高
            content: '<div style="margin: 20px;"><h3>系统检测到您使用的浏览器WebGL功能无效！</h3>  <p>1、请您检查浏览器版本，安装使用最新版chrome、火狐或IE11以上浏览器！</p> <p>2、WebGL支持取决于GPU支持，请保证客户端电脑已安装最新显卡驱动程序！</p><p>3、如果上两步骤没有解决问题，说明您的电脑需要更换了！</p></div>'
        });
    }
    initUI();
    initMap();
});

function removeMask() {
    $("#mask").remove();
}

var viewer;
//初始化地图
function initMap() {
    var request = haoutil.system.getRequest();

    var configfile = "/we3dGIS/static/map/config.json";
    if (request.config)
        configfile = request.config;

    haoutil.loading.show();

    mars3d.createMap({
        id: 'cesiumContainer',
        url: configfile + "?time=20181201",
        //infoBox: false,     //是否显示点击要素之后显示的信息  【也可以在config.json中配置】 
        layerToMap: layerToMap,
        success: function (_viewer, gisdata, jsondata) {//地图成功加载完成后执行 
            haoutil.loading.hide();


            viewer = _viewer;

            //初始化widget管理器
            var hasAnimation = true;
            if (haoutil.isutil.isNotNull(request.widget)) {
                jsondata.widget.widgetsAtStart = [];
                hasAnimation = false;
            }
            mars3d.widget.init(_viewer, jsondata.widget);

            setTimeout(removeMask, 3000);
            loaderOK();

            //如果有xyz传参，进行定位 
            if (haoutil.isutil.isNotNull(request.x)
                && haoutil.isutil.isNotNull(request.y)) {
                viewer.mars.centerAt(request, { duration: 0, isWgs84: true });
            }

            function calback() {
                //如果url传参，激活对应widget 
                if (haoutil.isutil.isNotNull(request.widget))
                    mars3d.widget.activate(request.widget);

                initWork(_viewer);
            }

            if (hasAnimation) //开场动画
                viewer.mars.openFlyAnimation(calback); //动画播放完成后执行calback回调
            else
                calback();
        }
    });
}


//UI界面相关
function initUI() {
    haoutil.oneMsg('首次访问系统无缓存会略慢，请耐心等待！', 'load3d_tip');


}


//当前页面业务相关
function initWork(viewer) {
    haoutil.oneMsg('如果未出现地球，是因为地形加载失败，请刷新重新加载！', 'terrain_tip');

    // 禁用默认的实体双击动作。
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
     
    //移动设备上禁掉以下几个选项，可以相对更加流畅
    if (!haoutil.system.isPCBroswer()) {
        viewer.targetFrameRate = 20;        //限制帧率
        viewer.requestRenderMode = true;    //取消实时渲染
        viewer.scene.fog.enable = false;
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.fxaa = false;
    }

    //IE浏览器优化
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
        viewer.targetFrameRate = 20;        //限制帧率
        viewer.requestRenderMode = true;    //取消实时渲染
    }

    //更改配置，性能优化
    viewer.scene.logarithmicDepthBuffer = false; 


    //设置操作习惯,更换中键和右键 
    //viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    //    Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH,
    //    { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL },
    //    { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }
    //];
    //viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];




    //限定相机进入地下(非完美解决)
    limitCamera();

    //3dtiles模型的单体化高亮，在ex/featureViewer.js处理
    featureViewer.install(viewer);

}

//config中非底层类库封装类，可以在此加入进行实例化
function layerToMap(item, viewer, layer) {

    //if (item.type == "supermap_s3m") {
    //    var layer = new SupermapS3m(item, viewer);
    //    return layer;
    //}
}

//限定相机进入地下
function limitCamera() {
    var thisHeight = 0;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (e) {
        var cartesian = mars3d.point.getCurrentMousePosition(viewer.scene, e.position);
        if (cartesian) {
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            thisHeight = cartographic.height;
        } else {
            thisHeight = 0;
        }
    }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

    /* 判断相机高度是否低于地面海拔,防止进入地下*/
    viewer.clock.onTick.addEventListener(function () {
        if (viewer.camera.positionCartographic.height < thisHeight + 1
            && Cesium.Math.toRadians(viewer.camera.pitch) > 0) {
            viewer.camera.positionCartographic.height = thisHeight + 1;
            var center = viewer.scene.globe.ellipsoid.cartographicToCartesian(viewer.camera.positionCartographic);
            viewer.camera.setView({
                destination: center, // 设置位置
                orientation: {
                    heading: viewer.camera.heading, // 方向
                    pitch: Cesium.Math.toRadians(0), // 倾斜角度
                    roll: viewer.camera.roll
                }
            });
        }
    });
}

//绑定图层管理有2种添加方式
/**
    第1种是框架支持的配置信息的，按照下面方式添加
    var json = {
        "pid": 40,
        "name": "代码添加图层test",
        "type": "wms",
        "url": "http://gisserver.tianditu.com/TDTService/region/wms",
        "layers": "030100",
        "parameters": {
            "transparent": "true",
            "format": "image/png"
        },
        "center": { "y": 17.571877, "x": 114.258325, "z": 6591684.1, "heading": 352.3, "pitch": -74.3, "roll": 0.1 },
        "visible": true
    };
    mars3d.layer.createLayer(json, viewer);
    bindToLayerControl(json); 
**/

/** 第2种是完全自定义的，在回调方法中写自己相关代码，可参考widgetsTS\qyPoint\widgts.js代码
bindToLayerControl({
    pid: 30,
    name: '企业',
    mydata:null, //自行赋值
    visible: true,
    onAdd: function () {//显示回调
        //这里把数据this.mydata添加到地图上  
    },
    onRemove: function () {//隐藏回调
        //这里把数据this.mydata从地图上移除 
       
    },
    onCenterAt: function (duration) {//定位回调
      
    },
});
**/

//绑定图层管理
function bindToLayerControl(options) {
    if (options._layer == null) {
        var _visible = options.visible;
        delete options.visible;

        var layer = new mars3d.layer.BaseLayer(options, viewer);
        layer._visible = _visible;
        options._layer = layer;
    }

    var manageLayersWidget = mars3d.widget.getClass('/we3dGIS/static/map/widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.addOverlay(options);
    }
    else {
        viewer.gisdata.config.operationallayers.push(options);
    }
    return options._layer;
}
//取消绑定图层管理
function unbindLayerControl(name) {
    var manageLayersWidget = mars3d.widget.getClass('/we3dGIS/static/map/widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.removeLayer(name);
    } else {
        var operationallayersCfg = viewer.gisdata.config.operationallayers;
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            if (item.name == name) {
                operationallayersCfg.splice(i, 1);
                break;
            }
        }
    }
}

//外部页面调用
function activateWidget(item) {
    mars3d.widget.activate(item);
}
function disableWidget(item) {
    mars3d.widget.disable(item);
}
function activateFunByMenu(fun) {
    eval(fun);
}