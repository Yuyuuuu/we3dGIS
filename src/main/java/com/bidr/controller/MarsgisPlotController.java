package com.bidr.controller;
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
	public @ResponseBody String insertPlot(@RequestBody MarsgisPlot marsgisPlot) {
		String username = adminService.getCurrentUsername();
		marsgisPlot.setUsername(username);
		Query query = new Query();
		query.addCriteria(Criteria.where("username").is(username));
		if(mongoTemplate.exists(query, MarsgisPlot.class)){
			mongoTemplate.updateMulti(query, null, MarsgisPlot.class);
		}else{
			mongoTemplate.insert(marsgisPlot);
		}
		return "success";
	}

	/**
	 * 更新单个标记标记
	 * 
	 * @param marsgisMarkers
	 * @return
	 */
	@RequestMapping(value = "/updatePlot", method = RequestMethod.POST, produces = "application/json;chartset=UTF-8")
	public @ResponseBody String updatePlot(@RequestBody String plot) {
		Query query = new Query();
		
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
		MarsgisPlot marsgisPlot = mongoTemplate.findById(username, MarsgisPlot.class);
		JSONObject result=new JSONObject();
		result.put("code", 0);
		result.put("data", (JSONObject)JSONObject.toJSON(marsgisPlot));
		return result;
	}

	/**
	 * 根据ID删除标记
	 * 
	 * @return
	 */
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.GET)
	public @ResponseBody String deleteById(@PathVariable String id) {
		String username = adminService.getCurrentUsername();
		Query query = new Query(Criteria.where("username").is(username).and("id").is(id));
		mongoTemplate.remove(query, MarsgisMarker.class);
		return "success";
	}

	/**
	 * 清除所有标记
	 * 
	 * @return
	 */
	@RequestMapping(value = "/deleteAll", method = RequestMethod.GET, produces = "application/json;chartset=UTF-8")
	public @ResponseBody String deleteAll() {
		String username = adminService.getCurrentUsername();
		Query query = new Query(Criteria.where("username").is(username));
		mongoTemplate.remove(query, MarsgisMarker.class);
		return "success";
	}
}
