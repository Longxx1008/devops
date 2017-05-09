/**
 * 获取项目版本任务
 */

var mysql = require('mysql');
var https = require('https');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
var mysqlPool = require('../../../project/utils/mysql_pool');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));

exports.projectVersionJobRun = function(){
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取gitlab相关项目版本任务开始');
    //调用
    pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log(err.message);
        } else {

            var sql = "select * from pass_develop_project_resources where gitlabProjectId is not null";

            console.log("======sql======" + sql);
            connection.query(sql, function (err, results) {
                console.log(err+":"+results);
                if(err){
                    console.log(err.message);
                }else if(results && results.length > 0){
                    for(var i = 0; i<results.length; i++){
                        httpsGetVersion(results[i].gitlabProjectId,results[i].id);
                    }
                }
                connection.release();
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取gitlab相关项目版本任务结束');
            });
        }
    });
};



//https请求gitlab，获取相关项目最新版本信息并插入
function httpsGetVersion(gitProjectId,projectId){
    //获取pipelines的Tags--status为success的版本数据
    var options = {
        hostname: config.platform.gitlabIp,
        path: '/api/v3/projects/'+gitProjectId+'/pipelines?private_token='+config.platform.private_token+'&scope=tags',
        rejectUnauthorized: false  // 忽略安全警告
    };
    var req = https.get(options, function (res) {
        console.log(">>>>>>>>>>>>statusCode：" + res.statusCode + "<<<<<<<<<<<<<<");
        res.setEncoding('utf8');
        var chtmlJson = '';
        res.on('data', function (chunk) {//拼接响应数据
            chtmlJson += chunk;
        });
        res.on('end', function () {
            var info = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
            var obj;
            if (info) {
                console.log("===info===="+info);
                //先删除原有的相关版本信息
                var sql = "delete from pass_develop_project_versions where projectId = "+projectId;
                mysqlPool.query(sql,function(err,results) {
                    if(err) {
                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 删除原有gitlab相关项目版本信息异常');
                    } else {
                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 删除原有gitlab相关项目版本信息成功，准备插入现有版本信息...');
                        for(var i=0;i<info.length;i++){
                            if(info[i].status == 'success'){
                                var results=[];
                                var sql = "insert into pass_develop_project_versions(vNo,projectId,createTime) values(?,?,now())";
                                results.push(info[i].ref);
                                results.push(projectId);
                                mysqlPool.query(sql,results,function(err,results) {
                                    if(err) {
                                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 插入gitlab相关项目版本信息异常');
                                    } else {
                                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 插入gitlab相关项目版本信息成功');
                                    }
                                });
                            }
                        }
                    }
                });

            } else {
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取gitlab相关项目版本信息异常');
            }

        });
    });
    req.on('error', function (err) {
        console.error(err.code);
        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 连接获取gitlab相关项目版本信息异常：'+err.message);
    });
}
