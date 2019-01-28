//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    //初始化[仅执行1次]
    create: function () {
        var that = this;
        this.layer = new mars3d.layer.CustomFeatureGridLayer({
            minimumLevel: 13, //限定层级，只加载该层级下的数据。
            debuggerTileInfo: false,
            getDataForGrid: function (opts, calback) {
                //获取网格内的数据，calback为回调方法，参数传数据数组  
                that.getDataForGrid(opts, calback);
            },
            createEntity: function (opts, attributes) {
                //根据数据创造entity
                return that.createEntity(opts, attributes);
            },
            updateEntity: function (enetity, attributes) {
                //更新entity（动态数据时有用）
                that.updateEntity(enetity, attributes);
            },
        }, viewer);
    },
    timetik: -1,
    //打开激活
    activate: function () {
        viewer.mars.centerAt({ "y": 22.79982, "x": 113.607394, "z": 8315.9, "heading": 334.1, "pitch": -66.1, "roll": 359.9 });
        this.layer.setVisible(true);

        var that = this;
        this.timetik = setInterval(function () {
            that.layer.reload();
        }, 5000);
    },
    //关闭释放
    disable: function () {
        clearInterval(this.timetik);

        this.layer.setVisible(false);
    },
    getDataForGrid: function (opts, calback) {
        var url = 'http://enav.ngscs.org/enavpre/cn/com/hoonsoft/servlet/ServletAction?handleClassName=aisall';

        var xy = opts.rectangle.xmin + "," + opts.rectangle.ymin + "," + opts.rectangle.xmax + "," + opts.rectangle.ymax;

        var that = this;
        $.ajax({
            url: url,
            type: "POST",
            dataType: 'json',
            timeout: 10000,
            data: {
                "xy": xy
            },
            success: function (data) {
                if (!that.isActivate) return;

                var arrdata = data.ais;
                var newarr = [];
                for (var index = 0, len = arrdata.length; index < len; index++) {
                    var item = arrdata[index];

                    var mmsi = item[0];
                    var jd = Number(item[2]);
                    var wd = Number(item[3]);
                    if (isNaN(jd) || jd == 0 || isNaN(wd) || wd == 0)
                        continue;

                    newarr.push({
                        id: mmsi, mmsi: mmsi, name: item[1], x: jd, y: wd,
                        trueHead: (Number(item[4]) || 0), sog: item[5], type: item[6], length: item[7]
                    });
                }
                if (newarr.length == 0) return;

                calback(newarr);
            },
            error: function (data) {
                console.log("ais 请求出错(" + data.status + ")：" + data.statusText);
            }
        });
    },
    createEntity: function (opts, attributes) {

        //添加实体
        var entity = this.layer.dataSource.entities.add({
            name: attributes.name,
            position: Cesium.Cartesian3.fromDegrees(attributes.x, attributes.y),
            billboard: {
                image: this.getShipIcon(attributes.type, attributes.sog, attributes.length),
                scale: 1,
                rotation: Cesium.Math.toRadians(attributes.trueHead - 90),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,   //CLAMP_TO_GROUND RELATIVE_TO_GROUND,
                scaleByDistance: new Cesium.NearFarScalar(1000, 1, 10000000, 0.1)
            },
            label: {
                text: attributes.name,
                font: '8px Helvetica',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.AZURE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20),   //偏移量  
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, //是地形上方的高度 
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 9000)
            },
            data: attributes,
            popup: {
                html: function (entity) {
                    var attributes = entity.data;
                    var inthtml = '<div>船名：' + attributes.name + '</div>'
                               + '<div>MMSI：' + attributes.mmsi + '</div>'
                               + '<div>船速：' + attributes.sog + 'kts</div>';

                    return inthtml;
                },
                anchor: [0, -12],
            }
        });

        return entity;
    },
    updateEntity: function (enetity, attributes) {
        //更新
        enetity.position = Cesium.Cartesian3.fromDegrees(attributes.x, attributes.y);
        enetity.billboard.rotation = Cesium.Math.toRadians(attributes.trueHead - 90); 
        enetity.billboard.image = this.getShipIcon(attributes.type, attributes.sog, attributes.length);
        enetity.data = attributes;
    },
    getShipIcon: function (type, sog, length) {
        var sogNum;
        var height;
        if (sog == undefined || sog == "") {
            sogNum = '/s1';
            height = 25;
        } else if (sog < 5) {
            sogNum = '/s1';
            height = 25;
        } else if (sog < 10) {
            sogNum = '/s2';
            height = 31;
        } else if (sog < 15) {
            sogNum = '/s3';
            height = 41;
        } else if (sog < 20) {
            sogNum = '/s4';
            height = 51;
        } else {
            sogNum = '/s5';
            height = 61;
        }

        var imgNum = this.getShipTypeimgNum(type);
        var shipSrcUrl = this.path + "img" + sogNum + imgNum;

        return shipSrcUrl;
    },
    getShipTypeimgNum: function (type) {
        var imgNum;
        if (type == undefined || type == "") {
            imgNum = "/ship1.png";
        } else {
            switch (type) {
                case "20":
                case "21":
                case "22":
                case "23":
                case "24":
                case "29":
                    imgNum = '/ship2.png';
                    break;
                case ("30"):
                    imgNum = '/ship3.png';
                    break;
                case "37":
                    imgNum = '/ship4.png';
                    break;
                case "55":
                    imgNum = '/ship5.png';
                    break;
                case "60":
                case "61":
                case "62":
                case "63":
                case "64":
                case "69":
                    imgNum = '/ship6.png';
                    break;
                case "70":
                case "71":
                case "72":
                case "73":
                case "74":
                case "79":
                    imgNum = '/ship7.png';
                    break;
                case "80":
                case "81":
                case "82":
                case "83":
                case "84":
                case "89":
                    imgNum = '/ship8.png';
                    break;
                default:
                    imgNum = '/ship9.png';
            }
        }
        return imgNum;
    },






}));

