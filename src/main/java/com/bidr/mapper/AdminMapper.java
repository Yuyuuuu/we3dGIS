package com.bidr.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.bidr.entity.Admin;

public interface AdminMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Admin record);

    int insertSelective(Admin record);

    Admin selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Admin record);

    int updateByPrimaryKey(Admin record);
    
     List<Admin> findAll();
	 Admin selectAdmin(Long id);
	 int updateAdminRole(Admin record);
	 int checkUsername(String username);
	 int insertAdminRole(Map<String,Object> params);

	Admin findByUsername(String username);
	List<String> findAuthorities(@Param("id")Long id);
	Map<String,Integer> selectAllFileCount();  
	List<Map<String,Integer>> selectAllInfo();
	  
}