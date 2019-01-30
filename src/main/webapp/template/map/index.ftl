<#escape x as x?html>
<!DOCTYPE html>
<html class="no-js css-menubar" lang="zh-cn">
<head>
    <title>三维地球</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!-- 移动设备 viewport -->
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui">
    <meta name="author" content="火星科技 http://cesium.marsgis.cn ">
    <!-- 360浏览器默认使用Webkit内核 -->
    <meta name="renderer" content="webkit">
    <!-- Chrome浏览器添加桌面快捷方式（安卓） -->
    <link rel="icon" type="image/png" href="${base}/static/map/img/favicon/favicon.png">
    <meta name="mobile-web-app-capable" content="yes">
    <!-- Safari浏览器添加到主屏幕（IOS） -->
    <link rel="icon" sizes="192x192" href="href="${base}/static/map/img/favicon/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="火星科技 MarsGIS">
    <!-- Win8标题栏及ICON图标 -->
    <link rel="apple-touch-icon-precomposed" href="href="${base}/static/map/img/favicon/apple-touch-icon.png">
    <meta name="msapplication-TileImage" content="href="${base}/static/map/img/favicon/app-icon72x72@2x.png">
    <meta name="msapplication-TileColor" content="#62a8ea">

    <!--[if lte IE 11]>
        <meta http-equiv="refresh" content="0; url='../docs/ie.html'"/>
    <![endif]-->
 

    <!--第三方lib-->
    <script type="text/javascript" src="${base}/static/lib/include-lib.js?time=20181201" libpath="${base}/static/lib/"
            include="jquery,bootstrap,bootstrap-checkbox,font-awesome,web-icons,layer,haoutil,nprogress,toastr,admui,turf,echarts-gl,cesium-mars"></script>
    <link href="${base}/static/map/css/style.css?time=20181201" rel="stylesheet" /> 
</head>
<body class="dark">
    <div id="loadOverlay" class='loadingOverlay'>
        <ul id="loadbar" class="ins">
            <li><div id="loadinglayer1" class="ball"></div><div id="loadinglayer7" class="pulse"></div></li>
            <li><div id="loadinglayer2" class="ball"></div><div id="loadinglayer8" class="pulse"></div></li>
            <li><div id="loadinglayer3" class="ball"></div><div id="loadinglayer9" class="pulse"></div></li>
            <li><div id="loadinglayer4" class="ball"></div><div id="loadinglayer10" class="pulse"></div></li>
            <li><div id="loadinglayer5" class="ball"></div><div id="loadinglayer11" class="pulse"></div></li>
        </ul>
    </div> 
    <div id="mask" class="signmask" ></div>


    <div id="centerDiv">
        <div id="cesiumContainer" class="cesium-container"></div>
    </div>

    <!--业务代码-->
    <script src="${base}/static/map/js/ex/featureViewer.js"></script>
    <script src="${base}/static/map/js/index.js?time=20181201"></script>
    <script src="${base}/static/js/server.js"></script>
</body>
</html>
</#escape>