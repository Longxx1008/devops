/**
 * Created by aurora on 2017/5/22.
 */
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var mysql = require('mysql');
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

exports.pageList = function(page, size, conditionMap, cb) {
    var sql = "select b.projectName,a.* from pass_develop_deploy_alert a  left join pass_develop_project_resources b on a.appId=b.projectCode where 1=1";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.appId) {
            sql += " and (a.appId ='"+conditionMap.appId+"' )";
        }
        if(conditionMap.status) {
            sql += " and (a.status = '" + conditionMap.status + "')";
        }
    }
     var orderBy = " order by a.createTime";
    console.log("查询项目信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};
