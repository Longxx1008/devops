var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

/**
 * 获取应用详情
 * @param cb
 */
exports.getAppdetails = function(appid,cb) {
    var sql = "select a.id as appId,a.app_name,a.vist_url,a.`status`,s.id,s.images_alias,s.images_name,s.images_version,s.cur_inst_num,s.health_status,s.update_time,s.quality_condition,c.container_name,c.host_ip,c.`status` as constatus from pass_project_micro_service s,pass_project_container_info c,pass_project_app_info a "+
    " where s.id = c.micro_service_id and s.app_id = a.id and a.id = "+appid;
    console.log("获取应用详情 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取应用详情异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取应用详情成功', results, null));
        }
    });
};
/**
 * 获取应用详情
 * @param cb
 */
exports.getMicroServices = function(appid,cb) {
    var sql = "select a.app_name,a.vist_url,a.`status`,s.id,s.images_alias,s.images_name,s.images_version,s.cur_inst_num,s.health_status,s.update_time,s.quality_condition from pass_project_micro_service s,pass_project_app_info a "+
    " where  s.app_id = a.id and a.id = "+appid;
    console.log("获取应用详情 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取应用详情异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取应用详情成功', results, null));
        }
    });
};

