
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
    var sql = " select t1.* from pass_project_service_monitor t1 where 1=1";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.deployId) {
            sql += " and t1.deployId = ?";
            conditions.push(conditionMap.deployId);
        }
    }
    var orderBy = " order by t1.createTime desc";
    console.log("查询应用服务信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};



