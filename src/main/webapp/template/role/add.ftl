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
		<form class="layui-form" action="" lay-filter="addRole">
		  <div class="layui-form-item">
		    <label class="layui-form-label">角色名称</label>
		    <div class="layui-input-block">
		      <input type="text" name="name" lay-verify="required" autocomplete="off" placeholder="请输入角色名称" class="layui-input">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">角色描述</label>
		    <div class="layui-input-block">
		      <input type="text" name="description" lay-verify="required" placeholder="请输入角色描述" autocomplete="off" class="layui-input">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">权限管理</label>
		    <div class="layui-input-block">
		      <input type="checkbox" name="authorities" value="admin:user" lay-filter="authorities" title="用户管理">
		      <input type="checkbox" name="authorities" value="admin:role" lay-filter="authorities" title="角色管理">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">监测数据</label>
		    <div class="layui-input-block">
		      <input type="checkbox" name="authorities" value="monitor:data" lay-filter="authorities" title="监测数据录入">
		      <input type="checkbox" name="authorities" value="monitor:file" lay-filter="authorities" title="监测文件管理">
		      <input type="checkbox" name="authorities" value="monitor:view" lay-filter="authorities" title="监测文件预览">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">地质数据</label>
		    <div class="layui-input-block">
		      <input type="checkbox" name="authorities" value="geology:data" lay-filter="authorities" title="地质数据录入">
		      <input type="checkbox" name="authorities" value="geology:file" lay-filter="authorities" title="地质文件管理">
		      <input type="checkbox" name="authorities" value="geology:view" lay-filter="authorities" title="地质文件预览">
		    </div>
		  </div>
		  <div class="layui-form-item">
		    <label class="layui-form-label">施工进度管理</label>
		    <div class="layui-input-block">
		      <input type="checkbox" name="authorities" value="progress:data" lay-filter="authorities" title="施工数据录入">
		      <input type="checkbox" name="authorities" value="progress:file" lay-filter="authorities" title="施工文件管理">
		      <input type="checkbox" name="authorities" value="progress:view" lay-filter="authorities" title="施工文件预览">
		    </div>
		  </div>
		
		    <div class="layui-form-item">
		    <label class="layui-form-label">设计文件</label>
		    <div class="layui-input-block">
		      <input type="checkbox" name="authorities" value="design:file" lay-filter="authorities" title="文件管理">
		      <input type="checkbox" name="authorities" value="design:view" lay-filter="authorities" title="文件查看">
		    </div>
		  </div>
		    <div class="layui-form-item">
		    <label class="layui-form-label">现场照片</label>
		    <div class="layui-input-block">
		      <input type="checkbox" name="authorities" value="photo:upload" lay-filter="authorities" title="照片上传">
		      <input type="checkbox" name="authorities" value="photo:view" lay-filter="authorities" title="照片查看">
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
	form.on('checkbox(authorities)', function(data){
	  var isChecked=data.elem.checked;
	  var authoritie=data.value+"";
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
	   	 	url:'${base}/role/add.jhtml',
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
</script>
</body>
</html>