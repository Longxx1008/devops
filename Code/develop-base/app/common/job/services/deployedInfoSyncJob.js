/**
 * 已部署项目健康度、占用资源信息等信息获取
 */
var mysql = require('mysql');
var http = require('http');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
var mysqlPool = require('../../../project/utils/mysql_pool');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
exports.doJob = function(){
    console.log('获取已部署项目健康度、占用资源等信息开始...' + DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss'));
    //调用
    pool.getConnection(function(err, conn) {
        if (err != null) {
            console.log(err.message);
        } else {
            var sql = "select * from pass_develop_project_deploy where 1 = 1";
            conn.query(sql, function (err, result) {
                if(err){
                    console.log(err);
                }else {
                    var id,mesosId;
                    for(var i = 0; result != null && i < result.length; i++){
                        id = result[i].id;
                        mesosId = result[i].mesosId;
                        if(mesosId != null && mesosId != ""){
                            httpGetInfo(id,mesosId);
                        }
                    }
                }
            });
        }
    });
};

function httpGetInfo(id, mesosId){
    var url = config.platform.marathonApi  + "/" + mesosId;
    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        res.setEncoding('utf8');
        var chtmlJson = '';
        res.on('data', function (chunk) {//拼接响应数据
            chtmlJson += chunk;
        });
        res.on('end', function () {
            console.log(mesosId + "返回数据为:" + chtmlJson);
            var json = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
            if (json) {
                //健康的实例大于1，就认为应用健康
                var status = json.app.tasksHealthy > 0 ? 1 : 0;
                var resources = "";
                var instances = json.app.instances;
                var cpus = json.app.cpus;
                var mem = json.app.mem;
                var disk = json.app.disk;
                resources  = "实例:" + instances + "个<br>CPU:" + instances * cpus + "个<br>内存:" + mem * instances + "M";
                //默认只读取第一个实例
                var taskId = json.app.tasks[0].id;
                var host = json.app.tasks[0].host;
                httpGetContainerInfo(id, mesosId, status, resources, taskId, host);
            } else {
                console.log(mesosId + "接口数据异常");
            }
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function httpGetContainerInfo(id, mesosId, status, resources,taskId, hostName){
    var params = [];
    params.push(hostName);
    pool.query("select * from pass_operation_host_info where name=?",params,function(err,result){
        if(err || result == null || result.length == 0){
            console.log("根据host查询IP异常" );
        }else{
            var hostIp = result[0].ip;
            var path = "/containers/json?all=1";
            var filters = "{\"label\":[\"MESOS_TASK_ID=" + taskId + "\"]}";
            path = path + "&filters=" + filters;
            var options = {
                host:hostIp,
                port:2375,
                path:path
            };
            http.get(options, function(res) {
                console.log("Got response: " + res.statusCode);
                res.setEncoding('utf8');
                var chtmlJson = '';
                res.on('data', function (chunk) {//拼接响应数据
                    chtmlJson += chunk;
                });
                res.on('end', function () {
                    console.log("根据label查询容器返回数据为:" + chtmlJson);
                    var json = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
                    if (json) {
                        var containerId = json[0].Id;
                        var containerName = json[0].Names[0];
                        var params = [];
                        params.push(status);
                        params.push(resources);
                        params.push(hostName);
                        params.push(hostIp);
                        params.push(containerId);
                        params.push(containerName);
                        params.push(id);
                        pool.query("update pass_develop_project_deploy set healthStatus=?,resources=?,hostName=?,hostIp=?,containerId=?,containerName=? where id=?", params, function(err, result){
                            if(err){
                                console.log("更新已部署应用健康度等信息异常");
                            }else{
                                console.log("更新已部署应用健康度等信息成功");
                            }
                        });
                    } else {
                        console.log(mesosId + "接口数据异常");
                    }
                });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });
        }
    });
}