
/**
 * Created by acer on 2017/5/11.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var https = require('https');

/**
 * 分页查询
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page,size,conditionMap,cb){
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
    // 查询数据库版本数据
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取版本信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取版本信息成功', results, null));
        }
    });

};

