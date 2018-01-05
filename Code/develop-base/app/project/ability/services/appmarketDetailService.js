var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

exports.getDetailByImageCode = function(data,cb){
    var sql = "SELECT  t.*,t2.imagetype ,t3.imagePoint from pass_develop_image_info t " +
        "LEFT JOIN pass_develop_image_mapping t2 ON t.imageCode=t2.imageCode and t2.userCode =? " +
        " LEFT JOIN pass_develop_image_pointmapping t3 ON t.imageCode=t3.imageCode and t3.userCode =?  where t.imageCode=?  ";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取信息成功', result, null));
        }
    });
}


exports.getImagetypeByImageCode = function(data,cb){
    var sql = "select * FROM  pass_develop_image_mapping  WHERE imageCode =? and userCode=?  ";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取信息成功', result, null));
        }
    });
}
