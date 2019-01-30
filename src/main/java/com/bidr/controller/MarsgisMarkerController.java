package com.bidr.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bidr.mongo.entity.MarsgisMarker;
import com.bidr.service.impl.AdminServiceImpl;
import com.mongodb.DBCollection;

@Controller("MarsgisMarkerController")
@RequestMapping("/map/marker")
public class MarsgisMarkerController {

    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private AdminServiceImpl adminService;
	
    /**
     * 保存数组标记
     * @param marsgisMarkers
     * @return
     */
	@RequestMapping(value="/saveMarkers",method = RequestMethod.POST,consumes = "application/json")
	public @ResponseBody String insertMarkers(@RequestBody List<MarsgisMarker> marsgisMarkers){
		String username=adminService.getCurrentUsername();
		if(marsgisMarkers.size()>0){
			for(MarsgisMarker marsgisMarker :marsgisMarkers){
				marsgisMarker.setUsername(username);
			}
		}
		mongoTemplate.insertAll(marsgisMarkers); 
		return "success";
	}
	 /**
     * 保存单个标记标记
     * @param marsgisMarkers
     * @return
     */
	@RequestMapping(value="/saveMarker",method = RequestMethod.POST,produces = "application/json;chartset=UTF-8")
	public @ResponseBody String insertMarker(@RequestBody MarsgisMarker marsgisMarker){
		String username=adminService.getCurrentUsername();
		//判断文档是否存在
		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(marsgisMarker.getId()));
		if(mongoTemplate.exists(query, MarsgisMarker.class)){//如果存在就更新
			Update update = new Update();
			update.set("name", marsgisMarker.getName()).set("remark", marsgisMarker.getRemark());
			mongoTemplate.updateFirst(query, update, MarsgisMarker.class);
		}else{//如果不存在就插入
			marsgisMarker.setUsername(username);
			mongoTemplate.insert(marsgisMarker); 
		}
		
		return "success";
	}
	 /**
     * 更新单个标记标记
     * @param marsgisMarkers
     * @return
     */
	@RequestMapping(value="/updateMarker",method = RequestMethod.POST,produces = "application/json;chartset=UTF-8")
	public @ResponseBody String updateMarker(@RequestBody MarsgisMarker marsgisMarker){
		Query query = new Query();
		query.addCriteria(Criteria.where("id").is(marsgisMarker.getId()));
		Update update = new Update();
		update.set("name", marsgisMarker.getName()).set("remark", marsgisMarker.getRemark());
		mongoTemplate.updateFirst(query, update, MarsgisMarker.class);
		return "success";
	}
	/**
	 * 查询全部标记
	 * @return
	 */
	@RequestMapping(value="/queryAll",method = RequestMethod.GET,produces = "application/json;chartset=UTF-8")
	public @ResponseBody JSONArray queryAllMarker(){
		String username=adminService.getCurrentUsername();
		Query query=new Query(Criteria.where("username").is(username));
		List<MarsgisMarker> marsgisMarkers=mongoTemplate.find(query, MarsgisMarker.class);
		return (JSONArray)JSONArray.toJSON(marsgisMarkers);
	}
	/**
	 * 根据ID删除标记
	 * @return
	 */
	@RequestMapping(value="/delete/{id}",method = RequestMethod.GET)
	public @ResponseBody String deleteById(@PathVariable String id){
		String username=adminService.getCurrentUsername();
		Query query=new Query(Criteria.where("username").is(username).and("id").is(id));
		mongoTemplate.remove(query, MarsgisMarker.class);
		return "success";
	}
	/**
	 * 清除所有标记
	 * @return
	 */
	@RequestMapping(value="/deleteAll",method = RequestMethod.GET,produces = "application/json;chartset=UTF-8")
	public @ResponseBody String deleteAll(){
		String username=adminService.getCurrentUsername();
		Query query=new Query(Criteria.where("username").is(username));
		mongoTemplate.remove(query, MarsgisMarker.class);
		return "success";
	}
	
	
}
