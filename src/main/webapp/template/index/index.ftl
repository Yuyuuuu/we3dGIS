<#assign shiro=JspTaglibs["/WEB-INF/tld/shiro.tld"] /> 
<#escape x as x?html>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0" />
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <meta name="x5-fullscreen" content="true">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
    <meta name="keywords" content="可视化 木遥" />
    <meta name="description" content="中水北方综合态势展示系统" />
    <link rel="icon" href="${base}/static/img/logo.png" />
    <title>中水北方综合态势展示系统</title> 

    <!-- css -->
    <link href="${base}/static/css/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
    <link href="${base}/static/layui/css/layui.css" rel="stylesheet" />

    <link href="${base}/static/css/main.css" type="text/css" rel="stylesheet" />
    <link href="${base}/static/css/index.css" type="text/css" rel="stylesheet" />
    <link href="${base}/static/css/themeGray.css" rel="stylesheet" /> 
</head>
<body>
    <!--导航及主菜单-->
    <div class="mainHeader">
        <div class="loading active" id="navLoadEle">正在加载菜单...</div>

        <div class="logo">
            <p><img src="${base}/static/img/logo.png" />中水北方综合态势展示系统</p>
        </div> 
        <div class="userInfo" id="userInfo">
            <p href="#" class="fa fa-user-circle-o fa-2x"></p>
            <dl>
                <dt><span id="lblUserName"><@shiro.principal /></span></dt>
                <@shiro.hasPermission name = "admin:user">
                	<dd><i class="fa fa-comments-o"></i><a href="${base}/admin/index.jhtml"  target="_blank">用户管理</a></dd>
                </@shiro.hasPermission>
                <@shiro.hasPermission name = "admin:role">
                	<dd><i class="fa fa-comments-o"></i><a href="${base}/role/index.jhtml"  target="_blank">角色管理</a></dd>
                </@shiro.hasPermission>
                <dd ><a href="${base}/logout/index.jhtml">退出</a><i class="fa fa-sign-out"></i></dd>
                <!--<dd><i class="fa fa-lock"></i><a href="#">锁屏</a></dd>-->
            </dl>
        </div> 

        <div class="mediaNav fa fa-navicon" id="mediaNav"></div> 
        <ul class="nav" id="navList">
            
        </ul>

        <!--鼠标移入菜单效果线-->
        <div class="positionMarker" id="positionMarker"></div> 
    </div>

    <!--二、三级菜单-->
    <div id="menu" class="menu">
       
    </div>

     
    <div class="mainCan" id="mainCan">
        <div class="loading" id="conLoadEle">正在加载功能...</div>
        <!-- 菜单对应页面功能加载区 -->
        <div class="mainCon" id="mainCon"> 
          <iframe id="rightFrame" name="rightFrame" style="width:100%;height:100%;overflow:hidden;margin:0;"
                    scrolling="no" frameborder="0" src="${base}/map/index.jhtml"></iframe>
        </div>
    </div>

    <!--js-->
    <script src="${base}/static/lib/jquery/jquery-2.1.4.min.js"></script>
    <script src="${base}/static/layui/layui.all.js" type="text/javascript"></script>
   <script src="${base}/static/js/haoutil.js"></script>

    <script src="${base}/static/js/server.js"></script>
    <script src="${base}/static/js/index.js"></script>
</body>
</html> 
<script>
 
</script>
</body>
</html>
</#escape>