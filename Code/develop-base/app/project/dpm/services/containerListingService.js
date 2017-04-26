var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

/**
 * 获取容器列表的分页数据
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