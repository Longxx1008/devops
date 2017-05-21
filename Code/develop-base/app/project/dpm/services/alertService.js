var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var nodeGrass = require('../../utils/nodegrass');
var config = require('../../../../config');
var http = require('http');

/**
 * 获取项目的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.save = function(params, cb) {
    var sql = "insert into pass_develop_deploy_alert(appId,type,title,ruleId,ruleName,ruleUrl,state,imageUrl,message,createTime,status) values(?,?,?,?,?,?,?,?,?,now(),?)";
    mysqlPool.query(sql, params, function(err,result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '保存告警信息出错', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '保存告警信息成功', result, null));
        }
    });
};
