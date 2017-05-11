
# 软件部署说明
------------
#### 1、docker registry
	sudo docker run -d -v /opt/registry:/var/lib/registry -p 5000:5000 --restart=always --name registry registry

安装完成检查

http://192.168.31.xxx:5000/v2/_catalog