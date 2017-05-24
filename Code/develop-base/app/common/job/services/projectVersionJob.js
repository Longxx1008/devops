/**
 * 获取项目版本任务
 */

var mysql = require('mysql');
var https = require('https');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
var mysqlPool = require('../../../project/utils/mysql_pool');
var nodeGrass = require('../../../project/utils/nodegrass');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));

exports.projectVersionJobRun = function(){
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取gitlab相关项目版本任务开始');
    //调用
    var sql = "select * from pass_develop_project_resources where gitlabProjectId is not null";
    console.log("======sql======" + sql);
    pool.query(sql,[], function (err, results) {
        console.log(err+":"+results);
        if(err){
            console.log(err.message);
        }else if(results && results.length > 0){
            for(var i = 0; i<results.length; i++){
                httpsGetVersion(results[i].gitlabProjectId,results[i].id,results[i].projectCode);
            }
        }
    });
};



//https请求gitlab，获取相关项目最新版本信息并插入
function httpsGetVersion(gitProjectId,projectId,projectCode){
    //获取pipelines的Tags--status为success的版本数据
    var url = config.platform.gitlabUrl + '/api/v3/projects/' + gitProjectId + '/pipelines?private_token=' + config.platform.private_token + '&scope=tags';
    nodeGrass.get(url,function(data,status,headers){
        var info = JSON.parse(data);//将拼接好的响应数据转换为json对象
        if (info) {
            var i = 0;
            forVersionInfo(info,i,projectId,projectCode);
        } else {
            console.log( '创建项目时 项目版本信息不存在...');
        }
    },'utf8').on('error', function(e) {
        console.log( '创建项目时 获取项目版本信息错误：'+e.message);
    });
}
function forVersionInfo(versions,i,projectId,projectCode){
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
                        getDeployJson(versions,i,projectId,projectCode);
                    }else{
                        forVersionInfo(versions, ++i, projectId, projectCode);
                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 项目版本信息已存在...');
                    }
                }
            });
        }
    }
}

function getDeployJson(versions,i,projectId,projectCode){
    var results=[];
    var sql = "insert into pass_develop_project_versions(versionNo,projectId,deployJson,createTime) values(?,?,?,now())";
    results.push(versions.ref);
    results.push(projectId);
    //读取部署信息
    //http://192.168.9.48/cmcc/develop-base/raw/dev/architecture?pivate_token=BgNLAke5cybnRcqc-
    var url = config.platform.gitlabUrl + '/cmcc/' + projectCode + '/raw/dev/architecture?private_token=' + config.platform.private_token;
    nodeGrass.get(url,function(data,status,headers){
        console.log("--------------");
        results.push(data);
        mysqlPool.query(sql,results,function(err,results) {
            if(err) {
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 插入gitlab相关项目版本信息异常...');
            } else {
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 插入gitlab相关项目版本信息成功...');
            }
            forVersionInfo(versions, ++i, projectId, projectCode);
        });
    },'utf8').on('error', function(e) {
        console.log( '获取项目部署信息失败：'+e.message);
    });
}