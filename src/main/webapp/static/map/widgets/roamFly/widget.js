/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 230,
                height: 520,
                //maxmin: true,
            }
        },
    },
    //初始化[仅执行1次]
    create: function () {

    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        //layer.min(opt._layerIdx); //最小化窗口


        this.viewWindow = result;
    },
    //打开激活
    activate: function () {
        var lineData = this.config.data; //传入的预设路线

        this.createTimeLine();
        this.start(lineData);
    },
    //关闭释放
    disable: function () {
        this.viewWindow = null;
        this.charsCacheData = null;

        this.stop();
        this.removeTimeLine();
    },
    //返回列表widget
    toRoamLine: function () {
        this.stop();

        mars3d.widget.activate({
            uri: '/we3dGIS/static/map/widgets/roamLine/widget.js',
        });
    },
    //界面更新参数
    getAttr: function () {
        return this.config.data.properties.attr;
    },
    updateAttr: function (params) {
        for (var i in params) {
            this.flyEntity.data.properties.attr[i] = params[i];
        }
    },

    //飞行 
    flyEntity: null, //飞机实体（模型）
    stop: function () {
        this.viewer.trackedEntity = undefined;
        this.viewer.scene.preRender.removeEventListener(this.preRender_eventHandler, this);

        if (this.flyEntity) {
            this.viewer.entities.remove(this.flyEntity);
            this.flyEntity = null;
        }
        if (this.wallEntity) {
            this.viewer.entities.remove(this.wallEntity);
            this.wallEntity = null;
        }
        mars3d.widget.disable(this.charsWidgetUri);
    },
    start: function (lineData) {
        var attr = lineData.properties.attr;

        //=====================计算飞行时间及坐标====================
        var property = new Cesium.SampledPositionProperty();
        var startTime = Cesium.JulianDate.fromDate(new Date());  //飞行开始时间
        var stopTime;               //飞行结束时间 

        var lonlats = lineData.geometry.coordinates;
        if (lonlats.length < 2) {
            toastr.error('路线无坐标数据，无法漫游！');
            return;
        }

        var speeds = lineData.properties.speed;
        var isSpeedArray = !haoutil.isutil.isNumber(speeds);
        if (lonlats.length == 2) {
            //需要插值，否则穿地 
            var centerPt = this.getPointForLineAlong(lonlats[0], lonlats[1], 0, 0.5);
            lonlats.splice(1, 0, centerPt);
            if (speeds && isSpeedArray)
                speeds.splice(1, 0, speeds[0]);
        }
        var defSpeed = 100; //无速度值时的 默认速度

        var alltimes = 0; //总时长,秒
        var alllen = 0;  //总长度,千米

        var lastPoint;
        var arrLinePoint = [];
        for (var i = 0, length = lonlats.length; i < length; i++) {
            var lonlat = lonlats[i];
            var item = Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], lonlat[2] || 0);
            item.lonlat = lonlat;

            if (i == 0) {//起点
                var sTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());
                item.time = sTime;
                property.addSample(sTime, item);
                lastPoint = item;
            }
            else if (i == lonlats.length - 1) {
                var speed = isSpeedArray ? (speeds ? speeds[i - 1] : defSpeed) : (speeds || defSpeed);
                var len = Cesium.Cartesian3.distance(item, lastPoint) / 1000;
                var stepTime = (len / speed) * 3600;
                alltimes += stepTime;
                alllen += len;

                var sTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());
                item.time = sTime;
                property.addSample(sTime, item);
            }
            else { //中间点，计算转弯处弧线
                var speed = isSpeedArray ? (speeds ? speeds[i - 1] : defSpeed) : (speeds || defSpeed);    //1千米/时 =  1/3.6 米/秒
                //speed = speed * 0.8;//转弯处降速 

                var arrBezier = this.getBezierSpline(lonlats[i - 1], lonlat, lonlats[i + 1]);
                for (var j = 0; j < arrBezier.length; j++) {
                    var itemBezier = arrBezier[j];
                    var len = Cesium.Cartesian3.distance(itemBezier, lastPoint) / 1000;
                    var stepTime = (len / speed) * 3600;
                    alltimes += stepTime;
                    alllen += len;

                    var sTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());
                    item.time = sTime;
                    property.addSample(sTime, itemBezier);
                    lastPoint = itemBezier;
                }
            }
            arrLinePoint.push(item);
        }

        this.arrLinePoint = arrLinePoint;
        stopTime = Cesium.JulianDate.addSeconds(startTime, alltimes, new Cesium.JulianDate());

        //显示基本信息，名称、总长、总时间
        this.viewWindow.showAllInfo({
            name: attr.name,
            alllen: alllen * 1000,
            alltime: alltimes
        });

        //=====================绑定clock timeline==================== 
        this.viewer.clock.startTime = startTime.clone();
        this.viewer.clock.stopTime = stopTime.clone();
        this.viewer.clock.currentTime = startTime.clone();
        this.viewer.clock.multiplier = 1;//飞行速度 
        this.viewer.clock.shouldAnimate = true;

        if (attr.clockRange)
            this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //到达终止时间后循环
        else
            this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; //到达终止时间后停止
        //this.viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED; //达到终止时间后继续读秒

        if (this.viewer.timeline)
            this.viewer.timeline.zoomTo(startTime, stopTime);
        else if (this.timeline)
            this.timeline.zoomTo(startTime, stopTime);
        //=====================构造飞行对象====================  
        var entityAttr = {
            id: lineData.id,
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: startTime,
                stop: stopTime
            })]),
            position: property,
            orientation: new Cesium.VelocityOrientationProperty(property), //基于移动位置自动计算方位

            data: lineData
        };

        if (attr.showLabel) {//是否显示注记
            entityAttr.label = {
                text: lineData.name,
                font: '14px Helvetica',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.AZURE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scaleByDistance: new Cesium.NearFarScalar(1000, 1, 500000, 0.5),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000),
            };
        }

        if (attr.showLine) {//是否显示路线
            entityAttr.path = {
                resolution: 1,
                material: new Cesium.Color.fromCssColorString(lineData.properties.style.color).withAlpha(0.4),
                width: 1.5,
                leadTime: 0,
                trailTime: alltimes
            };
        }
        //漫游对象
        switch (attr.point) {
            default://必须有对象，否则viewer.trackedEntity无法跟随
                entityAttr.point = {
                    color: new Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.01),
                    pixelSize: 1
                };
                break;
            case "point":
                entityAttr.point = {
                    color: new Cesium.Color.fromCssColorString(lineData.properties.style.color).withAlpha(0.8),
                    pixelSize: 6
                };
                if (entityAttr.label)
                    entityAttr.label.pixelOffset = new Cesium.Cartesian2(10, -30); //偏移量   
                break;

            case "model_car"://汽车模型   
                entityAttr.model = {
                    uri: '../data/gltf/qiche.gltf',
                    scale: 0.2,
                    minimumPixelSize: 50
                };
                if (entityAttr.label)
                    entityAttr.label.pixelOffset = new Cesium.Cartesian2(70, -30); //偏移量   
                break;
            case "model_air"://飞机模型
                entityAttr.model = {
                    uri: '../data/gltf/feiji.glb',
                    scale: 0.1,
                    minimumPixelSize: 50
                };
                if (entityAttr.label)
                    entityAttr.label.pixelOffset = new Cesium.Cartesian2(60, -30); //偏移量   
                break;
            //case "model_j10"://歼十模型
            //    entityAttr.model = {
            //        uri: '../data/gltf/j10/j10.gltf',
            //        scale: 50,
            //        minimumPixelSize: 50
            //    };
            //    if (entityAttr.label)
            //        entityAttr.label.pixelOffset = new Cesium.Cartesian2(60, -30); //偏移量   
            //    break;
            case "model_weixin"://卫星模型
                entityAttr.model = {
                    uri: '../data/gltf/weixin.gltf',
                    scale: 1,
                    minimumPixelSize: 100
                };
                if (entityAttr.label)
                    entityAttr.label.pixelOffset = new Cesium.Cartesian2(60, -30); //偏移量   
                break;

        }

        this.flyEntity = this.viewer.entities.add(entityAttr);

        //插值，使折线边平滑 ,并且长距离下不穿地
        this.flyEntity.position.setInterpolationOptions({
            interpolationDegree: 2,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
        });

        this.viewer.trackedEntity = this.flyEntity;


        this.viewer.scene.preRender.addEventListener(this.preRender_eventHandler, this);
    },
    //实时监控事件
    scratch: new Cesium.Matrix4(),
    preRender_eventHandler: function (e) {
        if (!this.isActivate || this.viewWindow == null || this.flyEntity == null) return;

        var attr = this.flyEntity.data.properties.attr;

        //视角处理
        switch (attr.cameraType) {
            default: //无 
                if (this.viewer.trackedEntity != undefined)
                    this.viewer.trackedEntity = undefined;

                if (this.flyEntity.model)
                    this.flyEntity.model.show = true;
                break;

            case "gs"://跟随视角
                if (this.viewer.trackedEntity != this.flyEntity)
                    this.viewer.trackedEntity = this.flyEntity;

                if (this.flyEntity.model)
                    this.flyEntity.model.show = true;
                break;
            case "dy"://锁定第一视角
                if (this.viewer.trackedEntity != this.flyEntity)
                    this.viewer.trackedEntity = this.flyEntity;

                this.getModelMatrix(this.viewer.trackedEntity, this.viewer.clock.currentTime, this.scratch);

                var transformX = attr.followedX;    //距离运动点的距离（后方） 
                var transformZ = attr.followedZ;    //距离运动点的高度（上方）
                this.viewer.scene.camera.lookAtTransform(this.scratch, new Cesium.Cartesian3(-transformX, 0, transformZ));


                if (this.flyEntity.model)
                    this.flyEntity.model.show = (transformZ != 0);

                break;
            case "sd"://锁定上帝视角 
                if (this.viewer.trackedEntity != this.flyEntity)
                    this.viewer.trackedEntity = this.flyEntity;

                this.getModelMatrix(this.viewer.trackedEntity, this.viewer.clock.currentTime, this.scratch);

                var transformZ = attr.followedZ;    //距离运动点的高度（上方）
                this.viewer.scene.camera.lookAtTransform(this.scratch, new Cesium.Cartesian3(-1, 0, transformZ));

                if (this.flyEntity.model)
                    this.flyEntity.model.show = true;
                break;
        }

        //当前点
        var position = Cesium.Property.getValueOrUndefined(this.flyEntity.position, this.viewer.clock.currentTime, this.positionScratch);
        if (position) {
            //实时监控
            this.realTime(position);
        }
    },
    realTime: function (position) {
        var attr = this.flyEntity.data.properties.attr;

        var point = mars3d.point.formatPositon(position);

        var time = (this.viewer.clock.currentTime.dayNumber - this.viewer.clock.startTime.dayNumber) * 24 * 60 * 60
            + this.viewer.clock.currentTime.secondsOfDay - this.viewer.clock.startTime.secondsOfDay;//已飞行时间

        var flyOk = this.getFlyOkPoints(position);
        this.updateCharsWidgeFlyOk(flyOk.len);//更新剖面图      
        if (attr.showShadow) {  //投影 
            this.updateWall(flyOk.positions);
        }

        this.viewWindow.showRealTimeInfo({
            time: time,
            len: flyOk.len,
            x: point.x,
            y: point.y,
            z: point.z,
        });

        //if (window.parent && window.parent.postMessage) {
        //    point.type = "roam";
        //    window.parent.postMessage(point, 'http://localhost:8090/');
        //}


        //var height;
        //if (this.viewer.scene.sampleHeightSupported) {
        //    height = this.viewer.scene.sampleHeight(Cesium.Cartographic.fromCartesian(position), [this.flyEntity]);
        //} 

        //求地面海拔
        var that = this;
        mars3d.util.terrainPolyline({
            viewer: that.viewer,
            positions: [position, position],
            calback: function (raisedPositions, noHeight) {
                if (!that.isActivate) return;
                if (raisedPositions == null || raisedPositions.length == 0 || noHeight) {
                    that.viewWindow.showHeightInfo(null);
                    return;
                }

                var hbgd = mars3d.point.formatPositon(raisedPositions[0]).z; //地面高程
                var fxgd = point.z;     //飞行高度
                var ldgd = fxgd - hbgd; //离地高度


                var hbgd_str = haoutil.str.formatLength(hbgd);
                var fxgd_str = haoutil.str.formatLength(fxgd);
                var ldgd_str = haoutil.str.formatLength(ldgd);

                var result = "漫游高程：" + fxgd_str;

                var hasWarn = false;
                if (attr.showHeightWarn && attr.warnHeight) {
                    result += "\n离地距离：" + ldgd_str;
                    if (ldgd <= attr.warnHeight) {
                        hasWarn = true;
                        result += "【低于报警高度】";
                    }
                }
                else {
                    result += "\n地面高程：" + hbgd;
                }

                if (that.flyEntity.label)
                    that.flyEntity.label.text = that.flyEntity.data.name + "\n" + result;

                //界面显示
                that.viewWindow.showHeightInfo({
                    hbgd_str: hbgd_str,
                    ldgd_str: ldgd_str,
                    showHeightWarn: attr.showHeightWarn,
                    hasWarn: hasWarn
                });
            }
        });




    },

    //锁定视角计算
    matrix3Scratch: new Cesium.Matrix3(),
    positionScratch: new Cesium.Cartesian3(),
    orientationScratch: new Cesium.Quaternion(),
    getModelMatrix: function (entity, time, result) {
        if (entity == null) return result;

        var position = Cesium.Property.getValueOrUndefined(entity.position, time, this.positionScratch);
        if (!Cesium.defined(position)) {
            return undefined;
        }

        var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, this.orientationScratch);
        if (!Cesium.defined(orientation)) {
            result = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, result);
        } else {
            result = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, this.matrix3Scratch), position, result);
        }
        return result;
    },

    //显示剖面
    charsWidgetUri: '/we3dGIS/static/map/widgets/roamChars/widget.js',
    charsCacheData: null,
    showHeightChars: function () {
        if (this.charsCacheData) {
            this.updateCharsWidge(this.charsCacheData);
        }
        else {
            var that = this;
            this.getTerrainHeight(function (data) {
                that.charsCacheData = data;
                that.updateCharsWidge(data);
            });
        }
    },
    updateCharsWidge: function (data) {
        mars3d.widget.activate({
            uri: this.charsWidgetUri,
            data: data
        });
    },
    updateCharsWidgeFlyOk: function (alllen) {
        var roamingJK = mars3d.widget.getClass(this.charsWidgetUri);
        if (roamingJK && roamingJK.isActivate) {
            roamingJK.changeFlyOk(alllen);
        }
    },
    getTerrainHeight: function (calback) {
        var that = this;
        var positions = this.arrLinePoint;
        var attr = this.flyEntity.data.properties.attr;

        var alllen = 0;
        var arrLength = [];
        var arrHbgd = [];
        var arrFxgd = [];
        var arrPoint = [];

        var arrBjgd;
        if (attr.showHeightWarn && attr.warnHeight)
            arrBjgd = [];

        var index = 0;
        function getLineFD() {
            index++;

            var arr = [positions[index - 1], positions[index]];
            mars3d.util.terrainPolyline({
                viewer: viewer,
                positions: arr,
                calback: function (raisedPositions, noHeight) {
                    if (!that.isActivate) return;

                    var h1 = positions[index - 1].lonlat[2];
                    var h2 = positions[index].lonlat[2];
                    var hstep = (h2 - h1) / raisedPositions.length;

                    for (var i = 0; i < raisedPositions.length; i++) {
                        //已飞行长度
                        if (i != 0) {
                            alllen += Cesium.Cartesian3.distance(raisedPositions[i], raisedPositions[i - 1]);
                        }
                        arrLength.push(Number(alllen.toFixed(1)));

                        //坐标
                        var point = mars3d.point.formatPositon(raisedPositions[i]);
                        arrPoint.push(point);

                        //海拔高度
                        var hbgd = noHeight ? 0 : point.z;
                        arrHbgd.push(hbgd);

                        //飞行高度
                        var fxgd = Number((h1 + hstep * i).toFixed(1));
                        arrFxgd.push(fxgd);

                        //报警高度
                        arrBjgd && arrBjgd.push(hbgd + attr.warnHeight);
                    }


                    if (index >= positions.length - 1) {
                        calback({
                            arrLength: arrLength,
                            arrFxgd: arrFxgd,
                            arrHbgd: arrHbgd,
                            arrPoint: arrPoint,
                            arrBjgd: arrBjgd
                        });
                    }
                    else {
                        getLineFD();
                    }
                }
            });
        }
        getLineFD();

    },

    //投影
    wallEntity: null,
    updateWall: function (positions) {
        var newposition = [];
        var minimumHeights = [];
        var maximumHeights = [];
        for (var i = 0; i < positions.length; i++) {
            newposition.push(positions[i].clone());
            var carto = Cesium.Cartographic.fromCartesian(positions[i]);
            minimumHeights.push(0);
            maximumHeights.push(carto.height);
        }
        this._wall_positions = newposition;
        this._wall_minimumHeights = minimumHeights;
        this._wall_maximumHeights = maximumHeights;

        if (!this.wallEntity) {
            var that = this;
            var wallattr = mars3d.draw.attr.wall.style2Entity({ "color": "#d7e600", "outline": false, "opacity": 0.5 });
            wallattr.minimumHeights = new Cesium.CallbackProperty(function (time) {
                return that._wall_minimumHeights
            }, false);
            wallattr.maximumHeights = new Cesium.CallbackProperty(function (time) {
                return that._wall_maximumHeights
            }, false);
            wallattr.positions = new Cesium.CallbackProperty(function (time) {
                var position = Cesium.Property.getValueOrUndefined(that.flyEntity.position, that.viewer.clock.currentTime, that.positionScratch);
                that._wall_positions[that._wall_positions.length - 1] = position;

                return that._wall_positions
            }, false);

            this.wallEntity = this.viewer.entities.add({
                wall: wallattr,
            });
        }
    },

    //获取已飞行完成的点
    getFlyOkPoints: function (position) {
        var arrnew = [];
        var alllen = 0;

        var thistime = this.viewer.clock.currentTime;
        var arr = this.arrLinePoint;
        for (var i = 0, length = arr.length; i < length; i++) {
            var item = arr[i];
            if (item.time.dayNumber > thistime.dayNumber || item.time.secondsOfDay > thistime.secondsOfDay) {
                var len = Cesium.Cartesian3.distance(position, i == 0 ? item : arr[i - 1]);
                alllen += len;
                break;
            }
            if (i > 0) {
                var len = Cesium.Cartesian3.distance(item, arr[i - 1]);
                alllen += len;
            }
            arrnew.push(item);
        }
        arrnew.push(position);

        return {
            positions: arrnew,
            len: alllen
        };
    },
    //计算转弯
    getBezierSpline: function (pt1, pt2, pt3) {
        var npt1 = this.getPointForLineAlong(pt2, pt1, 300, 0.2);
        var npt2 = this.getPointForLineAlong(pt2, pt1, 200, 0.1);

        var npt3 = this.getPointForLineAlong(pt2, pt3, 200, 0.1);
        var npt4 = this.getPointForLineAlong(pt2, pt3, 300, 0.2);

        var line = turf.lineString([npt1, npt2, pt2, npt3, npt4]);
        var feature = turf.bezierSpline(line, { sharpness: 0.5 });

        var lonlats = [];
        var h2 = pt2[2];
        for (var i = 0; i < feature.geometry.coordinates.length; i++) {
            var item = feature.geometry.coordinates[i];
            lonlats.push(Number(item[0]));
            lonlats.push(Number(item[1]));
            lonlats.push(h2);
        }
        var positions = Cesium.Cartesian3.fromDegreesArrayHeights(lonlats);

        //this.viewer.entities.add({ polyline: { positions: positions,  width: 5,   } }); //test

        return positions;
    },
    //求在P1点到P2点的线上，距离P1点len米长度的点
    getPointForLineAlong: function (p1, p2, len, bl) {
        var point1 = Cesium.Cartesian3.fromDegrees(p1[0], p1[1], p1[2] || 0)
        var point2 = Cesium.Cartesian3.fromDegrees(p2[0], p2[1], p2[2] || 0)

        var alllen = Cesium.Cartesian3.distance(point1, point2); //米
        if (len == 0 || len >= alllen * bl) len = alllen * bl;

        var line = turf.lineString([p1, p2]);
        var along1 = turf.along(line, len / 1000, { units: 'kilometers' });
        var jd = along1.geometry.coordinates[0];
        var wd = along1.geometry.coordinates[1];

        var h1 = p1[2];
        var h2 = p2[2];
        var height = h1 + (h2 - h1) * len / alllen;

        return [jd, wd, height];
    },

    //创建时间控制
    createTimeLine: function () {
        var viewerContainer = this.viewer._element;
        if (!this.viewer.animation) {  // Animation 
            var animationContainer = document.createElement('div');
            animationContainer.className = 'cesium-viewer-animationContainer';
            viewerContainer.appendChild(animationContainer);
            var animation = new Cesium.Animation(animationContainer, new Cesium.AnimationViewModel(this.viewer.clockViewModel));
            this.animation = animation;
        }
        if (!this.viewer.timeline) {    // Timeline 
            var timelineContainer = document.createElement('div');
            timelineContainer.className = 'cesium-viewer-timelineContainer';
            timelineContainer.style.right = '0px';
            viewerContainer.appendChild(timelineContainer);
            var timeline = new Cesium.Timeline(timelineContainer, this.viewer.clock);
            timeline.addEventListener('settime', this.onTimelineScrubfunction, false);
            timeline.zoomTo(this.viewer.clock.startTime, this.viewer.clock.stopTime);
            this.timeline = timeline;
        }

        this.locationOldCss = $("#location_mars_jwd").css(['left', 'bottom']);
        $("#location_mars_jwd").css({ left: '170px', bottom: '25px' });


        this.legendOldCss = $(".distance-legend").css(['left', 'bottom']);
        $(".distance-legend").css({ "left": "150px", "bottom": "25px", });
    },
    onTimelineScrubfunction: function (e) {
        var clock = e.clock;
        clock.currentTime = e.timeJulian;
        clock.shouldAnimate = false;
    },
    removeTimeLine: function () {
        if (this.timeline)
            this.timeline.removeEventListener('settime', this.onTimelineScrubfunction, false);

        try {
            var viewerContainer = this.viewer._element;
            if (this.animation) {
                viewerContainer.removeChild(this.animation.container);
                this.animation.destroy();
                this.animation = null;
            }
            if (this.timeline) {
                viewerContainer.removeChild(this.timeline.container);
                this.timeline.destroy();
                this.timeline = null;
            }
            $("#location_mars_jwd").css(this.locationOldCss);
            $(".distance-legend").css(this.legendOldCss);
        }
        catch (e) {
            console.log(e);
        }
    }




}));

