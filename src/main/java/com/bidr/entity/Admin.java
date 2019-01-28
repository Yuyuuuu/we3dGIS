package com.bidr.entity;

import java.util.Date;

public class Admin {
	public static final String LOGIN_TOKEN_COOKIE_NAME = "adminLoginToken";
    private Long id;

    private Date create_date;

    private Date modify_date;

    private Long version;

    private String department;

    private String email;

    private Boolean is_enabled;

    private Boolean is_locked;

    private String lock_key;

    private Date locked_date;

    private Date login_date;

    private Integer login_failure_count;

    private String login_ip;

    private String name;

    private String password;

    private String username;
    
    private String roles;
    
    

    public String getRoles() {
		return roles;
	}

	public void setRoles(String roles) {
		this.roles = roles;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department == null ? null : department.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public Boolean getIs_enabled() {
        return is_enabled;
    }

    public void setIs_enabled(Boolean is_enabled) {
        this.is_enabled = is_enabled;
    }

    public Boolean getIs_locked() {
        return is_locked;
    }

    public void setIs_locked(Boolean is_locked) {
        this.is_locked = is_locked;
    }

    public String getLock_key() {
        return lock_key;
    }

    public void setLock_key(String lock_key) {
        this.lock_key = lock_key == null ? null : lock_key.trim();
    }

    public Date getLocked_date() {
        return locked_date;
    }

    public void setLocked_date(Date locked_date) {
        this.locked_date = locked_date;
    }

    public Date getLogin_date() {
        return login_date;
    }

    public void setLogin_date(Date login_date) {
        this.login_date = login_date;
    }

    public Integer getLogin_failure_count() {
        return login_failure_count;
    }

    public void setLogin_failure_count(Integer login_failure_count) {
        this.login_failure_count = login_failure_count;
    }

    public String getLogin_ip() {
        return login_ip;
    }

    public void setLogin_ip(String login_ip) {
        this.login_ip = login_ip == null ? null : login_ip.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }
}