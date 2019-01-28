package com.bidr.service;

import java.util.List;
import java.util.Map;

import com.bidr.entity.Admin;

public interface AdminService {
	int deleteByPrimaryKey(Long id);

	int insert(Admin record);

	int insertSelective(Admin record);

	Admin selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(Admin record);

	int updateByPrimaryKey(Admin record);

	List<Admin> findAll();

	Admin selectAdmin(Long id);

	int updateAdminRole(Admin record);

	boolean checkUsername(String username);

	String getLoginToken();

	Admin findByUsername(String username);
	List<String> findAuthorities(Long id);

	boolean isAuthenticated();

	Admin getCurrent();

	String getCurrentUsername();
	
	Map<String,Integer> selectAllFileCount();
	
	List<Map<String,Integer>> selectAllInfo();
}
