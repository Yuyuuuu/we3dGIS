package com.bidr.controller;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bidr.service.impl.AdminServiceImpl;

@Controller("IndexController")
@RequestMapping("/index")
public class IndexController {
	@Autowired
	private AdminServiceImpl adminService;

	
	/**
	 * 跳转首页
	 * @return
	 */
	@RequestMapping("/main")
	public String index(ModelMap model) {
		return "index/index";
	}
}
