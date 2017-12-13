
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



exports.getHostInfo = function(cb){


}

