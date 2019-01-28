/* 2017-9-28 16:04:24 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
      
    },
    //初始化[仅执行1次]
    create: function () {
        this.dataSource = new Cesium.CustomDataSource();

        //取区域内的随机点
        function randomPoint(height) {
            var jd = haoutil.math.random(101 * 1000, 117 * 1000) / 1000;
            var wd = haoutil.math.random(26 * 1000, 39 * 1000) / 1000;

            return Cesium.Cartesian3.fromDegrees(jd, wd, height);
        }

   
        var colors = [
            new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 0.9),
            new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 0.9),
            new Cesium.Color(221 / 255, 221 / 255, 221 / 255, 0.9)
        ];
         
        for (var i = 0; i < 100; i++) {
            var position = randomPoint();

           this.dataSource.entities.add({
                position: position,
                ellipse: {
                    height: 0.0,
                    semiMinorAxis: 50000.0,
                    semiMajorAxis: 50000.0,
                    material: new mars3d.ElliposidFadeMaterialProperty({ 
                        color: colors[i % 3]
                    }), 
                }
            });
        }

    },
    //打开激活
    activate: function () {
        viewer.mars.centerAt({ "x": 110.597446, "y": 29.808307, "z": 2738906.4, "heading": 352.7, "pitch": -86.3, "roll": 0.7 });


        this.viewer.dataSources.add(this.dataSource);
    },
    //关闭释放
    disable: function () {
        this.viewer.dataSources.remove(this.dataSource);

    },




}));

