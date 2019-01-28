//模块：查询工具栏
var queryBarWidget = mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
   
    },
    //初始化[仅执行1次]
    create: function () {

    },

    //打开激活
    activate: function () {


    },
    //关闭释放
    disable: function () {


    },

    //智能提示
    autoTipList: function (text, calback) { 
        //未查询到数据时，执行 calback(); 继续百度poi查询
        var that = this;
        this._queryXzqh(text, function (arr) {
            var inhtml = "";
            for (var index = 0; index < arr.length; index++) {
                var name = arr[index].name;
                inhtml += "<li><i class='fa fa-search'></i><a href=\"javascript:queryBarWidget.autoSearch('" + name + "');\">" + name + "</a></li>";
            }

            if (arr.length < 10) {
                //=========查询poi============= 
                that._queryPOI(text, function (pois) {
                    for (var index = 0; index < pois.length; index++) {
                        var name = pois[index].name;
                        inhtml += "<li><i class='fa fa-search'></i><a href=\"javascript:queryBarWidget.autoSearch('" + name + "');\">" + name + "</a></li>";
                    }
                    if (pois.length < 10) {
                        //=========查询plot============= 
                        that._queryPlot(text, function (arrplot) {

                            for (var index = 0; index < arrplot.length; index++) {
                                var name = arrplot[index].name;
                                inhtml += "<li><i class='fa fa-search'></i><a href=\"javascript:queryBarWidget.autoSearch('" + name + "');\">" + name + "</a></li>";
                            }

                            if (inhtml.length > 0) {
                                $("#querybar_ul_autotip").html(inhtml);
                                $("#querybar_autotip_view").show();
                            }
                            else {
                                calback()
                            }

                        }, 10 - pois.length);
                        //=========查询plot end============= 
                    }
                    else {
                            $("#querybar_ul_autotip").html(inhtml);
                        $("#querybar_autotip_view").show();
                    }

                }, 10 - arr.length);
                //=========查询poi end============= 
            }
            else {
                    $("#querybar_ul_autotip").html(inhtml);
                    $("#querybar_autotip_view").show();
            }
        }, 10);

       
    },
    //开始查询
    strartQueryPOI: function (text, layer, calback) {
        this.dataSource = layer;

        //未查询到数据时，执行 calback(); 继续百度poi查询

        //查询
        var that = this;
        var arrData;
        this._queryXzqh(text, function (arr) {
            arrData = arr;

            that._queryPOI(text, function (pois) {
                arrData = arrData.concat(pois);

                that._queryPlot(text, function (plots) {
                    arrData = arrData.concat(plots);
                    if (arrData.length == 0) {
                        calback();
                    } else {
                        that.showResult(arrData);
                    }
                });
            });

        }, 10); 

    },

 
    //===================与后台交互======================== 
    //查询行政区划
    _queryXzqh: function (text, calback, maxcount) {

        $.ajax({
            url: this.path + "data/xzqh.json",
            type: "get",
            //data: { 
            //    "text": text, 
            //},
            success: function (data) {
                var pois = data.results;
                var arr = [];

                var counts = 0;
                for (var index = 0; index < pois.length; index++) {
                    var name = pois[index].name;
                    if (name.indexOf(text) == -1) continue;

                    pois[index]._datatype = "xzqh";
                    arr.push(pois[index]);

                    if (maxcount) {
                        counts++;
                        if (counts > maxcount) break;
                    }
                }

                calback(arr);
            },
            error: function (data) {
                toastr.error("请求行政区划出错(" + data.status + ")：" + data.statusText);
                calback([]);
            }
        });

    },

    //查询北京POI
    _queryPOI: function (text, calback, maxcount) {

        $.ajax({
            url: this.path +"data/poi.json",
            type: "get",
            //data: { 
            //    "text": text, 
            //},
            success: function (data) {
                var pois = data.results;
                var arr = [];

                var counts = 0;
                for (var index = 0; index < pois.length; index++) {
                    var name = pois[index].name;
                    if (name.indexOf(text) == -1) continue;

                    pois[index]._datatype = "poi";
                    arr.push(pois[index]);

                    if (maxcount) {
                        counts++;
                        if (counts > maxcount) break;
                    }
                }

                calback(arr);
            },
            error: function (data, b, c) {
                toastr.error("请求POI出错(" + data.status + ")：" + data.statusText);
                calback([]);
            }
        });

    },
    //查询plot标绘的
    _queryPlot: function (text, calback, maxcount) {
        var arr = [];
        var plotWidget = mars3d.widget.getClass('/we3dGIS/static/map/widgets/plot/widget.js');
        if (plotWidget) {
            arr = plotWidget.query(text, maxcount);
        }
        
        calback(arr);
    },
    // 根据输入框内容，查询显示列表 
    queryText: null,
 
    //===================显示查询结果处理======================== 
    pageSize: 6,
    arrdata: [],
    counts: 0,
    allpage: 0,
    thispage: 0,
    showResult: function (data) {
        this.arrdata = data;
        this.counts = data.length;
        this.allpage = Math.ceil(this.counts / this.pageSize);
        this.thispage = 1;
        this.showPOIPage();
    },
    showPOIPage: function () {
        var inhtml = "";
        if (this.counts == 0) {
            inhtml += '<div class="querybar-page"><div class="querybar-fl">没有找到"<strong>' + this.queryText + '</strong>"相关结果</div></div>';
        }
        else {
            var startIdx = (this.thispage - 1) * this.pageSize;
            var endIdx = startIdx + this.pageSize;
            if (endIdx >= this.counts) {
                endIdx = this.counts;
            }

            for (var index = startIdx; index < endIdx; index++) {
                var item = this.arrdata[index];
                item.index = startIdx + (index + 1);

                var _id = index;

                inhtml += '<div class="querybar-site" onclick="queryBarWidget.showDetail(\'' + _id + '\')"> <div class="querybar-sitejj"> <h3>'
                    + item.index + '、' + item.name + '</h3> <p>' + (item.addr || item.fullname || item.type|| '') + '</p> </div> </div>';

                this.objResultData[_id] = item;
            };


            //分页信息
            var _fyhtml;
            if (this.allpage > 1)
                _fyhtml = '<div class="querybar-ye querybar-fr">' + this.thispage + '/' + this.allpage + '页  <a href="javascript:queryBarWidget.showFirstPage()">首页</a> <a href="javascript:queryBarWidget.showPretPage()">&lt;</a>  <a href="javascript:queryBarWidget.showNextPage()">&gt;</a> </div>';
            else
                _fyhtml = '';

            //底部信息
            inhtml += '<div class="querybar-page"><div class="querybar-fl">找到<strong>' + this.counts + '</strong>条结果</div>' + _fyhtml + '</div>';
        }
        $("#querybar_resultlist_view").html(inhtml);
        $("#querybar_resultlist_view").show();


        this.showPOIArr(this.arrdata);

        if (this.counts == 1) {
            this.showDetail('0');
        }
    },
    showFirstPage: function () {
        this.thispage = 1;
        this.showPOIPage();
    },
    showNextPage: function () {
        this.thispage = this.thispage + 1;
        if (this.thispage > this.allpage) {
            this.thispage = this.allpage;
            toastr.warning('当前已是最后一页了');
            return;
        }
        this.showPOIPage();
    },

    showPretPage: function () {
        this.thispage = this.thispage - 1;
        if (this.thispage < 1) {
            this.thispage = 1;
            toastr.warning('当前已是第一页了');
            return;
        }
        this.showPOIPage();
    },
    //点击单个结果,显示详细
    objResultData: {},
    showDetail: function (id) {
        var item = this.objResultData[id];

        this.centerAt(item);
    },
    dataSource: null,
    getWorkLayer: function () {
        if (this.dataSource == null) {
            this.dataSource = new Cesium.CustomDataSource();
            this.viewer.dataSources.add(this.dataSource);
        }
        return this.dataSource;
    },
    clearLayers: function () {
        if (this.dataSource == null) return;
        this.dataSource.entities.removeAll();
        viewer.mars.popup.close();
    },
    showPOIArr: function (arr) {
        var that = this;
        var layer = this.getWorkLayer();
        this.clearLayers();


        $(arr).each(function (i, item) {
            var jd = item.x || item.jd;
            var wd = item.y || item.wd;
            var gd = item.gd || 0;

            //===========无坐标数据=========== 
            if (isNaN(jd) || jd == 0 || isNaN(wd) || wd == 0)
                return;

            item.JD = jd;
            item.WD = wd;

            //==================构建图上目标单击后显示div=================  
            var inhtml;
            if (item._datatype == "poi") {
                inhtml = viewer.mars.popup.getPopup([
                    { "field": "type", "name": "类型" },
                    { "field": "tel", "name": "电话" },
                    { "field": "addr", "name": "地址" },
                ], item, item.name);
            }
            else if (item._datatype == "xzqh") {
                inhtml = viewer.mars.popup.getPopup([
                    { "field": "id", "name": "编码" },
                    { "field": "fullname", "name": "全称" },
                ], item, item.name);
            }
            else if (item._datatype == "plot") {
                inhtml = viewer.mars.popup.getPopup([ 
                    { "field": "type", "name": "类型" },
                ], item, item.name);
            }

            //==============================================================

            //添加实体
            var entity = that.dataSource.entities.add({
                name: item.name,
                position: Cesium.Cartesian3.fromDegrees(jd, wd, gd),
                point: {
                    color: new Cesium.Color.fromCssColorString("#3388ff"),
                    pixelSize: 10,
                    outlineColor: new Cesium.Color.fromCssColorString("#ffffff"),
                    outlineWidth: 2,
                    heightReference: gd == 0 ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE,     //贴地
                    scaleByDistance: new Cesium.NearFarScalar(1000, 1, 1000000, 0.1)
                },
                label: {
                    text: item.name,
                    font: '16px Helvetica',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.AZURE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -10),   //偏移量  
                    heightReference: gd == 0 ? Cesium.HeightReference.CLAMP_TO_GROUND : Cesium.HeightReference.NONE,     //贴地
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 200000)
                },
                data: item,
                popup: {
                    html: inhtml,
                    anchor: [0, -12],
                }
            });

            item._entity = entity;
        });

        if (arr.length > 1)
            that.viewer.flyTo(that.dataSource.entities, { duration: 3 });

    },
    centerAt: function (item) {
        var entity = item._entity;
        if (entity == null) {
            toastr.warning(item.name + " 无经纬度坐标信息！");
            return;
        }

        var height = 3000;

        if (item._datatype == "poi") {
            viewer.mars.centerAt({ x: item.JD, y: item.WD, minz: height });
        }
        else if (item._datatype == "xzqh") {
            viewer.mars.centerAt({ x: item.JD, y: item.WD, minz: height });
            this.centerAtRegion(item.id, item.xh);
        }
        else if (item._datatype == "plot") {
            if (entity.billboard || entity.label || entity.point) {
                var position = entity.position.getValue();
                var carto = Cesium.Cartographic.fromCartesian(position);

                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height + height),
                    duration: 3,
                    orientation: { heading: 0, pitch: Cesium.Math.toRadians(-90), roll: 0 }
                });
            } else {
                viewer.flyTo(entity);           
            }  
        }


        setTimeout(function () {
            viewer.mars.popup.show(entity, entity.position.getValue());
        }, 3000);
    },
    //=======================定位至指定区域=======================
    centerAtRegion: function (dmnm, dmxh) { 
        var jsonurl;
        var dmxh;
        if (dmnm.substring(2) == "0000") {//省
            jsonurl = "sheng/china.json";
        }
        else if (dmnm.substring(4) == "00") {//市
            jsonurl = "shi/" + dmnm.substring(0, 2) + ".json";
        }
        else {//县区
            jsonurl = "xian/" + dmnm.substring(0, 4) + "00.json"; 
        }

        var that = this;

        $.getJSON('widgets/navXZQH/xzqhdata/'+jsonurl, function (geojson) {
            if (!that.isActivate) return;

            var length = geojson.features.length;
            for (var index = 0; index < length; index++) {
                if (geojson.features[index].properties.id == dmxh) {
                    that.showRegionExtent(geojson.features[index]);
                    break;
                }
            };
        });
         
    },
    last_region: null,
    clearLastRegion: function () {
        if (this.last_region != null) {
            this.viewer.dataSources.remove(this.last_region);
            this.last_region = null;
        }
        if (this.last_timetemp != -1) {
            clearTimeout(this.last_timetemp);
            this.last_timetemp = -1;
        }
    },
    last_timetemp: -1,
    showRegionExtent: function (feature) {
        this.clearLastRegion();

        var that = this;
        var dataSource = Cesium.GeoJsonDataSource.load(feature, {
            clampToGround:true,
            stroke: new Cesium.Color.fromCssColorString("#ffffff"),
            strokeWidth: 2,
            fill: new Cesium.Color.fromCssColorString("#ffff00").withAlpha(0.5)
        });
        dataSource.then(function (dataSource) {
            that.viewer.dataSources.add(dataSource);
            that.last_region = dataSource;

            that.viewer.flyTo(dataSource.entities.values, { duration: 2 });
        }).otherwise(function (error) {
            toastr.error(error);
        });


        //定时清除
        var that = this;
        this.last_timetemp = setTimeout(function () {
            that.clearLastRegion();
        }, 5000);
    },


   







}));