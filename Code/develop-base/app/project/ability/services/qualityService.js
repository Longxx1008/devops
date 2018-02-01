var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

/**
 * 获取质量状况
 * @param cb
 */
exports.getQuality = function(microserid,cb) {
    var sql = " select q.*,s.images_name,s.images_version,a.app_name,a.project_manager,s.first_deploy_time from pass_project_quality_info q,pass_project_micro_service s,pass_project_app_info a " +
        " where q.micro_service_id = s.id and s.app_id=a.id and q.micro_service_id="+microserid;
    console.log("获取质量状况 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取质量状况异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取质量状况成功', results, null));
        }
    });
};

