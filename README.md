[![build status](http://192.168.9.68/cmcc/develop-base/badges/dev/build.svg)](http://192.168.9.68/cmcc/develop-base/commits/dev)

# 贵州移动DevOps平台
------------
###### 最新版本：v1.4.8
###### <a href="http://192.168.9.61:10003">测试平台访问地址</a>

### 项目简介

1、项目管理，实时监控各项目进展，当前开发版本，已上线版本，实时了解处于开发，测试，运维等各阶段项目情况

2、持续集成，代码提交后，进行自动测试，自动构建，自动部署，实现快速高效交付。

3、微服务化，应用拆分成各个微服务单元，架构简单，扩展，移植能力强。

4、应用市场，将能力进行微服务封装后，降低第三方复用门槛，部署简单便捷。

5、集中运维，实现上线既开始运维，通过集中的运维平台，实时了解各项目和集群运行情况。


***************


### 代码规范


#### docker 命名规范：
>
docker_registry:端口/项目组（对应gitlab中group）/项目名称

xx
示例：

> 192.168.9.69:5000/cmcc/develop-base    


***************

开发语言：nodejs

<img src="Code/develop-base/public/static/images/nodejs.png"> 

数据库：mysql

<img src="Code/develop-base/public/static/images/mysql.png"> 

内存数据库：mongodb

<img src="Code/develop-base/public/static/images/mongodb.png"> 

缓存：memcached

<img src="Code/develop-base/public/static/images/memcached.png"> 

------
### 链接地址
<a href="http://192.168.9.69:18081/devops/index.html">项目进度计划</a>

<a href="http://192.168.9.65:5050">mesos</a>

<a href="http://192.168.9.61:8080">marathon</a>

<a href="http://192.168.9.68">gitlab</a>

<a href="http://192.168.9.69:18080">docker-registry</a>

<a href="http://192.168.9.69:3000">granafa</a>

<a href="http://192.168.9.69:8083">influxdb</a>
