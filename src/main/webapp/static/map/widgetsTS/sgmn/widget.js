//模块：//此方式：弹窗非iframe模式
var zfdxSgmnWidget = mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        resources: [
            "../lib/jquery/mCustomScrollbar/jquery.mCustomScrollbar.css",
            "../lib/jquery/mCustomScrollbar/jquery.mCustomScrollbar.js",
            'lib/drag.js',
            'style.css'
        ],
        view: [
            { type: "append", url: "view.html" }
        ],
    },
    processBar: null,
    //初始化[仅执行1次]
    create: function () {
        var that = this;
        //添加到图层控制 
        bindToLayerControl({
            pid: 30,
            name: '事故模拟',
            visible: true,
            onAdd: function () {//显示回调
                $(that.entities).each(function (i, item) {
                    that.viewer.entities.add(item);
                });
            },
            onRemove: function () {//隐藏回调
                $(that.entities).each(function (i, item) {
                    that.viewer.entities.remove(item);
                });
            },
            onCenterAt: function (duration) {//定位回调
                that.viewer.flyTo(that.entities, { duration: duration });
            },
        });
    },
    //每个窗口创建完成后调用
    winCreateOK: function (viewopt, html) {
        //此处可以绑定页面dom事件

        var that = this;

        $("#btn_sgmn_close").click(function (e) {
            that.disableBase();
        });

        $("#sb").click(function (e) {
            //将数据传入后台

            toastr.info('上报成功');
        });

        $(".-l-a-info").mCustomScrollbar({ theme: "minimal-dark" });
        $("#sgmn_resultlist_view").mCustomScrollbar({ theme: "minimal-dark" });


        var leftProParams = {
            scale: ['00', 10, 20, 30, 40, 50, 60],   //刻度显示值
            scaleID: "#-process-bottom-scale",      //刻度标尺
            scaleUnit: "",                            //单位
            scaleInit: 0,                             //10分钟
            dragContainerID: "#process-bottom-drag",        //进度条&拖动容器
            containerWidthPX: 453,                           //总长度,
            coefficient: 10,                            //折算系数
        }
        this.processBar = new this._process(leftProParams, function ($process, scaleValue) {

        });


        $("#btn_sgmn_tsxd").click(function () {
            that.startTsxd();
        });
        $("#btn_sgmn_start").click(function () {
            if (that.isStart) {
                that.stopPlay();
            } else {
                that.startPlay(true);
            }
        });
        $("#btn_sgmn_back").click(function () {
            $("#view_sgmn_param").show();
            $("#view_sgmn_result").hide();

            that.stopPlay();
            that.iNow = 0;
            that.clear();
            that.setTimeSliderVal(0);
            that.clearResultLayers();
        });
        

        //所有tab切换
        $("#sgmn_resulttab li").click(function () {
            $(this).parents(".-tabs-ul").children("li").each(function () {
                $(this).removeClass("selected");
                $(this.getAttribute("link")).css("display", "none")
            })
            $(this).addClass("selected");
            var $curContainer = $(this.getAttribute("link"));
            if ($curContainer[0].nodeName == "DIV") {
                $(this.getAttribute("link")).css("display", "block");
            } else {
                $(this.getAttribute("link")).css("display", "table");
            }
        })

    },

    _process: function (params, callback) {
        var len = params.scale.length;
        var script = {

            scale: function () {
                var html = "",
				    scale = params.scale,
				    itemWidth = (params.containerWidthPX / (len - 1)).toFixed(0);
                for (var i = 0; i < len; i++) {
                    if (i != len - 1) {
                        html += "<li t=" + params.scale[i] + " style=width:" + (itemWidth) + "px>" + scale[i] + params.scaleUnit + "</li>"
                    }
                }
                $(params.scaleID).html(html);
            },
            drag: function () {
                //1m = ?PX
                var scaleToPX = parseFloat(params.containerWidthPX / ((len - 1) * params.coefficient));
                var initWidth = scaleToPX * params.scaleInit;

                var html =
                '<div class=-process-bar style="width:' + (initWidth + 10) + 'px;"></div>' +
                '<div class=-process-drag style="left:' + initWidth + 'px"></div>';

                $(params.dragContainerID).html(html);
                //$(params.scaleValueID).html(params.scaleInit + params.scaleUnit);
                script.changeStyle(params.scaleInit);

                $(params.dragContainerID).children(".-process-drag").dragging({
                    move: 'x',
                    moveHandler: function (X, Y) {
                        var scaleValue = parseInt((X / scaleToPX).toFixed(0));
                        // $(params.scaleValueID).html(scaleValue + params.scaleUnit);
                        var $process = $(this).parents("div");
                        $process.children(".-process-bar").css("width", X + 10);
                        $process.children(".-process-mark").css("left", X);

                        script.changeStyle(scaleValue);

                        if (callback != null) {
                            callback($process, scaleValue);
                        }
                    }
                });
            },
            setValue: function (val) {
                //1m = ?PX
                var scaleToPX = parseFloat(params.containerWidthPX / ((len - 1) * params.coefficient));
                var initWidth = scaleToPX * val;
                $(params.dragContainerID).children(".-process-bar").css("width", initWidth + 10);
                $(params.dragContainerID).children(".-process-mark").css("left", initWidth);

                script.changeStyle(val);
            },
            changeStyle: function (scaleValue) {
                $(params.scaleID).children().each(function (idx) {
                    var _scaleValue = parseInt(this.getAttribute("t"));
                    scaleValue > _scaleValue ? $(this).removeClass("-u-gray") : $(this).addClass("-u-gray");
                });
            }
        }
        script.scale();
        script.drag();

        return script;
    },

    setTimeSliderVal: function (minute) {
        this.processBar.setValue(minute);
    },
    activate: function () {
        //var layer = this.config.target;
        //this.point = layer.getLatLng();

        $("#view_sgmn").show();
        $("#view_sgmn_timebar").show();
    },
    disable: function () {
        this.stopPlay();

        this.clear();
        if (this.markerXY) {
            this.viewer.entities.remove(this.markerXY);
            this.markerXY = null;
        }

        $("#view_sgmn").hide();
        $("#view_sgmn_timebar").hide();
    },
    clear: function () {
        var viewer = this.viewer;
        $(this.entities).each(function (i, item) {
            viewer.entities.remove(item);
        });
        this.entities = [];

        this.clearResultLayers();

        viewer.mars.tooltip.close();
    },

    //图上选点
    point: null,
    markerXY: null,
    drawHandler: null,
    startTsxd: function () {
        this.endTsxd();

        var that = this;
        this.drawHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.drawHandler.setInputAction(function (movement) {
            var cartesian = mars3d.point.getCurrentMousePosition(that.viewer.scene, movement.position);
            if (cartesian) {
                var cartographic = Cesium.Cartographic.fromCartesian(cartesian);

                var jd = Number(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
                var wd = Number(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
                var height = Number(cartographic.height.toFixed(1));

                var val = { x: jd, y: wd, z: height };
                that.onMapClick_tsxd(val);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


        $('.cesium-viewer').css('cursor', 'crosshair');
    },
    endTsxd: function () {
        if (this.drawHandler == null) return;

        this.drawHandler.destroy();
        this.drawHandler = null;
        $('.cesium-viewer').css('cursor', '');
    },
    onMapClick_tsxd: function (point) {
        this.endTsxd();
        this.point = point;

        var position = Cesium.Cartesian3.fromDegrees(point.x, point.y, (point.z || 0));

        if (this.markerXY == null) {
            this.markerXY = this.viewer.entities.add({
                position: position,
                billboard: {
                    image: "img/marker/mark1.png",
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
                    scale: 0.6
                }
            });
        }
        else {
            this.markerXY.position = position;
        }

        $("#txt_sgmn_wz").val(point.x + "," + point.y);
    },
    //事故模拟
    entities: [],
    interval: -1,
    isStart: false,
    iNow: 0,        //开始时间
    iALLTime: 60,   //总时长时间
    iALL: 6,        //模拟总次数
    startPlay: function (isclear) {
        if (this.point == null) {
            // toastr.warning('请选择单击图上目标点后或进行图上选点后进行模拟！');
            toastr.warning('请在图上选择目标点后进行模拟！');
            return
        }

        var _fs = Number($("#txt_sgmn_fs").val()); //风速 m/s
        var _fx = Number($("#txt_sgmn_fx").val()); //风向
        //var _qy = Number($("#txt_sgmn_qy").val()); //气压
        //var _wd = Number($("#txt_sgmn_wd").val()); //温度
        //var _sd = Number($("#txt_sgmn_sd").val()); //温度
        var _sd = Number($('#txt_sgmn_speed').val()) //速度


        if (isNaN(_fs) || _fs == 0) {
            layer.tips('请填写有效风速数据', '#txt_sgmn_fs');
            return
        }
        if (isNaN(_fx) || _fx < 0 || _fx > 360) {
            layer.tips('请填写有效风向数据(0-360)', '#txt_sgmn_fx');
            return
        }
        if (isNaN(_sd) || _sd == 0) {
            layer.tips('请填写有效速度数据', '#txt_sgmn_speed');
            return
        }



        if (isclear) {
            this.iNow = 0;    //开始时间 
            this.clear();
            this.setTimeSliderVal(0);
            //if (this.iNow == this.iALL) this.iNow = 0;
        }

        this.isStart = true;
        $("#btn_sgmn_start").html('停止模拟');        
        $("#view_sgmn_param").hide();
        $("#view_sgmn_result").show();
        

        var speed = 15 / _sd;

        var that = this;
        this.interval = setInterval(function () {
            that.iNow++;

            if (that.iNow > that.iALL || that.iNow < 0) {
                that.stopPlay();
                return;
            }
            var time = (that.iNow / that.iALL) * that.iALLTime;
            that.setTimeSliderVal(time);
            that._addMnCicles(time, _fs, _fx);
        }, speed * 1000); //轮播的时间
    },
    pausePlay: function () {
        if (!this.isStart) return;

        clearInterval(this.interval);
        this.isStart = false;
    },
    stopPlay: function () {
        if (!this.isStart) return;
        $("#btn_sgmn_start").html('开始模拟');
        
 
        clearInterval(this.interval);
        this.isStart = false;
    },
    _last_cicle: null,
    _addMnCicles: function (_time, _fs, _fx) { //_time时间（分钟）,_fs 风速（m/s），_fx风向

        //此处加入公式，计算出半径
        var distance = (_time * 60 * _fs) / 1000; //公里 
        var bearing = _fx;
        var point = turf.point([this.point.x, this.point.y]);
        var newpoint = turf.destination(point, distance, bearing, { units: 'kilometers' });
        newpoint = { x: newpoint.geometry.coordinates[0], y: newpoint.geometry.coordinates[1], z: point.z };


        var radiusX = distance;
        var radiusY = distance * 0.6;
        var angle = 90 - _fx;

        //椭圆 
        var entity = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(newpoint.x, newpoint.y, newpoint.z),
            ellipse: {
                show: true,
                semiMajorAxis: radiusX * 1000,
                semiMinorAxis: radiusY * 1000,
                rotation: Cesium.Math.toRadians(angle),
                classificationType: Cesium.ClassificationType.BOTH,
                fill: true,
                material: new Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.4),
                outline: true,
                outlineColor: new Cesium.Color.fromCssColorString("#ffffff").withAlpha(0.7),
                outlineWidth: 2,
            }
        });
        this.entities.push(entity);

        this.viewer.flyTo(entity, { duration: 2 });

        this.pausePlay();//暂停

        //计算椭圆焦点
        var temp = (radiusX - radiusY) / 2;
        var pt1 = turf.destination(point, temp, bearing, { units: 'kilometers' });
        var pt2 = turf.destination(point, (radiusX + radiusY + temp), bearing, { units: 'kilometers' });

        this.queryALL({
            center: newpoint,           //中心点
            radiusX: radiusX * 1000,    //长半轴（米）
            radiusY: radiusY * 1000,    //短半轴（米）
            pt1: { x: pt1.geometry.coordinates[0], y: pt1.geometry.coordinates[1] },   //焦点1
            pt2: { x: pt2.geometry.coordinates[0], y: pt2.geometry.coordinates[1] },   //焦点2
        });
    },

    //查询
    queryALL: function (params) {
        var that = this;

        this.clearResultLayers();

        var tip = "影响范围：";
        if (params.radiusX < 1000)
            tip += params.radiusX + "米";
        else
            tip += (params.radiusX * 0.001).toFixed(2) + ' 公里';

        $("#lbl_sgmn_tip").html(tip);


        //查询数据 
        var isRunOKFor1 = false;
        var isRunOKFor2 = false;
        this.queryYwData(params, function () {
            isRunOKFor1 = true;
            if (isRunOKFor1 && isRunOKFor2) {
                //继续模拟
                that.startPlay();
            }
        });

        params.text = "政府机构$医疗$写字楼";   //参考http://lbsyun.baidu.com/index.php?title=lbscloud/poitags
        this.strartQueryPOI(params, function () {
            isRunOKFor2 = true;
            if (isRunOKFor1 && isRunOKFor2) {
                //继续模拟
                that.startPlay();
            }
        });

    },
 
    clearResultLayers: function () {
        this.clearResult1();
        this.clearResult2();
    },

    //查询1：查询自己后台服务的数据
    queryYwData: function (params, endfun) {
        //从后台查询数据（当前为模拟数据） 
        var arrdata = [];
        for (var j = 0; j < 300; j++) {
            var jd = params.center.x + 0.1 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
            var wd = params.center.y + 0.1 * Math.random() * (Math.random() > 0.5 ? 1 : -1);

            var attr = { id: j, name: '企业' + j, x: jd, y: wd };
            arrdata.push(attr);
        }

        //分析数据是否在椭圆内，并显示在椭圆内的数据 
        this.showYwResult(params, arrdata);

        //实际中，改为异步中执行endfun
        endfun();
    },
    showYwResult: function (params, arrdata) {
        var that = this;
        var viewHtml = ' <tr><th width="33">序号</th><th>名称</th></tr>';

        //椭圆
        var pt1 = Cesium.Cartesian3.fromDegrees(params.pt1.x, params.pt1.y);
        var pt2 = Cesium.Cartesian3.fromDegrees(params.pt2.x, params.pt2.y);
        var len = params.radiusX * 2;

        var counts = 0;
        that.objResult1 = {};
        $.each(arrdata, function (index, item) {
            var position = Cesium.Cartesian3.fromDegrees(item.x, item.y);

            var len1 = Cesium.Cartesian3.distance(position, pt1);
            var len2 = Cesium.Cartesian3.distance(position, pt2);
            if (len1 + len2 > len) { //不在椭圆内
                return;
            }

            counts++;

            //添加点 
            var entity = that.viewer.entities.add({
                position: position,
                point: {
                    color: new Cesium.Color.fromCssColorString("#3388ff"),
                    pixelSize: 6,
                    outlineColor: new Cesium.Color.fromCssColorString("#ffffff"),
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: item.name,
                    font: '12px Helvetica',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.AZURE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),   //偏移量  
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                },
                tooltip: item.name,
                data: item
            }); 

            var id = item.id;
            that.objResult1[id] = entity;

            viewHtml += ' <tr  onclick="zfdxSgmnWidget.showDetail1(\'' + id + '\')" > <td>' + counts + '</td>  <td>' + (item.name || '') + '</td></tr>';
        });

        $("#sgmn_qc_resulttalbe").html(viewHtml);
        $("#sgmn_qy_count").html(counts);
    },
    objResult1: {},

    clearResult1: function () {
        if (this.objResult1) {
            for (var j in this.objResult1) {
                var entity = this.objResult1[j];
                this.viewer.entities.remove(entity);
            }
            this.objResult1 = {};
        }
    }, 
    showDetail1: function (id) {
        viewer.mars.tooltip.close();

        var entity = this.objResult1[id];
        if (entity == null) return;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(entity.data.x, entity.data.y, 2500),
            duration: 3,
            orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 }
        });
        setTimeout(function () {
            viewer.mars.tooltip.show(entity, entity.position.getValue());
        }, 3000);

    },

    //查询百度POI
    configBaidu: {
        "key": [
            "lvsFAnTlp49TP7UaVPIszo0QLgIP5cB6",
            "kQY606iZtGceHbiT1eBSV5cdrgLMubPz",
            "ELixsGtZpn30pSDvCpTyhhW441r11s7Y",
            "3lyTGoSaiEo7Tt0803bfgMSN1FW53nws",
            "b3d3HfDObMaxViiGhmnvO8AnmFEdyysp",
            "HcNvY8ypUA88KliQkcvbR4g40kY4kboN",
        ],
        "url": "http://api.map.baidu.com/place/v2/search"
    },
    _key_index: 0,
    getKey: function () {
        var thisidx = (this._key_index++) % (this.configBaidu.key.length);
        return this.configBaidu.key[thisidx];
    },
    queryParam: {}, 
    strartQueryPOI: function (param, endfun) {
        this.queryParam = param;

        this.thispage = 1;
        this.queryPOI(endfun);
    },
    queryPOI: function (endfun) {
        var that = this;
        var key = this.getKey();

        $.ajax({
            url: this.configBaidu.url,
            type: "GET",
            dataType: "jsonp",
            async: false,
            timeout: "5000",
            contentType: "application/json;utf-8",
            data: {
                "output": "json",
                "ak": key,
                "scope": 2,
                "page_size": this.pageSize,
                "page_num": (this.thispage - 1),
                "query": this.queryParam.text || "",
                "tag": this.queryParam.type || "",
                "location": this.queryParam.center.y + "," + this.queryParam.center.x,    //周边检索中心点, lat<纬度>,lng<经度>
                "coord_type": 1,                            //wgs84 
                "radius": this.queryParam.radiusX            //周边检索半径，单位为米
            },
            success: function (data) {
                if (data.status !== 0) {
                    toastr.error("请求失败(" + data.status + ")：" + data.message);
                    if (endfun) endfun();
                    return;
                }
                that.showPOIPage(data.results, data.total);
                if (endfun) endfun();
            },
            error: function (data) {
                toastr.error("请求出错(" + data.status + ")：" + data.statusText);
                if (endfun) endfun();
            }
        });
    },
    pageSize: 20,   //默认为10条记录，最大返回20条。
    arrdata: [],
    counts: 0,
    allpage: 0,
    thispage: 0,
    showPOIPage: function (data, counts) {
        this.arrdata = data;
        this.counts = counts;
        if (this.counts < data.length) this.counts = data.length;
        this.allpage = Math.ceil(this.counts / this.pageSize);

        if (this.counts == 0) {
            // toastr.info('当前查询条件下没有找到相关结果！');
        }
        else {
            for (var index = 0; index < this.arrdata.length; index++) {
                var item = this.arrdata[index];
                var startIdx = (this.thispage - 1) * this.pageSize;
                item.index = startIdx + (index + 1);

                //this.objResultData[item.index] = item;
            };
        }

        this.showPOIArr(this.arrdata);
    },
    showFirstPage: function () {
        this.thispage = 1;
        this.queryPOI();
    },
    showNextPage: function () {
        this.thispage = this.thispage + 1;
        if (this.thispage > this.allpage) {
            this.thispage = this.allpage;
            toastr.info('当前已是最后一页了');
            return;
        }
        this.queryPOI();
    },

    showPretPage: function () {
        this.thispage = this.thispage - 1;
        if (this.thispage < 1) {
            this.thispage = 1;
            toastr.info('当前已是第一页了');
            return;
        }
        this.queryPOI();
    },
    showPOIArr: function (arrdata) {
        var that = this;
        var viewHtml = ' <tr><th width="33">序号</th><th>名称</th></tr>';

        //椭圆
        var pt1 = Cesium.Cartesian3.fromDegrees(this.queryParam.pt1.x, this.queryParam.pt1.y);
        var pt2 = Cesium.Cartesian3.fromDegrees(this.queryParam.pt2.x, this.queryParam.pt2.y);
        var len = this.queryParam.radiusX * 2;

        var counts = 0;
        that.clearResult2();
        that.objResult2 = {};
        $.each(arrdata, function (index, item) {
            var jd = item.location.lng;
            var wd = item.location.lat;

            var wgsMpt = mars3d.pointconvert.bd2wgs([jd, wd]);
            jd = wgsMpt[0];
            wd = wgsMpt[1];

            item.x = jd;
            item.y = wd;

            var position = Cesium.Cartesian3.fromDegrees(jd, wd);

            var len1 = Cesium.Cartesian3.distance(position, pt1);
            var len2 = Cesium.Cartesian3.distance(position, pt2);
            if (len1 + len2 > len) { //不在椭圆内
                return;
            }

            counts++;

            //添加点 
            var entity = that.viewer.entities.add({
                position: position,
                point: {
                    color: new Cesium.Color.fromCssColorString("#ffff00"),
                    pixelSize: 6,
                    outlineColor: new Cesium.Color.fromCssColorString("#ffffff"),
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: item.name,
                    font: '12px Helvetica',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.AZURE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),   //偏移量  
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
                },
                tooltip: item.name,
                data: item
            }); 

            var id = item.uid;
            that.objResult2[id] = entity;
             
            viewHtml += ' <tr  onclick="zfdxSgmnWidget.showDetail2(\'' + id + '\')" > <td>' + item.index + '</td>  <td>'
                + (item.name || '') + '</td> </tr>';
        });

        viewHtml += '<tr> <td colspan="2">  <div class="poipages"> <a href="javascript:zfdxSgmnWidget.showFirstPage()">首页</a> <a href="javascript:zfdxSgmnWidget.showPretPage()">&lt;</a>  <a href="javascript:zfdxSgmnWidget.showNextPage()">&gt;</a> </div> <div class="poipages" style="float:right;">' + this.thispage + '/' + this.allpage + '页 </div></td> </tr>';

        $("#sgmn_wz_resulttalbe").html(viewHtml);
        $("#sgmn_wz_count").html(counts);

    },
    objResult2: {},

    clearResult2: function () {
        if (this.objResult2) {
            for (var j in this.objResult2) {
                var entity = this.objResult2[j];
                this.viewer.entities.remove(entity);
            }
            this.objResult2 = {};
        }
    },
    showDetail2: function (id) {
        viewer.mars.tooltip.close();

        var entity = this.objResult2[id];
        if (entity == null) return;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(entity.data.x, entity.data.y, 2500),
            duration: 3,
            orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 }
        });
        setTimeout(function () {
            viewer.mars.tooltip.show(entity, entity.position.getValue());
        }, 3000);

    },



}));

