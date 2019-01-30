package com.bidr.mongo.entity;

import org.geojson.FeatureCollection;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection="marsgis_plot")
public class MarsgisPlot extends FeatureCollection{
	@Id
	private String username;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	

}
