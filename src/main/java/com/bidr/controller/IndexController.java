package com.bidr.controller;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.bidr.mongo.entity.MarsgisMarker;
import com.bidr.service.impl.AdminServiceImpl;

@Controller("IndexController")
@RequestMapping("/index")
public class IndexController {
	@Autowired
	private AdminServiceImpl adminService;
	@Autowired
    private MongoTemplate mongoTemplate;

	
	/**
	 * 跳转首页
	 * @return
	 */
	@RequestMapping(value="/main",produces = "application/json;chartset=UTF-8")
	public String index(ModelMap model,HttpServletRequest request,HttpServletResponse response) {
		String username=adminService.getCurrentUsername();
		Query query=new Query(Criteria.where("username").is(username));
		//获取标记文档
		List<MarsgisMarker> marsgisMarkers=mongoTemplate.find(query, MarsgisMarker.class);
		//HttpSession session=request.getSession();
		model.put("marsgis_addmarker", marsgisMarkers);
		return "index/index";
	}
}
