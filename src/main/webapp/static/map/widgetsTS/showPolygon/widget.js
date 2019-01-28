/* 2017-12-5 16:47:31 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
    },
    //初始化[仅执行1次]
    create: function () {
        var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
        var span = [10, 20, 30, 40, 50, 60, 70];
        function getColor(num) {
            var length = span.length + 1;
            if (length > colors.length)
                length = colors.length;

            for (var k = 0; k < length; k++) {
                if (num < span[k]) {
                    return colors[k];
                }
            }
            return colors[length - 1];
        }
        var that = this;
        var dataSource = Cesium.GeoJsonDataSource.load("../data/geojson/anhui.json");
        dataSource.then(function (dataSource) {
            that.dataSource = dataSource;
            that.viewer.dataSources.add(dataSource);

            var entities = dataSource.entities.values;

            var colorHash = {};
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];

                var random = haoutil.math.random(5, 80);
                var color = new Cesium.Color.fromCssColorString(getColor(random)).withAlpha(1);

                entity.polygon.material = color;
                entity.polygon.outline = true;
                entity.polygon.outlineColor = new Cesium.Color.fromCssColorString("#fff").withAlpha(0.5);

                entity.polygon.extrudedHeight = random * 300;
            }

            viewer.flyTo(dataSource.entities.values, { duration: 3 });

        }).otherwise(function (error) {
            window.alert(error);
        });
    },
    //打开激活
    activate: function () {
        if (this.dataSource) {
            this.viewer.dataSources.add(this.dataSource);
            this.viewer.flyTo(this.dataSource.entities.values, { duration: 3 });
        }
    },
    //关闭释放
    disable: function () {
        debugger
        if (this.dataSource) {
            this.viewer.dataSources.remove(this.dataSource);
        }

    },



}));

