var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

/**
 * 获取服务仓库的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page, size, conditionMap, cb) {
    var sql = " select t1.projectName as service_name,t1.projectType,s.* from pass_develop_project_resources t1,pass_project_service_info s where t1.id=s.projectId ";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectCode) {
            sql += " and (t1.projectCode like '%" + conditionMap.projectCode + "%')";
        }
        if(conditionMap.projectName) {
            sql += " and (t1.projectName like '%" + conditionMap.projectName + "%')";
        }
        if(conditionMap.type) {
            sql += " and t1.projectType = ?";
            conditions.push(conditionMap.type);
        }
    }
    var orderBy = " order by s.createTime desc";
    console.log("查询用户信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

/**
 * 获取服务管理的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.smPageList = function(page, size, conditionMap, cb) {
    var sql = " SELECT t1.id as projectId, t1.projectName AS service_name, sc.serviceId, DATE_FORMAT(sc.createTime,'%Y-%d-%m %H:%i:%s') as createTime, s.`status`, s.remark FROM pass_project_service_corres_info sc, pass_develop_project_resources t1, pass_project_service_info s "+
    " WHERE t1.id = s.projectId  AND s.id = sc.serviceId ";
    var conditions = [];
    if(conditionMap) {

        if(conditionMap.type) {
            sql += " and sc.type = ?";
            conditions.push(conditionMap.type);
        }
        if(conditionMap.userId) {
            sql += " and sc.userId = ?";
            conditions.push(conditionMap.userId);
        }
    }
    var orderBy = " order by s.createTime desc";
    console.log("查询用户信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

//获取项目版本数据
exports.versionList = function(conditionMap, cb) {
    var sql = " select t.* from pass_project_service_versions t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.servviceId) {
            sql += " and t.servviceId=?";
            condition.push(conditionMap.servviceId);
        }
    }
    sql += " order by t.id desc";
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取版本信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取版本信息成功', results, null));
        }
    });
}
//根据projectId获取服务数据
exports.getServiceByProId = function(conditionMap, cb) {
    var sql = " select t.* from pass_project_service_info t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.projectId) {
            sql += " and t.projectId=?";
            condition.push(conditionMap.projectId);
        }
    }
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取相关项目服务信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取相关项目服务信息成功', results, null));
        }
    });
}

//根据projectId与版本号获取服务数据
exports.getServiceVerByProIdAndVerNo = function(conditionMap, cb) {
    var sql = " select t.* from pass_project_service_versions t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.serviceId) {
            sql += " and t.serviceId=?";
            condition.push(conditionMap.serviceId);
        }
        if(conditionMap.proVersion) {
            sql += " and t.vNo=?";
            condition.push(conditionMap.proVersion);
        }
    }
    console.log("----getServiceVerByProIdAndVerNo---",sql);
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取服务版本信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取服务版本信息成功', results, null));
        }
    });
}

/**
 * 创建服务项目信息
 * @param data
 * @param cb
 */
exports.add = function(data, cb) {
    var sql = "insert into pass_project_service_info(projectId) values(?)";
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '项目发布到仓库异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '项目发布到仓库成功', results, null));
        }
    });
};

/**
 * 创建服务版本信息
 * @param data
 * @param cb
 */
exports.addSerVer = function(data, cb) {
    var sql = "insert into pass_project_service_versions(vNo,serviceId,deployFileName,deployFileContent,createTime,createUser) values(?,?,?,?,now(),?)";
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '新增服务版本异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '新增服务版本成功', results, null));
        }
    });
};

/**
 * 更新服务项目信息
 * @param data
 * @param cb
 */
exports.update = function(data,corrdata, cb) {
    var sql = "update pass_project_service_info set status = ?,remark = ?,createTime = now(),createUser = ? where id = ?";
    mysqlPool.query(sql, data, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '服务创建异常', null, err));
        } else {
            var corrsql = "insert into pass_project_service_corres_info(serviceId,userId,type,createTime,createUser) values(?,?,?,now(),?)";
            mysqlPool.query(corrsql,corrdata,function(err,results){
                if(err) {
                    cb(utils.returnMsg(false, '1000', '服务创建异常', null, err));
                } else {
                    cb(utils.returnMsg(true, '0000', '服务创建成功', null, null));
                }
            });
        }
    });
};

/**
 * 删除项目信息
 * @param id
 * @param cb
 */
exports.delete = function(id, cb) {
    var sql = "delete from pass_project_service_info where id = ?";
    mysqlPool.query(sql,[id],function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除服务信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '删除服务信息成功', null, null));
        }
    });
}