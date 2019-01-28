package com.bidr.shiro;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import com.bidr.entity.Admin;
import com.bidr.exception.KickOutException;
import com.bidr.service.AdminService;
import com.bidr.service.impl.AdminServiceImpl;
import com.bidr.utils.SpringUtils;

public class AuthenticationRealm extends AuthorizingRealm {

	@Resource(name="adminServiceImpl")
	public AdminService adminService;
	@Autowired
	private SessionDAO sessionDao;
	

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(org.apache.shiro.authc.AuthenticationToken token) {
		AuthenticationToken authenticationToken = (AuthenticationToken) token;
		String username = authenticationToken.getUsername();
		String password = new String(authenticationToken.getPassword());
		String ip = authenticationToken.getHost();
		//判断单用户登录
	  /*  Collection<Session> sessions = sessionDao.getActiveSessions();
	    for (Session session : sessions) {
	    	Object o = session.getAttribute("username");
	    	if(o!=null){
	    		if(username.equals(o.toString())){
	    			throw new KickOutException();
	    		}
	    	}
		}*/
		
		if (username != null && password != null) {
			Admin admin = adminService.findByUsername(username);
			if (admin == null) {
				throw new UnknownAccountException();
			}
			if (!admin.getIs_enabled()) {
				throw new DisabledAccountException();
			}
	
			if (admin.getIs_locked()) {
					int loginFailureLockTime = 3;
					Date lockedDate = admin.getLocked_date();
					Date unlockDate = DateUtils.addMinutes(lockedDate, loginFailureLockTime);
					if (new Date().after(unlockDate)) {
						admin.setLogin_failure_count(0);
						admin.setIs_locked(false);
						admin.setLocked_date(null);
						adminService.updateByPrimaryKey(admin);
					} else {
						throw new LockedAccountException();
					}
				
			}
			if (!password.equals(admin.getPassword())) {
				int loginFailureCount = admin.getLogin_failure_count() + 1;
				if (loginFailureCount >= 5) {
					admin.setIs_locked(true);
					admin.setLocked_date(new Date());
				}
				admin.setLogin_failure_count(loginFailureCount);
				adminService.updateByPrimaryKey(admin);
				throw new IncorrectCredentialsException();
			}
			admin.setLogin_ip(ip);
			admin.setLogin_date(new Date());
			admin.setLogin_failure_count(0);
			adminService.updateByPrimaryKey(admin);
			return new SimpleAuthenticationInfo(new Principal(admin.getId(), username), password, getName());
		}
		throw new UnknownAccountException();
	}

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
		Principal principal = (Principal) principalCollection.fromRealm(getName()).iterator().next();
		if (principal != null) {
			List<String> authorities = adminService.findAuthorities(principal.getId());
			if (authorities != null) {
				SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
				authorizationInfo.addStringPermissions(authorities);
				return authorizationInfo;
			}
		}
		return null;
	}

}


