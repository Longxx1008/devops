## 监控部分


##### 1、telegraf安装

下载地址：

[https://portal.influxdata.com/downloads](https://portal.influxdata.com/downloads)

配置文件：

ubuntu安装案例：

	wget https://dl.influxdata.com/telegraf/releases/telegraf_1.3.0-1_amd64.deb && sudo dpkg -i telegraf_1.3.0-1_amd64.deb

	scp weihu@192.168.9.45:/etc/telegraf/telegraf.conf /etc/telegraf/telegraf.conf

	service telegraf restart

---

##### 2、增加docker监控
###### 方法一

	vi /etc/default/docker

增加内容：
	
	DOCKER_OPTS="-H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375"

重启服务
	
	docker：sudo service docker restart


###### 方法二：

	sudo nano /lib/systemd/system/docker.service

	ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock

	systemctl daemon-reload

	systemctl restart docker

---

##### 3、influxdb 安装

	docker run -d --volume=/var/influxdb:/data -p 8083:8083 -p 8086:8086 --restart=always --name influxdb tutum/influxdb



---

##### 4、grafana 安装

 	docker run -d -p 3000:3000  -v /var/grafana:/var/lib/grafana --restart=always   --name grafana  -e "GF_SECURITY_ADMIN_PASSWORD=admin" -e "GF_AUTH_ANONYMOUS_ENABLED=true"  -e "GF_ALERTING_EXECUTE_ALERTS=true" grafana/grafana:4.2.0
