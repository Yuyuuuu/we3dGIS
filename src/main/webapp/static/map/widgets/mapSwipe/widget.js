/* 2017-10-27 16:55:42 | 修改 木遥（QQ：516584683） */
//模块：
var mapSwipeWidget = mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        resources: ['view.css'],
        view: {
            type: "append",
            url: 'view.html',
            parent: 'body'
        },
    },
    //每个窗口创建完成后调用
    winCreateOK: function (html) {
        var that = this;

        if (this.config && this.config.style) {
            $(".mapSwipeBar").addClass(this.config.style);
        }


        var arrLayers = this.getBaseMaps();

        var inhtmlBaseLayer = "";
        var inhtmlSwipelayer = ""; 
        for (var i = 0; i < arrLayers.length; i++) {

            var item = arrLayers[i];
            if (item.type == "group" && item.layers == null) continue;
             
            inhtmlBaseLayer += ' <li><a href="javascript:mapSwipeWidget.changeSelectBaseLayer(' + i + ',true)">' + item.name + '</a></li>';
            inhtmlSwipelayer += ' <li><a href="javascript:mapSwipeWidget.changeSelectSwipeLayer(' + i + ',true)">' + item.name + '</a></li>';
        }
        $("#ddl_basemap").html(inhtmlBaseLayer);
        $("#ddl_swipelayer").html(inhtmlSwipelayer);
 
        $("#btn_mapSwipe_close").click(function () {
            that.disableBase();
        }); 
    },
    arrOldLayers: [],
    //激活插件
    activate: function () {
        $(".toolBarRight").css({ top: '60px' });

        ////记录图层
        //this.arrOldLayers = [];
        //var imageryLayerCollection = this.viewer.imageryLayers;
        //var length = imageryLayerCollection.length;
        //for (var i = 0; i < length; i++) {
        //    var layer = imageryLayerCollection.get(0);
        //    this.arrOldLayers.push(layer);
        //    imageryLayerCollection.remove(layer, false);
        //}

        var scene = this.viewer.scene;

        var slider = $("<div id='slider' class='cesium-map-contrast-slider'></div>");
        $("#cesiumContainer").append(slider);
        scene.imagerySplitPosition = (slider[0].offsetLeft) / slider[0].parentElement.offsetWidth;

        var dragStartX = 0;
        document.getElementById('slider').addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);


        var arrLayers = this.getBaseMaps();
        var defbaseIdx = -1;
        var defoverIdx = -1;
        for (var i = 0; i < arrLayers.length; i++) {

            var item = arrLayers[i];
            if (item.type == "group" && item.layers == null) continue;

            if (defbaseIdx == -1)
                defbaseIdx = i;
            else if (defbaseIdx != -1 && defoverIdx == -1) {
                defoverIdx = i;
                break;
            }
        } 
        this.changeSelectBaseLayer(defbaseIdx, true);
        this.changeSelectSwipeLayer(defoverIdx, true);


        function mouseUp() {
            window.removeEventListener('mousemove', sliderMove, true);
        }

        function mouseDown(e) {
            var slider = document.getElementById('slider');
            dragStartX = e.clientX - slider.offsetLeft;
            window.addEventListener('mousemove', sliderMove, true);
        }

        function sliderMove(e) {
            var slider = document.getElementById('slider');
            var splitPosition = (e.clientX - dragStartX) / slider.parentElement.offsetWidth;
            slider.style.left = 100.0 * splitPosition + "%";

            scene.imagerySplitPosition = splitPosition;
        }

    },
    //释放插件
    disable: function () {
        $(".toolBarRight").css({ top: '10px' });
        $("#slider").remove();

        if (this.leftLayer != null) {
            this.leftLayer._layer.setVisible(false);
        }
        if (this.rightLayer != null) {
            this.rightLayer._layer.setVisible(false);
        }
        this.leftLayer = null;
        this.rightLayer = null;

        //var imageryLayerCollection = this.viewer.imageryLayers;
        //for (var i = 0; i < this.arrOldLayers.length; i++) {
        //    imageryLayerCollection.add(this.arrOldLayers[i]);
        //}
        //this.arrOldLayers = [];

        var arrLayers = this.getBaseMaps(); 
        for (var i = 0; i < arrLayers.length; i++) {

            var item = arrLayers[i];
            if (item.type == "group" && item.layers == null) continue;

            item._layer.setVisible(true);
            break;
        }

    },
    getBaseMaps: function () {
        var arr = [];
        var basemapsCfg = this.viewer.gisdata.config.basemaps;
        for (var i = 0; i < basemapsCfg.length; i++) {
            arr.push(basemapsCfg[i]);
        }

        var operationallayersCfg = this.viewer.gisdata.config.operationallayers;
        for (var i = 0; i < operationallayersCfg.length; i++) {
            var item = operationallayersCfg[i];
            debugger
            if (item._layer && item._layer.isTile) {//instanceof mars3d.layer.TileLayer 
                arr.push(item);
            }
        }
        return arr;
    },
    leftLayer: null,
    updateLeftLayer: function (item) {
        if (item._layer == null) return;

        if (this.leftLayer != null) {
            this.leftLayer._layer.setVisible(false);
        }
        this.leftLayer = item;

        item._layer.setVisible(true);
        if (item.type == "group") {
            for (var i = 0; i < item._layers.length; i++) {
                var layer = item._layers[i].layer;
                layer.splitDirection = Cesium.ImagerySplitDirection.LEFT;
            }
        }
        else {

            item._layer.layer.splitDirection = Cesium.ImagerySplitDirection.LEFT;
        }
    },
    rightLayer: null,
    updateRightLayer: function (item) {
        if (item._layer == null) return;

        if (this.rightLayer != null) {
            this.rightLayer._layer.setVisible(false);
        }
        this.rightLayer = item;

        item._layer.setVisible(true);
        if (item.type == "group") {
            for (var i = 0; i < item._layers.length; i++) {
                var layer = item._layers[i].layer;
                layer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
            }
        }
        else {
            item._layer.layer.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
        }
    },
    //view界面控制
    _last_baselayer_id: null,
    _last_swipeLayer_id: null,
    changeSelectBaseLayer: function (id, ischange) {
        if (this._last_swipeLayer_id == id) {
            toastr.warning('图层对比不能为同一图层！');
            return;
        }
        this._last_baselayer_id = id;

        var arrLayers = this.getBaseMaps();
        var thisLayer = arrLayers[id];
        //if (thisLayer == null || thisLayer._layer == null) return;

        $("#btnSelectBaseMap").html('已选:' + thisLayer.name + '<span class="caret"></span>');
        if (ischange)
            this.updateLeftLayer(thisLayer);
    },
    changeSelectSwipeLayer: function (id, ischange) {
        if (this._last_baselayer_id == id) {
            toastr.warning('图层对比不能为同一图层！');
            return;
        }
        this._last_swipeLayer_id = id;

        var arrLayers = this.getBaseMaps();
        var thisLayer = arrLayers[id];
        //if (thisLayer == null || thisLayer._layer == null) return;

        $("#btnSelectSwipelayer").html('已选:' + thisLayer.name + '<span class="caret"></span>');

        if (ischange)
            this.updateRightLayer(thisLayer);
    }


}));