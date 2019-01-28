package com.bidr.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bidr.entity.Admin;
import com.bidr.entity.Role;
import com.bidr.service.impl.RoleServiceImpl;

@Controller("RoleController")
@RequestMapping("/role")
public class RoleController {
	
	@Autowired
	private RoleServiceImpl roleService;
	/**
	 * 跳转角色首页
	 * @return
	 */
	@RequestMapping("/index")
	public String index(){
		return "role/index";
	}
	/**
	 * 跳转角色新增页面
	 * @return
	 */
	@RequestMapping("/addPage")
	public String addPage(){
		return "role/add";
	}
	/**
	 * 跳转角色编辑页面
	 * @return
	 */
	@RequestMapping("/editPage")
	public String editPage(Long id,ModelMap model){
		Role role=roleService.selectByPrimaryKey(id);
		model.put("role", role);
		return "role/edit";
	}
	
	/**
	 * 查询数据
	 * @return
	 */
	@RequestMapping(value="/query",produces = "text/plain; charset=utf-8")
	public @ResponseBody String query(){
		List<Role> listRole=roleService.findAll();
		return JSONArray.toJSONString(listRole);
	}
	/**
	 * 添加角色
	 * @param role
	 * @return
	 */
	@RequestMapping(value="/add",method=RequestMethod.POST)
	public @ResponseBody String add(@RequestBody Role role){
		JSONObject jsonObject=new JSONObject();
		role.setCreate_date(new Date());
		role.setModify_date(new Date());
		role.setIs_system(false);
		role.setVersion(1L);
		roleService.insert(role);
		jsonObject.put("status", "200");
		return jsonObject.toJSONString();
	}
	/**
	 * 编辑角色
	 * @param role
	 * @return
	 */
	@RequestMapping(value="/edit",method=RequestMethod.POST)
	public @ResponseBody String edit(@RequestBody Role role){
		JSONObject jsonObject=new JSONObject();
		roleService.updateByPrimaryKeySelective(role);
		return jsonObject.toJSONString();
	}
	/**
	 * 删除角色
	 * @param ids
	 * @return
	 */
	@RequestMapping(value="/delete",method=RequestMethod.POST)
	public @ResponseBody String delete(Long[] ids){
		JSONObject jsonObject=new JSONObject();
		if(ids!=null){
			for(Long id:ids){
				roleService.deleteByPrimaryKey(id);
			}
		}
		jsonObject.put("status", "200");
		return jsonObject.toJSONString();
	}
	
	
}
