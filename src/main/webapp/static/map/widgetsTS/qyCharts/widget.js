/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: [{
            type: "window",
            url: "view.html",
            windowOptions: {
                //"noTitle": true,
                //"closeBtn": 0,
                "width": 300,
                "position": {
                    "top": 5,
                    "bottom": 5,
                    "left": 5
                }
            }
        }, {
            type: "window",
            url: "view2.html",
            windowOptions: {
                //"noTitle": true,
                //"closeBtn": 0,
                "width": 300,
                "position": {
                    "top": 50,
                    "bottom": 5,
                    "right": 5
                }
            }
        }],
    },
    //初始化[仅执行1次]
    create: function () {


    },
    //viewWindow1: null,
    //viewWindow2: null,
    ////每个窗口创建完成后调用
    //winCreateOK: function (opt, result) { 
    //    if (opt.key == 1)
    //        this.viewWindow1 = result;
    //    else
    //        this.viewWindow2 = result;

    //},
    //打开激活
    activate: function () {

    },
    //关闭释放
    disable: function () {


    },
    setViewStyle: function (css) {
        var opt = this.options.view[0]; 
        layer.style(opt._layerIdx, css); 
    },
    getData: function () {
        return this.config.dataQy; // widgetPointQy.arrdata;
    },
    getData: function () {
        if (this.config.dataQy) {
            return this.config.dataQy;
        }
        else {
            if (!window.widgetPointQy) {
                toastr.warning('请先加载企业点分布模块');
                return [];
            }
             
            return widgetPointQy.arrdata;
        }
    },
    //统计计算：企业总数
    getAllCount: function () {
        var arrdata = this.getData();
        return arrdata.length;
    },
    //统计计算：按“年份”统计“企业总产值、利润、纳税额”
    getArrForYearJJ: function () {
        var arrdata = this.getData();

        var tjObj = {};
        for (var i = 0; i < arrdata.length; i++) {
            var arrObj = arrdata[i].JJ;
            for (var j = 0; j < arrObj.length; j++) {
                var itemJJ = arrObj[j];  //当前年份对应的经济状况

                var type = itemJJ.NF;

                //统计数据
                if (tjObj[type] == null)
                    tjObj[type] = { NF: type, ZCZ: 0, LY: 0, NSE: 0 };

                tjObj[type].ZCZ += Number(itemJJ.ZCZ || 0);
                tjObj[type].LY += Number(itemJJ.LY || 0);
                tjObj[type].NSE += Number(itemJJ.NSE || 0);
            }
        }

        //object转换为数组
        var arrObj = [];
        for (var i in tjObj) {
            var item = tjObj[i];

            item.ZCZ = Math.round(item.ZCZ / 1000) / 10; //转为亿元，四舍五入
            item.LY = Math.round(item.LY / 1000) / 10;
            item.NSE = Math.round(item.NSE / 1000) / 10;

            arrObj.push(item);
        }


        //对数据进行排序【按年份】
        var compare = function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
        arrObj.sort(compare("NF"));

        return arrObj;
    },
    //统计计算：按“行业类型”统计“企业数量”
    getArrForTypeCount: function () {
        var arrdata = this.getData();

        //按分类计算统计
        var tjObj = {};
        for (var index = 0; index < arrdata.length; index++) {
            var item = arrdata[index];

            var type = $.trim(item.LX);  //类别
            if (type == '') type = '其他';

            //统计数据
            if (tjObj[type] == null) tjObj[type] = 0;
            tjObj[type] += 1;
        }

        //object转换为数组
        var arrObj = [];
        for (var i in tjObj) {
            var val = Number(tjObj[i]);
            arrObj.push({ name: i, value: val });
        }
        return arrObj;
    },

    //统计计算：按“行业类型”统计“企业总产值 利润 纳税额”
    //column 可以取值：ZCZ   LY  NSE
    getArrForTypeJJ: function (column) {
        if (column == null) column = "ZCZ";

        var arrdata = this.getData();

        //按分类计算统计
        var tjObj = {};
        for (var index = 0; index < arrdata.length; index++) {
            var item = arrdata[index];

            var arrJJ = item.JJ;
            if (arrJJ == null || arrJJ.length == 0) continue;

            var type = $.trim(item.LX);  //类别
            if (type == '') type = '其他';


            //统计数据
            if (tjObj[type] == null) tjObj[type] = 0;
            tjObj[type] += Number(arrJJ[arrJJ.length - 1][column] || 0);
        }

        //object转换为数组
        var arrObj = [];
        for (var i in tjObj) {
            var val = Math.round(tjObj[i]); //四舍五入
            arrObj.push({ name: i, value: val });
        }
        return arrObj;
    },

    //排序计算：按“各企业”的指定“企业总产值 利润 纳税额”进行排序
    //column 可以取值：ZCZ   LY  NSE
    getArrForSortQy: function (column) {
        if (column == null) column = "ZCZ";

        var arrdata = this.getData();

        //按分类计算统计
        var arrObj = [];
        for (var index = 0; index < arrdata.length; index++) {
            var item = arrdata[index];

            var value = 0;
            var arrJJ = item.JJ;
            if (arrJJ != null && arrJJ.length > 0) {
                value = Number(arrJJ[arrJJ.length - 1][column] || 0);
            }

            if (value == 0) continue;

            var name = item.JC;
            arrObj.push({ name: name, value: value });
        }

        //对数据进行排序
        var compare = function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
        arrObj.sort(compare("value"));

        return arrObj;
    },















}));

