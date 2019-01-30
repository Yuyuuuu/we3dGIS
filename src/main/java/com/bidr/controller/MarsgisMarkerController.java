package com.bidr.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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
	
	@RequestMapping(value="/save",method = RequestMethod.POST,consumes = "application/json")
	public @ResponseBody String insertMarker(@RequestBody MarsgisMarker[] marsgisMarker){
		//String username=adminService.getCurrentUsername();
		String username="admin";
		DBCollection collection=null;
		if(!mongoTemplate.collectionExists(username)){
			collection=mongoTemplate.createCollection(username);	
		}else{
			collection=mongoTemplate.getCollection(username);
		}
		
		return "success";
	}
}
