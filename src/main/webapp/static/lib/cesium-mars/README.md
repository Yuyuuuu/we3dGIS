#cesium-mars  基于Cesium的Web三维地球的 功能插件

本地版本： 1.06
更新日期：

官方地址：http://cesium.marsgis.cn

介绍：
	MarsGIS for Cesium三维地球框架 是火星科技研发的一个Web三维地图开发平台系统 。平台框架核心功能编写在cesium-mars类库中，
	该类库是我们开发并打包编译生产的一个js和一个css文件，引用这2个文件即可使用框架功能。


使用：
(1)普通web页面使用时，直接在Cesium库引入后引入该库css和js文件即可
(2)node环境下，需要install 2个依赖库 jquery 、Cesium 后使用
	import mars3d from './cesium-mars/mars3d.js';