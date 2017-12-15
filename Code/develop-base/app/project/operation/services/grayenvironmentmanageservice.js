
/**
 * Created by acer on 2017/5/11.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var Promise=require("bluebird");
var ng= require("nodegrass");
var mesos_add="192.168.9.65";
var mesos_port="5050";
var content_type="Content-Type: application/json";
var protocol="http";
var request = require('request');


/**
 * 分页查询
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getPlatfrom = function(){
    return  new Promise(function(resolve,reject){
        var sql = "select * from pass_develop_project_resources  ";
        mysqlPool.query(sql,function(e,r){
            if(e){
                console.log(e);
                resolve({"data":null,"error":e,"message":"查询数据失败！","success":false,"code":"1001"})
            }else{
                resolve({"data":r,"error":null,"message":"查询数据成功！","success":true,"code":"0000"})
            }

        })

    });


};

exports.getDeploy=function(gitlabProjectId,cb){
    var p = new Promise(function(resolve, reject) {
        var sql = 'select * from pass_develop_project_resources_copy2 r,pass_develop_project_gray_deploy g where g.gitlabProjectId=r.gitlabProjectId and r.gitlabProjectId="'+gitlabProjectId+'"';
        console.log(sql);
        mysqlPool.query(sql, function (err, results) {
            if (err) {
                cb(utils.returnMsg(false, '1000', '查询灰度部署信息出错', null, err));
            } else {
                cb(utils.returnMsg(true, '0000', '查询灰度部署信息成功', results, null));
            }
        });
    })
}

exports.start=function(instance,imageName,projectCode,cb){
    var p = new Promise(function(resolve, reject) {
        var scaleJson = {
            "id": "/"+projectCode+"/"+projectCode+"-gatedlaunch",
            "cpus": 1,
            "mem": 1024,
            "disk": 0,
            "instances": parseInt(instance),
            "acceptedResourceRoles": [
                "*"
            ],
            "container": {
                "type": "DOCKER",
                "volumes": [],
                "docker": {
                    "image": imageName,
                    "network": "BRIDGE",
                    "portMappings": [
                        {
                            "containerPort": 0,
                            "hostPort": 0,
                            "servicePort": 10004,
                            "protocol": "tcp",
                            "labels": {}
                        }
                    ],
                    "privileged": false,
                    "parameters": [],
                    "forcePullImage": false
                }
            },
            "healthChecks": [
                {
                    "gracePeriodSeconds": 300,
                    "intervalSeconds": 5,
                    "timeoutSeconds": 20,
                    "maxConsecutiveFailures": 3,
                    "portIndex": 0,
                    "path": "/",
                    "protocol": "HTTP",
                    "ignoreHttp1xx": false
                }
            ],
            "labels": {
                "HAPROXY_GROUP": "external"
            },
            "portDefinitions": [
                {
                    "port": 10007,
                    "protocol": "tcp",
                    "name": "default",
                    "labels": {}
                }
            ]
        };
        var options = {
            headers : {"Connection": "close"},
            url : config.platform.marathonApi,
            method : 'post',
            json : true,
            body : scaleJson
        };
        function callback(error, response, data) {
            console.log(response);
            if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                console.log('创建应用成功----info------',data);
                cb(utils.returnMsg(true, '0000', '启动灰度应用成功,进行健康检查', response, null));
            }else{
                console.log("创建应用失败，" + error);
                cb(utils.returnMsg(false, '1000', '启动灰度应用失败', null, error));
            }
        }
        request(options, callback);
    })
}
exports.update=function(instance,imageName,projectCode,cb){
    var p = new Promise(function(resolve, reject) {
        var scaleJson = [{
            "id": "/"+projectCode+"/"+projectCode+"-gatedlaunch",
            "instances": parseInt(instance),
            "acceptedResourceRoles": [
                "*"
            ],
            "container": {
                "type": "DOCKER",
                "volumes": [],
                "docker": {
                    "image": imageName,
                    "network": "BRIDGE",
                    "portMappings": [
                        {
                            "containerPort": 0,
                            "hostPort": 0,
                            "servicePort": 10004,
                            "protocol": "tcp",
                            "labels": {}
                        }
                    ],
                    "privileged": false,
                    "parameters": [],
                    "forcePullImage": false
                }
            },
            "healthChecks": [
                {
                    "gracePeriodSeconds": 300,
                    "intervalSeconds": 5,
                    "timeoutSeconds": 20,
                    "maxConsecutiveFailures": 3,
                    "portIndex": 0,
                    "path": "/",
                    "protocol": "HTTP",
                    "ignoreHttp1xx": false
                }
            ],
            "labels": {
                "HAPROXY_GROUP": "external"
            },
            "portDefinitions": [
                {
                    "port": 10004,
                    "protocol": "tcp",
                    "name": "default",
                    "labels": {}
                }
            ]
        }];
        var options = {
            headers : {"Connection": "close"},
            url : config.platform.marathonApi,
            method : 'put',
            json : true,
            body : scaleJson
        };
        function callback(error, response, data) {
            console.log(response);
            if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                console.log('更新应用成功----info------',data);
                cb(utils.returnMsg(true, '0000', '启动灰度应用成功,进行健康检查', response, null));
            }else{
                console.log("更新应用失败，" + error);
                cb(utils.returnMsg(false, '1000', '启动灰度应用失败', null, error));
            }
        }
        request(options, callback);
    })
}

exports.getProjectSituation=function(){
    return  new Promise(function(resolve,reject){
        var sql = "select * from pass_develop_project_resources  ";
        mysqlPool.query(sql,function(err,res){
            if(err){
                console.log(err);
                resolve({"data":null,"error":e,"message":"查询数据失败！","success":false})
            }else{
                resolve({"data":res,"error":null,"message":"查询数据成功！","success":true})
            }

        })

    });
}


exports.getFormalDeploy=function(page, rows, conditionMap,cb) {
    return new Promise(function (resolve, reject) {
        var sql = "select a.id,a.projectId,a.version,a.healthStatus,a.gitlabProjectId,b.projectName,b.projectCode,c.hostIp,c.state from pass_develop_project_gray_deploy a,pass_develop_project_resources_copy2 b,pass_develop_project_deploy_instance c where a.gitlabProjectId=b.gitlabProjectId and a.projectId=c.projectId";
        var orderBy =  " order by id desc";
        var conditions = {};
        console.log("________________________________________________________________")
        utils.pagingQuery4Eui_mysql(sql, orderBy, page, rows, conditions, cb)
    })
}


//两个操作，分别更新或插入灰度表和灰度实例表
// 更新或插入灰度表，判断项目是否存在灰度部署（更新时与resource表作关联）
//更新或插入灰度实例表，与灰度表做关联，关联字段为projectId
exports.refreshGrayDeploy=function () {
    var url = config.platform.marathonApi;//marathon部署项目信息
    let projectId=new Array();//获取所有项目的灰度部署
    let version=new Array();//各灰度版本
    let instance=new Array();//各灰度实例数
    let cpu=new Array();//各灰度所用cpu
    let mem=new Array();//各灰度所用内存
    let healthStatus=new Array();//各灰度健康情况
    let deployTime;//部署时间
    let address;//访问地址
    let ins;//原本实例数
    let instanceId=new Array();//实例id
    ng.get(url, function (data) {
        data = eval('(' + data + ')');
        //循坏加入灰度项目
        for(let i in data.apps){
            if((data.apps[i].id).indexOf("gatedlaunch")>=0){
                projectId.push(data.apps[i].id);
                version.push(data.apps[i].container.docker.image);
                instance.push(data.apps[i].instances);
                cpu.push(data.apps[i].cpus);
                mem.push(data.apps[i].mem);
                healthStatus.push(data.apps[i].tasksHealthy);
                deployTime=new Date(data.apps[i].version).toLocaleString();
                address=config.platform.marathonLb+':'+data.apps[i].ports[0];
            }
        }
        //循坏判断每个项目是否存在于数据表，有就更新，没有就插入
        for (let i in projectId) {
            (function (i) {//用自执行函数传参，这样自执行函数内部形成了局部作用域，不受外部变量变化的影响，解决了js中for循环是同步任务的问题
                var ifsql="select * from pass_develop_project_gray_deploy where projectId = '" + projectId[i]+"'";
                mysqlPool.query(ifsql, [], function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if(result.length!=0){
                            ins=result[i].instance;//用实例数来循坏
                            var sql = "update pass_develop_project_gray_deploy set version = '" + version[i] + "',gray_version='" + version[i].substring(version[i].lastIndexOf(":")+1) + "',healthStatus='"+healthStatus[i]+"',runtime=TIMESTAMPDIFF(minute,'"+deployTime+"',DATE_FORMAT(date_add(now(), interval 8 hour),'%Y-%m-%d %H:%i:%s')),address='"+address+"',instance='"+instance[i]+"' where projectId = '" + projectId[i]+"'";
                            console.log(sql);
                            mysqlPool.query(sql, [], function (err, result) {
                                if (err) {
                                    console.log("更新灰度部署项目失败");
                                } else {
                                    console.log("更新灰度部署项目成功");
                                }
                            });
                            var url_detail=url+projectId[i];//获取marathon部署项目详细信息
                            ng.get(url_detail,function (data) {
                                data = eval('(' + data + ')');
                                if(parseInt(ins)==parseInt(data.app.tasks.length)){//实例数相同就更新字段
                                    for(let j in data.app.tasks) {
                                        var sql = "update pass_develop_project_gray_deploy_instance set state='"+data.app.tasks[j].state+"',hostIp='"+data.app.tasks[j].host+"' where instanceId='" + data.app.tasks[j].id + "'";
                                        mysqlPool.query(sql, [], function (err, result) {
                                            if (err) {
                                                console.log("更新灰度实例表失败");
                                            } else {
                                                console.log("更新灰度实例表成功");
                                            }
                                        });
                                    }
                                }else if(ins<data.app.tasks.length){//实例数大于之前就插入实例表
                                    for(let j=ins;j<data.app.tasks.length;j++) {
                                        var sql = "insert into pass_develop_project_gray_deploy_instance(projectId,state,hostIp,instanceId) values('" + projectId[i] + "','"+data.app.tasks[j].state+"','"+data.app.tasks[j].host+"','"+data.app.tasks[j].id+"')";
                                        mysqlPool.query(sql, [], function (err, result) {
                                            if (err) {
                                                console.log("插入灰度实例表失败");
                                            } else {
                                                console.log("插入灰度实例表成功");
                                            }
                                        });
                                    }
                                }else if(ins>data.app.tasks.length){//实例数小于之前就删除实例表记录
                                    let record=parseInt(ins)-parseInt(data.app.tasks.length);
                                    for(let j=0;j<record;j++) {
                                        var sql = "delete from pass_develop_project_gray_deploy_instance where 1 and projectId='"+projectId[i]+"' order by id desc limit 1";
                                        mysqlPool.query(sql, [], function (err, result) {
                                            if (err) {
                                                console.log("删除灰度实例表记录失败");
                                            } else {
                                                console.log("删除灰度实例表记录成功");
                                            }
                                        });
                                    }
                                }

                            })
                        }else{
                            //插入marathon获取到灰度表
                            var sql="insert into pass_develop_project_gray_deploy(projectId,version,gray_version,healthStatus,cpu,instance,mem) values('"+projectId[i]+"','"+ version[i]+"','"+version[i].substring(version[i].lastIndexOf(":")+1)+"','"+healthStatus[i]+"','"+cpu[i]+"','"+instance[i]+"','"+mem[i]+"')";
                            console.log(sql);
                            mysqlPool.query(sql, [], function (err, result) {
                                if (err) {
                                    console.log("插入灰度部署项目失败");
                                } else {
                                    console.log("插入灰度部署项目成功");
                                }
                            });
                            //从resource表获取gitlabProjectId更新该次插入，判断依据是resource表的projectName和marathon获取的projectId是否相似
                            var sql="update pass_develop_project_gray_deploy set gitlabProjectId=(select gitlabProjectId from pass_develop_project_resources_copy2 where INSTR('"+projectId[i]+"',projectCode)>0) where projectId = '" + projectId[i]+"'";
                            console.log(sql);
                            mysqlPool.query(sql, [], function (err, result) {
                                if (err) {
                                    console.log("插入灰度部署项目gitlabProjectId失败");
                                } else {
                                    console.log("插入灰度部署项目gitlabProjectId成功");
                                }
                            });
                            var url_detail=url+projectId[i];//获取marathon部署项目详细信息
                            console.log(url_detail);
                            ng.get(url_detail,function (data) {
                                console.log(data);
                                data = eval('(' + data + ')');

                                for(let j in data.app.tasks) {
                                    var sql = "insert into pass_develop_project_gray_deploy_instance(projectId,state,hostIp,instanceId) values('" + projectId[i] + "','"+data.app.tasks[j].state+"','"+data.app.tasks[j].host+"','"+data.app.tasks[j].id+"')";
                                    mysqlPool.query(sql, [], function (err, result) {
                                        if (err) {
                                            console.log("插入灰度实例表失败");
                                        } else {
                                            console.log("插入灰度实例表成功");
                                        }
                                    });
                                }
                            })
                        }
                    }
                });
            })(i);
        }
    });
}


exports.pageList = function(page,size,conditionMap,cb){
    var sql = "select i.id,i.projectId,i.instanceId,r.projectName,i.hostIp,i.state,g.version from pass_develop_project_gray_deploy g,pass_develop_project_gray_deploy_instance i,pass_develop_project_resources_copy2 r where g.projectId=i.projectId and r.gitlabProjectId = g.gitlabProjectId";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.projectId) {
            sql += " and i.projectId=?";
            condition.push(conditionMap.projectId);
        }
    }
    var orderSql=" order by i.projectId ";
    console.log("查询灰度信息 ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,condition,cb);
};

