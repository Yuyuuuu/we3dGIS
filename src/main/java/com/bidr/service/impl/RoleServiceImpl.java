package com.bidr.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bidr.entity.Role;
import com.bidr.mapper.RoleMapper;
import com.bidr.service.RoleService;
@Service("RoleServiceImpl")
public class RoleServiceImpl implements RoleService {
	
	@Autowired
	private RoleMapper roleMapper;
	@Override
	public int deleteByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		return roleMapper.deleteByPrimaryKey(id);
	}

	@Override
	public int insert(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.insert(record);
	}

	@Override
	public int insertSelective(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.insertSelective(record);
	}

	@Override
	public Role selectByPrimaryKey(Long id) {
		// TODO Auto-generated method stub
		Role role=roleMapper.selectByPrimaryKey(id);
		String authorities=role.getAuthorities();
		role.setAuthoritieList(Arrays.asList(authorities.split(",")));
		return role;
	}

	@Override
	public int updateByPrimaryKeySelective(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.updateByPrimaryKeySelective(record);
	}

	@Override
	public int updateByPrimaryKeyWithBLOBs(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.updateByPrimaryKeyWithBLOBs(record);
	}

	@Override
	public int updateByPrimaryKey(Role record) {
		// TODO Auto-generated method stub
		return roleMapper.updateByPrimaryKey(record);
	}

	@Override
	public List<Role> findAll() {
		// TODO Auto-generated method stub
		return roleMapper.findAll();
	}
	

}
