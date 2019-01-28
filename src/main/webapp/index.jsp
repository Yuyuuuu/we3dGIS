<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="com.bidr.entity.Admin"%>
<%@page import="com.bidr.service.AdminService"%>
<%@page import="com.bidr.utils.SpringUtils"%>
<%@page import="com.bidr.utils.WebUtils"%>
<%
String base = request.getContextPath();
ApplicationContext applicationContext = SpringUtils.getApplicationContext();
if (applicationContext != null) {
	AdminService adminService = SpringUtils.getBean("adminServiceImpl", AdminService.class);
	WebUtils.addCookie(request, response, Admin.LOGIN_TOKEN_COOKIE_NAME, adminService.getLoginToken());
	response.sendRedirect(base + "/login/index.jhtml");
	return;
} else {
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Cache-Control", "no-store");
	response.setDateHeader("Expires", 0);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>提示信息 -中水北方</title>
<meta name="author" content="中水北方勘测设计研究有限责任公司智慧工程部" />
<meta name="copyright" content="中水北方勘测设计研究有限责任公司智慧工程部" />

</head>
<body>
	<fieldset>
		<legend>系统出现异常</legend>
	</fieldset>
</body>
</html>
<%
}
%>