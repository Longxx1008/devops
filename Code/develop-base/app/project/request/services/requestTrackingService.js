/**
 * Created by 兰 on 2017-09-26.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');



/**
 * 获取项目的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */

exports.pageList = function (page, size, conditionMap, cb) {
    var sql = 'SELECT * from pass_project_request_info ';
    var orderBy='';
    var conditions = [];
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);
};

exports.groupData=function (page, size, conditionMap, cb) {
    var sql=' select respond_status,count(respond_status) as statusCount from pass_project_request_info group by respond_status ' ;
    var orderBy='';
    var conditions = [];
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);

}

