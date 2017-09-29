var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

exports.getDetailByImageCode = function(id,cb){
    var sql = "select * from pass_develop_image_info where imageCode = ? ";
    mysqlPool.query(sql,[id],function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取信息成功', result, null));
        }
    });
}