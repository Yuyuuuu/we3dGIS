var thisWidget;
var layers = [];
var layersObj = {};

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;

    if (thisWidget.config && thisWidget.config.style) {
        $("body").addClass(thisWidget.config.style);
    }


    $.ajax({
        url: 'data/scenetree.json',
        dataType: 'json',
        data: { x: new Date() },
        success: function (data) {
            initSceneTree(data.scenes);
        }
    });
}
function initSceneTree(layers) {

    //初始化树
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: treeOverlays_onDblClick,
        },
    };

    var zNodes = [];

    var node = {
        id: 1,
        pId: -1,
        name: 'XX模型',
    };
    node.icon = "images/folder.png";
    node.open = true;
    zNodes.push(node);

    for (var i = 0, len = layers.length; i < len; i++) {
        var item = layers[i];

        var node = {
            id: i + 2,
            pId: 1,
            name: item.name,
            sphere: item.sphere,
        };

        node.icon = "images/layer2.png";
        //node.checked = true;

        //记录图层 
        zNodes.push(node);
    }

    $.fn.zTree.init($("#treeOverlays"), setting, zNodes);


    $("#view").mCustomScrollbar({
        theme: (thisWidget.config.style == "dark") ? "" : "dark-2",
    });

}


function treeOverlays_onDblClick(event, treeId, treeNode) {
    if (treeNode.sphere)
        thisWidget.centerAt(treeNode.name, treeNode.sphere);
};
