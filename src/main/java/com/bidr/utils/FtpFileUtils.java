package com.bidr.utils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.SocketException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bidr.commons.RmConfig;

@Component
public class FtpFileUtils {
	@Autowired
	private RmConfig rmConfig;
	private static final String host = "47.92.158.107";
	private static final int port = 21;
	private static final String username = "Administrator";
	private static final String password = "Bidr2018";
	public static final String urlPrefix = "https://www.rongbin.tech/img/rm/";
	public static void upload(String path, File file, String contentType) {
		FTPClient ftpClient = new FTPClient();
		InputStream inputStream = null;
		try {
			inputStream = new BufferedInputStream(new FileInputStream(file));
			ftpClient.connect(host, port);
			ftpClient.login(username, password);
			ftpClient.setFileTransferMode(FTP.STREAM_TRANSFER_MODE);
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
			ftpClient.enterLocalPassiveMode();
			if (FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {
				String directory = StringUtils.substringBeforeLast(path, "/");
				String filename = StringUtils.substringAfterLast(path, "/");
				if (!ftpClient.changeWorkingDirectory(directory)) {
					String[] paths = StringUtils.split(directory, "/");
					String p = "/";
					ftpClient.changeWorkingDirectory(p);
					for (String s : paths) {
						p += s + "/";
						if (!ftpClient.changeWorkingDirectory(p)) {
							ftpClient.makeDirectory(s);
							ftpClient.changeWorkingDirectory(p);
						}
					}
				}
				ftpClient.storeFile(filename, inputStream);
				ftpClient.logout();
			}
		} catch (SocketException e) {
			throw new RuntimeException(e.getMessage(), e);
		} catch (IOException e) {
			throw new RuntimeException(e.getMessage(), e);
		} finally {
			IOUtils.closeQuietly(inputStream);
			try {
				if (ftpClient.isConnected()) {
					ftpClient.disconnect();
				}
			} catch (IOException e) {
			}
		}

	}
	public static String getUrl(String path) {
		return urlPrefix+path;
	}
	/**
	 * * 删除文件 *
	 * 
	 * @param pathname
	 *            FTP服务器保存目录 *
	 * @param filename
	 *            要删除的文件名称 *
	 * @return
	 */
	public static boolean deleteFile(String pathname, String filename) {
		boolean flag = false;
		FTPClient ftpClient = new FTPClient();
		try {
			System.out.println("开始删除文件");
			ftpClient.connect(host, port);
			ftpClient.login(username, password);
			ftpClient.setFileTransferMode(FTP.STREAM_TRANSFER_MODE);
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
			ftpClient.enterLocalPassiveMode();
			if (FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {
				// 切换FTP目录
				ftpClient.changeWorkingDirectory(pathname);
				ftpClient.dele(filename);
				ftpClient.logout();
				flag = true;
				System.out.println("删除文件成功");
			}
		} catch (Exception e) {
			System.out.println("删除文件失败");
			e.printStackTrace();
		} finally {
			if (ftpClient.isConnected()) {
				try {
					ftpClient.disconnect();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return flag;
	}
	
	public static void main(String[] args) {
		String path="https://www.rongbin.tech/img/rm/file/4d815094-6c30-4710-a30f-31fd7a59328c.pdf";
		String filename=path.substring(path.lastIndexOf("/")+1, path.length());
		String pathname=path.replace(FtpFileUtils.urlPrefix,"");
		System.out.println(pathname);
	}
}
