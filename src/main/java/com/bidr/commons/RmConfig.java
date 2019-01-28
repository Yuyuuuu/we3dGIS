package com.bidr.commons;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RmConfig {
	@Value("rm.websocket.url")
	private String webSocketUrl;
	@Value("rm.ftp.host")
	private String ftpHost;
	@Value("rm.ftp.port")
	private int port;
	@Value("rm.ftp.username")
	private String ftpUsername;
	@Value("rm.ftp.password")
	private String ftpPassword;
	@Value("rm.ftp.urlPrefix")
	private String UrlPrefix;
	public String getWebSocketUrl() {
		return webSocketUrl;
	}
	public void setWebSocketUrl(String webSocketUrl) {
		this.webSocketUrl = webSocketUrl;
	}
	public String getFtpHost() {
		return ftpHost;
	}
	public void setFtpHost(String ftpHost) {
		this.ftpHost = ftpHost;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getFtpUsername() {
		return ftpUsername;
	}
	public void setFtpUsername(String ftpUsername) {
		this.ftpUsername = ftpUsername;
	}
	public String getFtpPassword() {
		return ftpPassword;
	}
	public void setFtpPassword(String ftpPassword) {
		this.ftpPassword = ftpPassword;
	}
	public String getUrlPrefix() {
		return UrlPrefix;
	}
	public void setUrlPrefix(String urlPrefix) {
		UrlPrefix = urlPrefix;
	}
	
	
}
