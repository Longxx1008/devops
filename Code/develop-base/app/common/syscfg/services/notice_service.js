/**
 * Created by zhaojing on 2016/6/28.
 */
var utils = require('../../../common/core/utils/app_utils');
var model = require('../../core/models/notice_model');

/**
 * 分页查询
 * @param page
 * @param size
 * @param name
 * @param cb
 */
exports.getNotices = function(page, size, conditionMap, cb) {
    var populate = {path:'notice_issuer notice_auditor',select:{_id: 1,user_name: 1}};
    utils.pagingQuery4Eui(model.$CommonCoreNotice, page, size, conditionMap, cb, populate);
};

/**
 * 添加数据
 * @param entity
 * @param cb
 */
exports.saveNotices = function(entity, cb) {
    model.$CommonCoreNotice(entity).save(function(error) {
        if (error) {
            cb(utils.returnMsg(false, '1000', '添加信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '添加信息成功。', null, null));
        }
    });
};

/**
 * 查询详情
 * @param id
 * @param fields
 * @param cb
 */
exports.getNoticeInfo = function(id, fields, cb) {
    var query = model.$CommonCoreNotice.find({});
    query.where('_id', id);
    query.exec(function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1001', '查询详情出现异常。', null, err));
        }else{
            cb(utils.returnMsg(true, '0000', '查询详情成功。', rs, null));
        }
    });
};

/**
 * 修改数据
 * @param conditions
 * @param update
 * @param cb
 */
exports.updateNotice = function(conditions, update, cb) {
    var options = {};
    model.$CommonCoreNotice.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1002', '修改信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改信息成功。', null, null));
        }
    });
};

/**
 *
 * @param conditions
 * @param update
 * @param cb
 */
exports.doUpNotice = function(id, cb) {
    var options = {};
    model.$CommonCoreNotice.update({_id:id},{$set:{"notice_up_time":getNowFormatDate()}}, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1002', '置顶信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '置顶信息成功。', null, null));
        }
    });
};

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

/**
 * 审核数据
 * @param ids
 * @param entity
 * @param cb
 */
exports.reviewNotices = function(id, entity, cb) {
    var options = {};
    model.$CommonCoreNotice.update({_id:id},{$set:entity}, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1003', '审核信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '审核信息成功。', null, null));
        }
    });
}

/**
 * 获取信息(主页使用)
 * @param cb
 */
exports.getNoticesByIndex = function(cb){
    var query = model.$CommonCoreNotice.find({});
    query.limit(parseInt(6));
    query.where("notice_status","2");
    query.sort({notice_date:-1});
    query.exec(function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1004', '查询信息时出现异常。', null, error));
        }else{
            cb(utils.returnMsg(true, '0000', '查询信息成功。', rs, null));
        }
    });
}

/**
 * 获取信息(更多使用)
 * @param cb
 */
exports.getNoticesByIndexMore = function(cb){
    var query = model.$CommonCoreNotice.find({});
    query.limit(parseInt(12));
    query.where("notice_status","2");
    query.sort({notice_date:-1});
    query.exec(function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1004', '查询信息时出现异常。', null, error));
        }else{
            cb(utils.returnMsg(true, '0000', '查询信息成功。', rs, null));
        }
    });
}


exports.getNoticeMaxDate = function(cb){

    var query = model.$CommonCoreNotice.find({});

    query.where("notice_status","2");

    query.limit(1);

    query.sort({notice_up_time:-1});

    query.exec(function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1004', '查询信息时出现异常。', null, err));
        }else{
            cb(utils.returnMsg(true, '0000', '查询信息成功。', rs, null));
        }
    });
}