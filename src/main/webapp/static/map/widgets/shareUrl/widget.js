/* 2017-9-26 17:24:33 | 修改 木遥（QQ：516584683） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    map: null,//框架会自动对map赋值
    options: {
        //弹窗
        view: {
            type: "divwindow",
            url: "view.html",
            windowOptions: {
                width: 650,
                height: 110
            }
        }
    },
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.updateUrl();
    },
    //激活插件
    activate: function () {

        //相机移动结束事件
        viewer.scene.camera.moveEnd.addEventListener(this.camera_moveEndHandler, this);
    },
    //释放插件
    disable: function () {
        this.viewWindow = null;
        //相机移动结束事件
        viewer.scene.camera.moveEnd.removeEventListener(this.camera_moveEndHandler, this);

    },
    updateUrl: function (url) {
        $("#txtUrl").val(this.getUrl());

        $("#txtUrl").focus();
        $("#txtUrl").select();
    },
    camera_moveEndHandler: function () { 
        this.updateUrl();
    },
    getUrl: function () {
        var bookmark = mars3d.point.getCameraView(this.viewer, true);


        var lasturl = window.location.href;
        if (lasturl.lastIndexOf('#') != -1) {
            lasturl = lasturl.replace(window.location.hash, "").replace("#", "");
        }
        var idx = lasturl.lastIndexOf('?');
        if (idx != -1) {
            lasturl = lasturl.substring(0, idx);
        }

        var url = lasturl + "?x=" + bookmark.x
            + "&y=" + bookmark.y
            + "&z=" + bookmark.z
            + "&heading=" + bookmark.heading
            + "&pitch=" + bookmark.pitch
            + "&roll=" + bookmark.roll;

        var req = haoutil.system.getRequest();
        for (var key in req) {
            if (key == "x" || key == "y" || key == "z" || key == "heading" || key == "pitch" || key == "roll") continue;
            url += "&" + key + "=" + req[key];
        }
        return url;
    },



}));
