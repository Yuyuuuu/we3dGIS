<#escape x as x?html>
<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0" />
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <meta name="x5-fullscreen" content="true">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
    <meta name="keywords" content="可视化 木遥" />
    <meta name="description" content="综合态势展示系统" />
    <link rel="icon" href="${base}/static/img/logo.png" />
    <title>中水北方综合态势展示系统 - 登录</title>

    <!--css-->
    <link href="${base}/static/css/fonts/font-awesome/css/font-awesome.min.css" type="text/css" rel="stylesheet" />
    <link href="${base}/static/layui/css/layui.css" rel="stylesheet" />

    <link href="${base}/static/css/main.css" type="text/css" rel="stylesheet" />
    <link href="${base}/static/css/login.css" type="text/css" rel="stylesheet" />  
</head>
<body class="body">

    <div id="loginBJ" class="loginContainer">
        <!-- 背景,默认是图片。可以url传参style，使用不同样式！ -->
        <img src="${base}/static/img/login/bg2.jpg" class="img" />
        <img src="${base}/static/img/login/bg1.jpg" class="img" />
        <img src="${base}/static/img/login/bg3.jpg" class="img" />
        <img src="${base}/static/img/login/bg4.jpg" class="img" />
        <img src="${base}/static/img/login/body_bg.jpg" class="img" />
    </div>

    <!--配置居中，class加 center-->
    <div class="logo"><img src="${base}/static/img/logo.png" alt="" />中水北方综合态势展示系统</div>

    <!--配置居中，class加 center，深色加gray-->
    <div class="login ">
        <h3>欢迎登录</h3>
        <form action="${base}/login/index.jhtml" method="post"  id="loginForm" >
            <ul>
                <li><input type="text" name="username"  id="username" placeholder="用户名" /><i class="fa fa-user"></i></li>
                <li><input type="password" name="password"  id="password"  placeholder="密码" /><i class="fa fa-key"></i></li>
            </ul>
            <p><input type="submit" id="btnLogin" value="登录"></input></p>
       </form>
    </div>

    <div class="footer">
        <p>copyright &copy; <a href="http://www.tidi.ac.cn/" target="_blank">中水北方勘测设计研究有限责任公司</a> 2018 </p>
    </div>

    <!--js-->
    <script src="${base}/static/js/jquery.min.js"></script>
    <script src="${base}/static/layui/layui.all.js" type="text/javascript"></script>
    <script src="${base}/static/js/haoutil.js"></script>

    <script src="${base}/static/js/server.js"></script>
    <script src="${base}/static/js/login.js" type="text/javascript"></script>
   <script type="text/javascript">
	layui.use("layer",function(){
		var $loginForm = $("#loginForm");
		var $username = $("#username");
		var $password = $("#password");
	    var layer = layui.layer;
	    <#if failureMessage??>
	    	layer.msg("${failureMessage}"); 
		</#if>
	    $loginForm.submit( function() {
	    	if ($username.val() == "") {
	    		layer.msg("用户名不能为空!");
				return false;
			}
			if ($password.val() == "") {
				layer.msg("密码不能为空!");
				return false;
			}
	    })
	
	  
	})
</script>
</body>
</html>
</#escape>