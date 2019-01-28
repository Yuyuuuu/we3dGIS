package com.bidr.controller;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
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
import com.bidr.mapper.AdminMapper;
import com.bidr.service.impl.AdminServiceImpl;
import com.bidr.service.impl.RoleServiceImpl;
import com.bidr.utils.JsonUtils;

@Controller("AdminController")
@RequestMapping("/admin")
public class AdminController {
	
	@Autowired
	private AdminServiceImpl adminService;
	@Autowired
	private RoleServiceImpl roleService;
	
	/**
	 * 跳转管理员页面
	 * @return
	 */
	@RequestMapping("/index")
	public String index(){
		return "admin/index";
	}
	/**
	 * 跳转新增页面
	 * @return
	 */
	@RequestMapping("/addPage")
	public String addPage(ModelMap model){
		List<Role> roles=roleService.findAll();
		model.put("roles", roles);
		return "admin/add";
	}
	/**
	 * 跳转编辑页面
	 * @return
	 */
	@RequestMapping("/editPage")
	public String editPage(Long id,ModelMap model){
		Admin admin=adminService.selectAdmin(id);
		model.put("admin", admin);
		List<Role> roles=roleService.findAll();
		model.put("roles", roles);
		return "admin/edit";
	}
	
	/**
	 * 查询数据
	 * @return
	 */
	@RequestMapping(value="/query",produces = "text/plain; charset=utf-8")
	public @ResponseBody String query(){
		List<Admin> listAdmin=adminService.findAll();
		return JSONArray.toJSONString(listAdmin);
	}
	
	/**
	 * 添加
	 * @param admin
	 * @return
	 */
	@RequestMapping(value="/add",method=RequestMethod.POST)
	public @ResponseBody String add(@RequestBody Admin admin){
		JSONObject jsonObject=new JSONObject();
		admin.setCreate_date(new Date());
		admin.setModify_date(new Date());
		admin.setVersion(1L);
		admin.setIs_locked(false);
		admin.setLock_key("as");
		admin.setLogin_failure_count(0);
		adminService.insert(admin);
		jsonObject.put("status", "200");
		return jsonObject.toJSONString();
	}
	/**
	 * 编辑
	 * @param admin
	 * @return
	 */
	@RequestMapping(value="/edit",method=RequestMethod.POST)
	public @ResponseBody String edit(@RequestBody Admin admin){
		JSONObject jsonObject=new JSONObject();
		adminService.updateByPrimaryKeySelective(admin);
		adminService.updateAdminRole(admin);
		return jsonObject.toJSONString();
	}
	/**
	 * 删除
	 * @param ids
	 * @return
	 */
	@RequestMapping(value="/delete",method=RequestMethod.POST)
	public @ResponseBody String delete(Long[] ids){
		JSONObject jsonObject=new JSONObject();
		if(ids!=null){
			for(Long id:ids){
				adminService.deleteByPrimaryKey(id);
			}
		}
		jsonObject.put("status", "200");
		return jsonObject.toJSONString();
	}
	@RequestMapping(value="/checkUsername", method=RequestMethod.GET)
	public @ResponseBody boolean checkUsername(String username){
		if(StringUtils.isEmpty(username)){
			return false;
		}
		return adminService.checkUsername(username);
	}
	
}
