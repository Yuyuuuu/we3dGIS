package com.bidr.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bidr.entity.Admin;
import com.bidr.utils.WebUtils;

@Controller("LogoutController")
@RequestMapping("/logout")
public class LogoutController {
	
	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String execute(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
		WebUtils.removeCookie(request, response, Admin.LOGIN_TOKEN_COOKIE_NAME);
		return "redirect:/";
	}
}
