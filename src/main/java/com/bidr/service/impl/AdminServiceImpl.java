package com.bidr.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bidr.entity.Admin;
import com.bidr.mapper.AdminMapper;
import com.bidr.service.AdminService;
import com.bidr.shiro.Principal;

@Service("adminServiceImpl")
public class AdminServiceImpl implements AdminService{
	
	@Autowired
	private AdminMapper adminMapper;

	@Override
	public int deleteByPrimaryKey(Long id) {
		return adminMapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(Admin record) {
		int admins=adminMapper.insert(record);
		Map<String,Object> params=new HashMap<String,Object>();
		params.put("admins", record.getId());
		params.put("roles", record.getRoles());
		return adminMapper.insertAdminRole(params);
	}

	@Override
	public int insertSelective(Admin record) {
		// TODO Auto-generated method stub
		return adminMapper.insertSelective(record);
	}

	@Override
	public Admin selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return adminMapper.selectByPrimaryKey(id);
	}

	@Override
	public int updateByPrimaryKeySelective(Admin record) {
		// TODO Auto-generated method stub
		return adminMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKey(Admin record) {
		// TODO Auto-generated method stub
		return adminMapper.updateByPrimaryKey(record);
	}

	@Override
	public List<Admin> findAll() {
		// TODO Auto-generated method stub
		return adminMapper.findAll();
	}

	@Override
	public Admin selectAdmin(Long id) {
		// TODO Auto-generated method stub
		return adminMapper.selectAdmin(id);
	}

	@Override
	public int updateAdminRole(Admin record) {
		// TODO Auto-generated method stub
		return adminMapper.updateAdminRole(record);
	}

	@Override
	public boolean checkUsername(String username) {
		// TODO Auto-generated method stub
		return adminMapper.checkUsername(username)>0?false:true;
	}



	@Override
	public Admin findByUsername(String username) {
		// TODO Auto-generated method stub
		return adminMapper.findByUsername(username);
	}
	/**
	 * 获取登录的token
	 * 在缓存中存储一份token
	 */
	@Transactional(readOnly = true)
	@Cacheable(value = "loginToken")
	public String getLoginToken() {
		String token=DigestUtils.md5Hex(UUID.randomUUID() + RandomStringUtils.randomAlphabetic(30));
		return token;
	}

	@Override
	public List<String> findAuthorities(Long id) {
		List<String> authorities=adminMapper.findAuthorities(id);
		List<String> authoritiesList=new ArrayList<String>();
		for (String  authorite: authorities) {
			authoritiesList.addAll(Arrays.asList(authorite.split(",")));
		}
		return authoritiesList;
	}

	@Override
	public boolean isAuthenticated() {
		Subject subject = SecurityUtils.getSubject();
		if (subject != null) {
			return subject.isAuthenticated();
		}
		return false;
	}

	@Override
	public Admin getCurrent() {
		Subject subject = SecurityUtils.getSubject();
		if (subject != null) {
			Principal principal = (Principal) subject.getPrincipal();
			if (principal != null) {
				return adminMapper.selectByPrimaryKey(principal.getId());
			}
		}
		return null;
	}

	@Override
	public String getCurrentUsername() {
		Subject subject = SecurityUtils.getSubject();
		if (subject != null) {
			Principal principal = (Principal) subject.getPrincipal();
			if (principal != null) {
				return principal.getUsername();
			}
		}
		return null;
	}

	@Override
	public Map<String, Integer> selectAllFileCount() {
		// TODO Auto-generated method stub
		return adminMapper.selectAllFileCount();
	}

	@Override
	public List<Map<String, Integer>> selectAllInfo() {
		// TODO Auto-generated method stub
		return adminMapper.selectAllInfo();
	}
	
	
	


	
}
