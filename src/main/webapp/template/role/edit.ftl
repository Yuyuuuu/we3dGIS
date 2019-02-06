<!DOCTYPE HTML>
<html lang="zh-cn">
<head>
	<link href="${base}/static/layui/css/layui.css" rel="stylesheet"/>
	<script src="${base}/static/js/jquery.min.js"></script>
	<script src="${base}/static/layui/layui.all.js"></script>
</head>
<body>
<div class="layui-container">  
	<div class="layui-row" style="padding-top: 30px;">
		<form class="layui-form" action="" lay-filter="editRole">
		  <div class="layui-form-item">
		    <label class="layui-form-label">角色名称</label>
		    <div class="layui-input-block">
		      <input type="hidden" name="id" value="${role.id}" />
		      <input type="text" name="name" value="${role.name}" lay-verify="required" autocomplete="off" placeholder="请输入角色名称" class="layui-input">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">角色描述</label>
		    <div class="layui-input-block">
		      <input type="text" name="description" value="${role.description}" lay-verify="required" placeholder="请输入角色描述" autocomplete="off" class="layui-input">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">权限管理</label>
		    <div class="layui-input-block">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("admin:user")> checked="checked" </#if> name="admin:user" value="admin:user" lay-filter="authorities" title="用户管理">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("admin:role")> checked="checked" </#if>  name="admin:role" value="admin:role" lay-filter="authorities" title="角色管理">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">信息展示</label>
		    <div class="layui-input-block">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("info:qy")> checked="checked" </#if>  name="info:qy" value="info:qy" lay-filter="authorities" title="企业点">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("info:data")> checked="checked" </#if>  name="info:data" value="info:data" lay-filter="authorities" title="动态数据">
		      
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">三维模型</label>
		    <div class="layui-input-block">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("model:city")> checked="checked" </#if>  name="model:city" value="model:city" lay-filter="authorities" title="城市建筑">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("model:manMolde")> checked="checked" </#if>  name="model:manMolde" value="model:manMolde" lay-filter="authorities" title="人工模型">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("model:photo")> checked="checked" </#if>  name="model:photo" value="model:photo" lay-filter="authorities" title="倾斜摄影">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("model:pipe")> checked="checked" </#if>  name="model:pipe" value="model:pipe" lay-filter="authorities" title="管网">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">数据分析</label>
		    <div class="layui-input-block">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("analyse:zh")> checked="checked" </#if>  name="analyse:zh" value="analyse:zh" lay-filter="authorities" title="综合分析">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("analyse:zx")> checked="checked" </#if>  name="analyse:zx" value="analyse:zx" lay-filter="authorities" title="专项分析">
		    </div>
		  </div>
		   <div class="layui-form-item">
		    <label class="layui-form-label">综合态势</label>
		    <div class="layui-input-block">
		      <input type="checkbox" <#if role.authoritieList?seq_contains("situation:zh")> checked="checked" </#if>  name="situation:zh" value="situation:zh" lay-filter="authorities" title="综合态势">
		      
		    </div>
		  </div>
		 
		   <div class="layui-form-item">
		    <div class="layui-input-block">
		      <button class="layui-btn" lay-submit="" lay-filter="submitRoleForm">立即提交</button>
		      <button type="reset" class="layui-btn layui-btn-primary">重置</button>
		    </div>
		  </div>
		</form>
	</div>
</div>


<script>
	var form=layui.form;
	form.render();
	var authorities=[];
	<#list role.authoritieList as authoritie>
		authorities.push("${authoritie?string}");
	</#list>
	form.on('checkbox(authorities)', function(data){
	  var isChecked=data.elem.checked;
	  var authoritie=data.value;
	  if(isChecked){
	  	authorities.push(authoritie);
	  }else{
	  	var index = authorities.indexOf(authoritie);
	  	authorities.splice(index, 1);
	  }
	 console.log(authorities);
	});  
	form.on('submit(submitRoleForm)', function(data){
		var data=data.field;
		data["authorities"]=authorities+"";
		console.log(JSON.stringify(data));
	   	 $.ajax({
	   	 	url:'${base}/role/edit.jhtml',
	   	 	contentType: "application/json", //必须这样写
	   	 	type:'post',
	   	 	data:JSON.stringify(data),
	   	 	dataType:'json',
    		beforeSend:function (request) {
				loadIndex = layer.load();
			},
    		success:function(jsonObject) {
				layer.close(loadIndex);
				var parentIndex = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
				parent.layer.close(parentIndex); //再执行关闭   
			}								
		});
	    return false;
	  });
	  //表单初始赋值
	
</script>
</body>
</html>