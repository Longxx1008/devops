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

var memberUrl = "http://192.168.31.127/api/v3/projects/" ;
var roleUrl = "http://192.168.31.127/api/v3//users/";

exports.queryMemberDataRun = function(){
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取成员与相关成员角色数据任务开始');
    getdata();
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取成员与相关成员角色数据任务结束');
};


function getdata() {
    pool.query(sqlResource,[], function (error, result) {
        if (error) {
            console.log(error);
        } else {
            if (result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var projectId = JSON.parse(JSON.stringify(result[i])).gitlabProjectId;
                    getFristData(i, projectId, getMember);
                }
            }
        }
    });
}
function getFristData(i, projectId, cb) {
    var urlTemp = new String(config.platform.gitlabUrl+"/api/v3/projects/" + projectId + "/members?private_token="+config.platform.private_token);
    nodegrass.get(urlTemp, function (data, status, headers) {
        var accessData = JSON.parse(data);
        var idArray = new Array();
        for (var k = 0; k < accessData.length; k++) {
            var name = new String(accessData[k].name);
            var username = new String(accessData[k].username);
            var id = accessData[k].id;
           cb( k, id, projectId);
        }
    });
}
function getMember(k,id,projectId ) {
    var url = new String(config.platform.gitlabUrl+"/api/v3//users/" + id + "?private_token="+config.platform.private_token);
    nodegrass.get(url, function (data, status, headers) {
        var dataTemp = JSON.parse(data);
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
                console.log(err);
            } else {

                if (results.length >0) {
                    //存在就更新是不是管理员
                    var data = JSON.parse(JSON.stringify(results[0]));
                    var userRole = data.userRole;
                    if (userRole != role) {
                        var sqlUpdate = "update pass_develop_project_members set userRole='" + role + "'  where id=" + data.id;
                        conn.query(sqlUpdate, function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("更新一个");
                            }
                        });
                    }
                } else {
                    var sqlInsert = "insert into pass_develop_project_members (projectId,userId,userName,createTime,userRole) values('" + projectId + "' , '" + dataTemp.username +" ', '" + dataTemp.name + "' ,now() , '" + role + "' )";
                    pool.query(sqlInsert,[], function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("插入一个")
                        }
                    });
                }
            }
        });
    })
}
