var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

/**
 * 获取推荐应用
 * @param cb
 */
exports.getRecommend = function(cb) {
    var sql = " SELECT * from pass_develop_image_info where recommend=1";
    console.log("获取推荐应用 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '成功', results, null));
        }
    });
};

/**
 * 获取热门应用
 * @param cb
 */
exports.getHot = function(cb) {
    var sql = " SELECT * from pass_develop_image_info where collectionNumber>10";
    console.log("获取热门应用 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '成功', results, null));
        }
    });
};

/**
 * 获取筛选推荐应用
 * @param cb
 */
exports.getAppByCon = function(category,cb) {
    var sql = " SELECT * from pass_develop_image_info where catagory='"+category+"' and recommend=1";
    console.log("获取筛选推荐应用 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '成功', results, null));
        }
    });
};

/**
 * 获取筛选热门应用
 * @param cb
 */
exports.getAppByCon2 = function(category,cb) {
    var sql = " SELECT * from pass_develop_image_info where catagory='"+category+"' and collectionNumber>10";
    console.log("获取筛选热门应用 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '成功', results, null));
        }
    });
};