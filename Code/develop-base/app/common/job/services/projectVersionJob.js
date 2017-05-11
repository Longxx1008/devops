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
                // console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取gitlab相关项目版本任务结束');
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
                var i = 0;
                forVersionInfo(info,i,projectId);

            } else {
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取gitlab相关项目版本信息异常');
            }
            console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取gitlab相关项目版本任务结束');
        });
    });
    req.on('error', function (err) {
        console.error(err.code);
        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 连接获取gitlab相关项目版本信息异常：'+err.message);
    });
}
function forVersionInfo(versions,i,projectId){
    if(versions && versions.length > i){
        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 检查版本状态：',versions[i].status);
        if(versions[i].status == 'success'){
            //根据projectId和版本号查询项目对应版本是否存在
            var sersql = "select id from pass_develop_project_versions where versionNo=? and projectId=?";
            mysqlPool.query(sersql,[versions[i].ref,projectId],function(err,serresult) {
                if(err) {
                    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 查询GitLab相关项目版本信息异常');
                } else {
                    if(serresult && serresult.length == 0){//如果项目版本不存在，就插入该版本信息
                        var results=[];
                        var sql = "insert into pass_develop_project_versions(versionNo,projectId,createTime) values(?,?,now())";
                        results.push(versions[i].ref);
                        results.push(projectId);
                        mysqlPool.query(sql,results,function(err,results) {
                            if(err) {
                                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 插入gitlab相关项目版本信息异常...');
                            } else {
                                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 插入gitlab相关项目版本信息成功...');
                            }
                            forVersionInfo(versions,++i,projectId);
                        });
                    }else{
                        forVersionInfo(versions,++i,projectId);
                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 项目版本信息已存在...');
                    }
                }
            });
        }
    }
}