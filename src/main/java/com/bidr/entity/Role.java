package com.bidr.entity;

import java.util.Date;
import java.util.List;

public class Role {
    private Long id;

    private Date create_date;

    private Date modify_date;

    private Long version;

    private String description;

    private Boolean is_system;

    private String name;

    private String authorities;
    private List<String> authoritieList;
    

    public List<String> getAuthoritieList() {
		return authoritieList;
	}

	public void setAuthoritieList(List<String> authoritieList) {
		this.authoritieList = authoritieList;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreate_date() {
        return create_date;
    }

    public void setCreate_date(Date create_date) {
        this.create_date = create_date;
    }

    public Date getModify_date() {
        return modify_date;
    }

    public void setModify_date(Date modify_date) {
        this.modify_date = modify_date;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Boolean getIs_system() {
        return is_system;
    }

    public void setIs_system(Boolean is_system) {
        this.is_system = is_system;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getAuthorities() {
        return authorities;
    }

    public void setAuthorities(String authorities) {
        this.authorities = authorities == null ? null : authorities.trim();
    }
}