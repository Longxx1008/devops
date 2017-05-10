var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var https = require('https');

/**
 * 获取项目的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page, size, conditionMap, cb) {
    var sql = " select t1.* from pass_develop_project_resources t1 where 1=1";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectCode) {
            sql += " and (t1.projectCode like '%" + conditionMap.projectCode + "%')";
        }
        if(conditionMap.projectName) {
            sql += " and (t1.projectName like '%" + conditionMap.projectName + "%')";
        }
    }
    var orderBy = " order by t1.createTime desc";
    console.log("查询用户信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

//获取项目版本数据
exports.versionList = function(conditionMap, cb) {
    var sql = " select t.* from pass_develop_project_versions t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.projectId) {
            sql += " and t.projectId=?";
            condition.push(conditionMap.projectId);
        }
    }
    sql += " order by t.id desc";
    //判断gitlab项目ID是否为空
    // if(conditionMap.gitProjectId){
        //获取pipelines的Tags--status为success的版本数据
        // var options = {
        //     hostname: config.platform.gitlabIp,
        //     path: '/api/v3/projects/'+conditionMap.gitProjectId+'/pipelines?private_token='+config.platform.private_token+'&scope=tags',
        //     rejectUnauthorized: false  // 忽略安全警告
        // };
        // var req = https.get(options, function (res) {
        //     console.log(">>>>>>>>>>>>statusCode：" + res.statusCode + "<<<<<<<<<<<<<<");
        //     res.setEncoding('utf8');
        //     var chtmlJson = '';
        //     res.on('data', function (chunk) {//拼接响应数据
        //         chtmlJson += chunk;
        //     });
        //     res.on('end', function () {
        //         var info = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
        //         var obj;
        //         var results = [];
        //         if (info) {
        //             console.log("===info===="+info);
        //             for(var i=0;i<info.length;i++){
        //                 if(info[i].status == 'success'){
        //                     obj = {'vNo':info[i].ref,'projectId':conditionMap.projectId};
        //                     results.push(obj);
        //                 }
        //             }
        //             cb(utils.returnMsg(true, res.statusCode, '获取版本信息成功。', results, null));
        //         } else {
        //             cb(utils.returnMsg(false, res.statusCode, '获取版本信息失败。', results, null));
        //         }
        //
        //     });
        // });
        // req.on('error', function (err) {
        //     console.error(err.code);
        //     cb(utils.returnMsg(false, '404', err.message, null, null));
        // });

    // }else{
        // 查询数据库默认版本数据
        mysqlPool.query(sql,condition,function(err,results) {
            if(err) {
                cb(utils.returnMsg(false, '1000', '获取版本信息异常', null, err));
            } else {
                cb(utils.returnMsg(true, '0000', '获取版本信息成功', results, null));
            }
        });
    // }
   
}

//根据projectCode获取项目数据
exports.getProject = function(conditionMap, cb) {
    var sql = " select t.* from pass_develop_project_resources t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.projectCode) {
            sql += " and t.projectCode=?";
            condition.push(conditionMap.projectCode);
        }
    }
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取项目信息异常', null, err));
        } else {
            if(results&& results.length>0){
                cb(utils.returnMsg(false, '1000', '项目已存在', results, null));
            }else{
                //获取gitlab所有项目
                var options = {
                    hostname: config.platform.gitlabIp,
                    path: '/api/v3/projects?private_token='+config.platform.private_token,
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
                        var results = [];
                        if (info) {
                            for(var i=0;i<info.length;i++){
                                results.push({"projectId":info[i].id,"projectName":info[i].name});
                            }
                            cb(utils.returnMsg(true, res.statusCode, '获取项目信息成功。', results, null));
                        } else {
                            cb(utils.returnMsg(false, res.statusCode, '获取项目信息失败。', results, null));
                        }

                    });
                });
                req.on('error', function (err) {
                    console.error(err.code);
                    cb(utils.returnMsg(false, '404', err.message, null, null));
                });
            }
        }
    });
}

/**
 * 创建项目信息
 * @param data
 * @param cb
 */
exports.add = function(data, cb) {
    var sql = "insert into pass_develop_project_resources(projectCode,projectName,gitAddress,healthCondition,resourceUse,remark,createTime,createUser,projectType,gitlabProjectId) values(?,?,?,?,?,?,now(),?,?,?)";
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '创建项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '创建项目信息成功', null, null));
        }
    });
};

/**
 * 更新项目信息
 * @param data
 * @param cb
 */
exports.update = function(data, cb) {
    var sql = "update pass_develop_project_resources set projectCode = ?,projectName = ?,gitAddress = ?,healthCondition = ?,resourceUse = ?,remark = ?,projectType = ? where id = ?";
    mysqlPool.query(sql, data, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新项目信息成功', null, null));
        }
    });
};

/**
 * 删除项目信息
 * @param id
 * @param cb
 */
exports.delete = function(id, cb) {
    var sql = "delete from pass_develop_project_resources where id = ?";
    mysqlPool.query(sql,[id],function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '删除项目信息成功', null, null));
        }
    });
}

exports.getUserList = function(conditionMap,cb){
    var sql = " select t.* from pass_develop_project_members t where 1=1 ";
    var condition = [];
    var page = 1;
    var size = 50;
    if(conditionMap) {
        if(conditionMap.projectId) {//gitlab项目Id
            sql += " and t.projectId=?";
            condition.push(conditionMap.projectId);
        }
    }
   var orderBy = 'order by t.id desc';
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, condition, cb);
    // mysqlPool.query(sql,condition,function(err,results) {
    //     if(err) {
    //         cb(utils.returnMsg(false, '1000', '获取项目成员信息异常', null, err));
    //     } else {
    //         cb(utils.returnMsg(true, '0000', '获取项目成员信息成功', results, null));
    //     }
    // });
}