package com.bidr.controller;
import java.io.Reader;
import java.io.StringReader;
import java.util.Iterator;

import org.apache.commons.lang3.StringUtils;
import org.geojson.GeoJsonObject;
import org.geojson.Geometry;
import org.geotools.geojson.GeoJSON;
import org.geotools.geojson.geom.GeometryJSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bidr.mongo.entity.MarsgisMarker;
import com.bidr.mongo.entity.MarsgisPlot;
import com.bidr.service.impl.AdminServiceImpl;

@Controller("MarsgisPlotController")
@RequestMapping("/map/plot")
public class MarsgisPlotController {
	@Autowired
	private MongoTemplate mongoTemplate;
	@Autowired
	private AdminServiceImpl adminService;

	/**
	 * 保存绘图
	 * 
	 * @param marsgisMarkers
	 * @return
	 */
	@RequestMapping(value = "/savePlot", method = RequestMethod.POST, produces = "application/json;chartset=UTF-8")
	public @ResponseBody String insertPlot(String marsgisPlot) {
		if(StringUtils.isNotEmpty(marsgisPlot)){
			String username = adminService.getCurrentUsername();//查询用户名
			JSONObject mars=(JSONObject)JSONObject.parse(marsgisPlot);
			mars.put("username", username);
			Query query = new Query();
			query.addCriteria(Criteria.where("username").is(username));
			if(mongoTemplate.exists(query, "marsgis_plot")){
				mongoTemplate.remove(query, "marsgis_plot");
			}
			mongoTemplate.insert(mars,"marsgis_plot");
			
			
		}
		
		return "success";
	}

	/**
	 * 查询当前用户标会数据
	 * 
	 * @return
	 */
	@RequestMapping(value = "/queryAll", method = RequestMethod.GET)
	public @ResponseBody JSONObject queryAll() {
		String username = adminService.getCurrentUsername();
		Query query = new Query();
		query.addCriteria(Criteria.where("username").is(username));
		JSONObject marsgisPlot=mongoTemplate.findOne(query, JSONObject.class,"marsgis_plot");
		JSONObject result=new JSONObject();
		result.put("code", 0);
		result.put("data", marsgisPlot);
		return result;
	}
	/**
	 * 根据ID删除绘制
	 * @return
	 */
	@RequestMapping(value="/delete/{id}",method = RequestMethod.GET)
	public @ResponseBody String deleteById(@PathVariable String id){
		String username=adminService.getCurrentUsername();
		Query query=new Query(Criteria.where("username").is(username));
		JSONObject mars=mongoTemplate.findOne(query, JSONObject.class,"marsgis_plot");
		JSONArray features=mars.getJSONArray("features");
		for(int i=0;i<features.size();i++){
			JSONObject feature=features.getJSONObject(i);
			String attrID=feature.getJSONObject("properties").getJSONObject("attr").getString("id");
			if(id.equals(attrID)){
				features.remove(feature);
			}
		}
		mars.put("features", features);
		mongoTemplate.remove(query, "marsgis_plot");
		mongoTemplate.insert(mars,"marsgis_plot");
		return "success";
	}

	/**
	 * 清除所有绘制
	 * 
	 * @return
	 */
	@RequestMapping(value = "/deleteAll", method = RequestMethod.GET, produces = "application/json;chartset=UTF-8")
	public @ResponseBody String deleteAll() {
		String username = adminService.getCurrentUsername();
		Query query = new Query(Criteria.where("username").is(username));
		mongoTemplate.remove(query, "marsgis_plot");
		return "success";
	}
}
