var utils = require('../../common/core/utils/app_utils');
var mysqlPool = require('../utils/mysql_pool');

exports.pageList = function(page, size, conditionMap, cb) {
    var sql = " select t1.* from t_bind_user t1 where 1=1";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.name) {
            sql += " and (t1.name like '%" + conditionMap.name + "%' or t1.mobile like '%" + conditionMap.name + "%')";
        }
        if(conditionMap.deptId) {
            sql += " and t1.deptId=?";
            conditions.push(conditionMap.deptId);
        }
        if(conditionMap.status) {
            sql += " and t1.status=?";
            conditions.push(conditionMap.status);
        }
    }
    var orderBy = " order by t1.createTime desc";
    console.log("查询用户信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
}

exports.delete = function(id, cb) {
    var sql = "delete from t_bind_user where id = ?";
    mysqlPool.query(sql,[id],function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除用户信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '删除用户信息成功', null, null));
        }
    });
}