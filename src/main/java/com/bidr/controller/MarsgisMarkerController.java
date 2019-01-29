package com.bidr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller("MarsgisMarkerController")
@RequestMapping("/map/marker")
public class MarsgisMarkerController {
	@Autowired
	private MongoTemplate mongoTemplate;
	
	/*@RequestMapping()
	public @ResponseBody String insertMarker(){
		
	}*/
}
