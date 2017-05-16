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
    console.log("查询项目信息sql ====",sql);
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
    // 查询数据库默认版本数据
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取版本信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取版本信息成功', results, null));
        }
    });
}

exports.deployedPageList = function(page, size, conditionMap, cb) {
    var sql = " select t1.*,t2.projectCode,t2.projectName from pass_develop_project_deploy t1,pass_develop_project_resources t2 where t1.projectId = t2.id";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectName) {
            sql += " and (t2.projectName like '%" + conditionMap.projectName + "%')";
        }
    }
    var orderBy = " order by t1.createTime desc";
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

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
                    res.on('end', function (){
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
    var sql = "insert into pass_develop_project_resources(projectCode,projectName,gitAddress,healthCondition,resourceUse,remark,createTime,createUser,projectType,gitlabProjectId,type) values(?,?,?,?,?,?,now(),?,?,?,1)";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '创建项目信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '创建项目信息成功', result, null));
        }
    });
};

//从gitlab获取版本信息
exports.getVerByGitLab = function(gitProjectId,projectId){
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
        res.on('end', function (){
            console.log("==chtmlJson====",chtmlJson);
            var info = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
            var obj;
            var results = [];
            if (info) {
                var i = 0;
                forVersionInfo(info,i,projectId);
            } else {
                console.log( '创建项目时 项目版本信息不存在...');
            }
        });
    });
    req.on('error', function (err) {
        console.error(err.code);
        console.log( '创建项目时 获取项目版本信息错误：'+err.message);
    });
}

function forVersionInfo(versions,i,projectId){
    if(versions && versions.length > i){
        console.log('创建项目时 检查版本状态：',versions[i].status);
        if(versions[i].status == 'success'){
            //根据projectId和版本号查询项目对应版本是否存在
            var sersql = "select id from pass_develop_project_versions where versionNo=? and projectId=?";
            mysqlPool.query(sersql,[versions[i].ref,projectId],function(err,serresult) {
                if(err) {
                    console.log('创建项目时 查询相关项目版本信息异常');
                } else {
                    if(serresult && serresult.length == 0){//如果项目版本不存在，就插入该版本信息
                        var results=[];
                        var sql = "insert into pass_develop_project_versions(versionNo,projectId,createTime) values(?,?,now())";
                        results.push(versions[i].ref);
                        results.push(projectId);
                        mysqlPool.query(sql,results,function(err,result) {
                            if(err) {
                                console.log( '创建项目时 插入gitlab相关项目版本信息异常...');
                            } else {
                                console.log('创建项目时 插入gitlab相关项目版本信息成功...');
                            }
                            forVersionInfo(versions,++i,projectId);
                        });
                    }else{
                        forVersionInfo(versions,++i,projectId);
                        console.log( '创建项目时 项目版本信息已存在...');
                    }
                }
            });
        }
    }
}

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
 * 更新项目类型信息
 * @param data
 * @param cb
 */
exports.updateType = function(data,corrdata, cb) {
    var sql = "update pass_develop_project_resources set type = ? where id = ?";
    mysqlPool.query(sql, data, function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新项目类型信息异常', null, err));
        } else {
            if(data[0] == 2){//为服务时插入数据到服务对应表
                var corrsql = "insert into pass_project_service_corres_info(projectId,userId,type,createTime,createUser) values(?,?,?,now(),?)";
                mysqlPool.query(corrsql,corrdata,function(err,results){
                    if(err) {
                        cb(utils.returnMsg(false, '1000', '服务创建异常', null, err));
                    } else {
                        cb(utils.returnMsg(true, '0000', '服务创建成功', null, null));
                    }
                });
            }

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
}
/**
 * 获取已已部署的项目列表
 * @param conditionMap
 * @param cb
 */
exports.getDeployedList = function(conditionMap, cb){
    var sql = " select t1.*,t2.projectCode,t2.projectName from pass_develop_project_deploy t1,pass_develop_project_resources t2 where t1.projectId=t2.id ";
    sql += " and t1.projectId=? and t1.clusterId=?";
    mysqlPool.query(sql, conditionMap, function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '查询已部署项目时出现错误', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '查询已部署项目成功', result, null));
        }
    });
}

/**
 * 获取指定版本的信息
 * @param conditionMap
 * @param cb
 */
exports.getVersionInfo = function(conditionMap, cb){
    var sql = "select t1.*,t2.projectCode,t2.projectName from pass_develop_project_versions t1,pass_develop_project_resources t2 where t1.projectId=t2.id ";
    sql += " and t1.projectId=? and t1.versionNo=?";
    mysqlPool.query(sql, conditionMap, function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '查询项目版本信息时出错', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '查询项目版本信息成功', result, null));
        }
    });
}

/**
 * 保存项目部署信息
 * @param conditionMap
 * @param cb
 */
exports.saveDeployInfo = function(conditionMap, cb){
    var sql = "insert into pass_develop_project_deploy(type,projectId,version,clusterId,webSite,remark,createTime,createBy,updateTime) values('1',?,?,?,?,?,now(),?,now())";
    mysqlPool.query(sql, conditionMap, function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '保存项目部署信息出错', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '保存项目部署信息成功', result, null));
        }
    });
}