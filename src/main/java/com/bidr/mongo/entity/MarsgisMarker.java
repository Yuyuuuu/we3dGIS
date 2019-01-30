package com.bidr.mongo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
@Document(collection="marsgisMarker")
public class MarsgisMarker {
	@Field
	private String id;
	@Field
	private String name;
	@Field
	private String remark;
	@Field
	private double x;
	@Field
	private double y;
	@Field
	private double z;
	@Field
	private String username;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public double getX() {
		return x;
	}
	public void setX(double x) {
		this.x = x;
	}
	public double getY() {
		return y;
	}
	public void setY(double y) {
		this.y = y;
	}
	public double getZ() {
		return z;
	}
	public void setZ(double z) {
		this.z = z;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public MarsgisMarker() {
		
	}
	public MarsgisMarker(String id, String name, String remark, double x, double y, double z, String username) {
		super();
		this.id = id;
		this.name = name;
		this.remark = remark;
		this.x = x;
		this.y = y;
		this.z = z;
		this.username = username;
	}
	
	
	
	
}
