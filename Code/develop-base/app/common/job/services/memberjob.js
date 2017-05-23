/**
 * Created by aurora on 2017/5/17.
 */


var mysql = require('mysql');
var fs = require("fs");
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
var nodegrass = require("../../../project/utils/nodegrass");
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
var sqlResource = "select t.gitlabProjectId from pass_develop_project_resources t";


exports.queryMemberDataRun = function(){
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取成员与相关成员角色数据任务开始');
    getdata();

};


function getdata() {
    pool.query(sqlResource,[], function (error, results) {
        if (error) {
            console.log(error);
        } else {

            if (results.length > 0) {
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取项目gitlabId数据成功...开始获取相关项目的成员数据...');
                var i=0;
                getFristData(results,i);
            }
        }
    });
}
function getFristData(results,i) {
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 根据gitlab项目Id获取项目成员数据开始...');
    if(results && results.length > i){
        var projectId = JSON.parse(JSON.stringify(results[i])).gitlabProjectId;
        var urlTemp = new String(config.platform.gitlabUrl+"/api/v3/projects/" + projectId + "/members?private_token="+config.platform.private_token);
        nodegrass.get(urlTemp, function (data, status, headers) {
            var accessData = JSON.parse(data);
            if(accessData){
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 根据gitlab项目Id获取项目成员数据成功...开始更新或新增相关项目成员...');
                var k=0;
                getMember(accessData,k,projectId);
            }
            getFristData(results,++i);
        });
    }


}
function getMember(accessData,k,projectId) {
    if(accessData && accessData.length > k){
        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 根据gitlab项目Id获取项目成员数据开始...');
        var url = new String(config.platform.gitlabUrl+"/api/v3//users/" + accessData[k].id + "?private_token="+config.platform.private_token);
        nodegrass.get(url, function (data, status, headers) {
            var dataTemp = JSON.parse(data);
            if(dataTemp){
                var admin = dataTemp.is_admin;//boolean
                var role = '';
                console.info(admin);
                if (admin) {
                    role = "项目负责人";
                } else {
                    role = "开发人员";
                }
                var sqlSelectMember = "SELECT * FROM pass_develop_project_members where userId= '" + dataTemp.username + "'  and projectId= " + projectId;
                pool.query(sqlSelectMember,[], function (err, results) {
                    if (err) {
                        getMember(accessData,++k,projectId);
                        console.log(err);
                    } else {
                        if (results.length >0) {
                            //存在就更新是不是管理员
                            var data = JSON.parse(JSON.stringify(results[0]));
                            var userRole = data.userRole;
                            if (userRole != role || data.userName != dataTemp.name) {
                                var sqlUpdate = "update pass_develop_project_members set userRole='" + role + "',userName='"+dataTemp.name+"'  where id=" + data.id;
                                conn.query(sqlUpdate, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 更新相关gitlab项目Id【'+projectId+'】成员信息成功...');
                                        console.log("更新一个");
                                    }
                                    getMember(accessData,++k,projectId);
                                });
                            }
                        } else {
                            var sqlInsert = "insert into pass_develop_project_members (projectId,userId,userName,createTime,userRole) values('" + projectId + "' , '" + dataTemp.username +" ', '" + dataTemp.name + "' ,now() , '" + role + "' )";
                            pool.query(sqlInsert,[], function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 插入相关gitlab项目Id【'+projectId+'】成员信息成功...');
                                }
                                getMember(accessData,++k,projectId);
                            });
                        }
                        console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取成员与相关成员角色数据任务结束');
                    }
                });
            }
        });
    }
}
