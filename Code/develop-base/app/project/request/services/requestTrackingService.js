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

exports.pageList = function (page, size,statusType,appName,conditionMap, cb) {
    var statusType = statusType;
    var appName=appName;
    var sql = "SELECT R.* from pass_project_request_info R left join pass_project_app_info A on R.app_id=A.id where 1=1";
    if(statusType!=null&&statusType!=''&&statusType!='全部响应状态'){
        sql+=" and respond_status like '"+statusType+"%'";
    }
    if(appName!=null&&appName!=''&&appName!="全部应用"){
        sql+=" and R.app_name = '"+appName+"'";
    }

    var orderBy='';
    var conditions = [];
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);
};

exports.groupData=function (page, size,appname, conditionMap, cb) {

    //console.log("@@!!##"+appname);
    var sql=" select respond_status,count(respond_status) as statusCount from pass_project_request_info  ";
    if(appname!=null&&appname!=''&&appname!="全部应用"){
        sql+="where app_name='"+appname+"' group by respond_status";
    }else {
        sql+=" group by respond_status";
    }
    var orderBy='';
    var conditions = [];
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);

}

