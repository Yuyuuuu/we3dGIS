package com.bidr.controller;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bidr.entity.Admin;
import com.bidr.service.impl.AdminServiceImpl;
import com.bidr.utils.WebUtils;
@Controller("LoginController")
@RequestMapping("/login")
public class LoginController {
	
	@Autowired
	private AdminServiceImpl adminService;
	
	
	@RequestMapping("/index")
	public String index(HttpServletRequest request, ModelMap model){
		String loginToken = WebUtils.getCookie(request, Admin.LOGIN_TOKEN_COOKIE_NAME);
		if (!StringUtils.equalsIgnoreCase(loginToken, adminService.getLoginToken())) {//缓存中token和请求token进行比较
			return "redirect:/";
			
		}
		if (adminService.isAuthenticated()) {//判断用户是否授权登录
			return "redirect:index/main.jhtml";
		}
		JSONObject failureMessage = new JSONObject();
		String message=null;
		String loginFailure = (String) request.getAttribute(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME);//获取错误登录信息
		if (StringUtils.isNotEmpty(loginFailure)) {
			if (loginFailure.equals("org.apache.shiro.authc.UnknownAccountException")) {
				message="账户不存在!";
				//failureMessage.put("message", "账户不存在!");
			} else if (loginFailure.equals("org.apache.shiro.authc.DisabledAccountException")) {
				message="账户不可用!";
				//failureMessage.put("message", "账户不可用!");
			} else if (loginFailure.equals("org.apache.shiro.authc.LockedAccountException")) {
				message="账户被锁定!请在30分钟后重新登陆";
				//failureMessage.put("message", "账户被锁定!");
			} else if (loginFailure.equals("org.apache.shiro.authc.IncorrectCredentialsException")) {
				message="密码错误!超过5次账户将会被锁定";
				//failureMessage.put("message", "密码错误!");
			}  else if (loginFailure.equals("org.apache.shiro.authc.AuthenticationException")) {
				message="账户未授权!";
				//failureMessage.put("message", "账户未授权!");
			}else if(loginFailure.equals("com.bidr.exception.KickOutException")){
				message="该账户已经在其他设备上登录，您暂时不能登录!";
			}
		}
		model.addAttribute("failureMessage", message);
		return "login/index";
	}

}
