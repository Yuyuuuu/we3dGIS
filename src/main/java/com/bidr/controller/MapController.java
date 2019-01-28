package com.bidr.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("MapController")
@RequestMapping("/map")
public class MapController {
	/**
	 * 跳转MAP首页
	 * @return
	 */
	@RequestMapping("/index")
	public String index(ModelMap model) {
		return "map/index";
	}
}
