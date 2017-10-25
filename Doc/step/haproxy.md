页面详细参数解释

Queue

Cur: current queued requests //当前的队列请求数量

Max：max queued requests     //最大的队列请求数量

Limit：           //队列限制数量

---
Session rate(每秒的连接回话)列表：

scur: current sessions        //每秒的当前回话的请求数量

smax: max sessions           //每秒的新的最大的会话量

slim: sessions limit           //每秒的新回话的限制数量

---
Sessions 

Total:            //总共回话量

Cur:             //当前的回话

Max: //最大回话 

Limit: //回话限制

Lbtot: total number of times a server was selected //选中一台服务器所用的总时间

---
Bytes

In： //网络的字节数输入总量  

Out： //网络的字节数输出总量

---
Denied

Req: denied requests//拒绝请求量

Resp：denied responses //拒绝回应

Errors

Req：request errors             //错误请求

Conn：connection errors          //错误的连接

Resp: response errors (among which srv_abrt)  ///错误的回应

---
Warnings

Retr: retries (warning)                      //重新尝试

Redis：redispatches (warning)               //再次发送

---
Server列表：

Status:状态，包括up(后端机活动)和down(后端机挂掉)两种状态

LastChk:    持续检查后端服务器的时间

---
Wght: (weight) : 权重

Act: server is active (server), number of active servers (backend) //活动链接数量

Bck: server is backup (server), number of backup servers (backend) //backup：备份的服务器数量

Down：          //后端服务器连接后都是down的数量

Downtime: downtime: total downtime (in seconds)    //总的downtime 时间

Throttle: warm up status                          //设备变热状态