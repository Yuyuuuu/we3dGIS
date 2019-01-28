<!DOCTYPE HTML>
<html lang="zh-cn">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>角色管理</title>

	<link href="${base}/plugins/bootstrap-3.3.0/css/bootstrap.min.css" rel="stylesheet"/>
	<link href="${base}/plugins/material-design-iconic-font-2.2.0/css/material-design-iconic-font.min.css" rel="stylesheet"/>
	<link href="${base}/plugins/bootstrap-table-1.11.0/bootstrap-table.min.css" rel="stylesheet"/>
	<link href="${base}/plugins/waves-0.7.5/waves.min.css" rel="stylesheet"/>
	<link href="${base}/plugins/jquery-confirm/jquery-confirm.min.css" rel="stylesheet"/>
	<link href="${base}/plugins/select2/css/select2.min.css" rel="stylesheet"/>
	<link href="${base}/static/layui/css/layui.css" rel="stylesheet"/>
	<link href="${base}/static/css/common.css" rel="stylesheet"/>
</head>
<body>
<div id="main">
	<div id="toolbar">
		<a class="waves-effect waves-button" href="javascript:;" onclick="createAction()"><i class="zmdi zmdi-plus"></i> 新增角色</a>
		<a class="waves-effect waves-button" href="javascript:;" onclick="updateAction()"><i class="zmdi zmdi-edit"></i> 编辑角色</a>
		<a class="waves-effect waves-button" href="javascript:;" onclick="deleteAction()"><i class="zmdi zmdi-close"></i> 删除角色</a>
	</div>
	<table id="table"  class="table table-bordered"></table>
</div>

<script src="${base}/static/js/jquery.min.js"></script>
<script src="${base}/plugins/bootstrap-3.3.0/js/bootstrap.min.js"></script>
<script src="${base}/plugins/bootstrap-table-1.11.0/bootstrap-table.min.js"></script>
<script src="${base}/plugins/bootstrap-table-1.11.0/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${base}/plugins/waves-0.7.5/waves.min.js"></script>
<script src="${base}/plugins/jquery-confirm/jquery-confirm.min.js"></script>
<script src="${base}/plugins/select2/js/select2.min.js"></script>
<script src="${base}/static/layui/layui.all.js"></script>
<script src="${base}/static/js/common.js"></script>
<script>
var $table = $('#table');
$(function() {
	$(document).on('focus', 'input[type="text"]', function() {
		$(this).parent().find('label').addClass('active');
	}).on('blur', 'input[type="text"]', function() {
		if ($(this).val() == '') {
			$(this).parent().find('label').removeClass('active');
		}
	});
	$table.bootstrapTable({
		url: '${base}/role/query.jhtml',
		height: getHeight(),
		striped: true,
		search: true,
		searchOnEnterKey: true,
		showRefresh: true,
		showToggle: true,
		showColumns: true,
		minimumCountColumns: 2,
		showPaginationSwitch: true,
		clickToSelect: true,
		detailView: true,
		detailFormatter: 'detailFormatter',
		pagination: true,
		paginationLoop: false,
		classes: 'table table-hover table-no-bordered',
		//sidePagination: 'server',
		//silentSort: false,
		smartDisplay: false,
		idField: 'id',
		sortName: 'id',
		sortOrder: 'desc',
		escape: true,
		searchOnEnterKey: true,
		idField: 'systemId',
		maintainSelected: true,
		toolbar: '#toolbar',
		columns: [
			{field: 'state', checkbox: true},
			{field: 'id', title: '', visible:false},
			{field: 'name', title: '名称', sortable: true, align: 'center'},
			{field: 'is_system', title: '是否内置', align: 'center'},
			{field: 'description', title: '描述', sortable: true, align: 'center'},
			{field: 'create_date', title: '创建日期', sortable: true, align: 'center',formatter: function (value, row, index) {return changeDateFormat(value)}},
			{field: 'action', title: '操作', halign: 'center', align: 'center', formatter: 'actionFormatter', events: 'actionEvents', clickToSelect: false}
		]
	}).on('all.bs.table', function (e, name, args) {
		$('[data-toggle="tooltip"]').tooltip();
		$('[data-toggle="popover"]').popover();  
	});
});
function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i></a>　',
        '<a class="remove ml10" href="javascript:void(0)" data-toggle="tooltip" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>'
    ].join('');
}

window.actionEvents = {
    'click .edit': function (e, value, row, index) {
    	var rows=new Array();
    	rows.push(row);
    	updateAction(rows);
    },
    'click .remove': function (e, value, row, index) {
    	var rows=new Array();
    	rows.push(row);
        deleteAction(rows);
    }
};
function detailFormatter(index, row) {
	var html = [];
	$.each(row, function (key, value) {
		html.push('<p><b>' + key + ':</b> ' + value + '</p>');
	});
	return html.join('');
}
// 新增
function createAction() {
	var layer = layui.layer;
	var addlayer=layer.open({
	  title:'新增角色',
	  skin:'layui-layer-lan',
	  area: ['900px', '400px'],
	  type: 2, 
	  content: '${base}/role/addPage.jhtml',
	  end: function () {
        location.reload();
      }
	}); 
	layer.full(addlayer);
}
// 编辑
function updateAction(rows) {
	var layer = layui.layer;
	if(rows==null){
		var rows = $table.bootstrapTable('getSelections');
	}
	if (rows.length == 0) {
		layer.msg('请选择要编辑的数据！',{icon: 0});
	}else if(rows.length > 1){
		layer.msg('只能选择一条数据进行编辑！',{icon: 0});
	}else{
		var id=rows[0].id
		
		var editlayer=layer.open({
		  title:'编辑角色',
		  skin:'layui-layer-lan',
		  area: ['900px', '400px'],
		  type: 2, 
		  content: '${base}/role/editPage.jhtml?id='+id,
		  end: function () {
	        location.reload();
	      }
		}); 
		layer.full(editlayer);
	}
	
}
// 删除
function deleteAction(rows) {
	if(rows==null){
		var rows = $table.bootstrapTable('getSelections');
	}
	var layer = layui.layer;
	if (rows.length == 0) {
		layer.msg('请选择要删除的数据！',{icon: 0});
	} else {
		layer.confirm('确定要删除吗?', {icon: 3, title:'提示'}, function(index){
			  layer.close(index);
	  		  var ids = new Array();
			  for (var i in rows) {
				ids.push(rows[i].id);
			  }
			  $.ajax({
		   	 	url:'${base}/role/delete.jhtml',
		   	 	traditional:true,
		   	 	type:'post',
		   	 	data:{"ids":ids},
		   	 	dataType:'json',
	    		beforeSend:function (request) {
					loadIndex = layer.load();
				},
	    		success:function(jsonObject) {
					layer.close(loadIndex);
					$table.bootstrapTable("refresh");
				}								
			});
			 
			  
		});
	}
}
</script>
</body>
</html>