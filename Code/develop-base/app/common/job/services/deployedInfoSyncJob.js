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
    var options = {
        host:'192.168.31.91',
        port:8080,
        path:'/v2/apps' + mesosId
    };
    http.get(options, function(res) {
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
                var mem = json.app.men;
                var disk = json.app.disk;
                resources  = "实例:" + instances + "个<br>cpu:" + instances * cups + "个<br>内存:" + mem * instances + "M<br>硬盘:" + disk * instances;
                var params = [];
                params.push(status);
                params.push(resources);
                params.push(id);
                pool.query("update pass_develop_project_deploy set healthStatus=?,resources=? where id=?", params, function(err, result){
                    if(err){
                        console.log("更新已部署应用健康信息异常");
                    }else{
                        console.log("更新已部署应用健康信息异常");
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