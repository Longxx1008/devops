/**
 * Created by 兰 on 2017-09-19.
 */
var utils = require('../../../common/core/utils/app_utils');
var model = require('../../core/models/schedule_model');
/**
 * 获取代办事项列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */

/*exports.getScheduleList = function(page, size, conditionMap, cb) {

    utils.pagingQuery4Eui(model.$CommonCoreNotice, page, size, conditionMap, cb, populate);
};

exports.getScheduleInfo = function(id, fields, cb) {
    var query = model.$CommonCoreSchedule.find({});
    query.where('_id', id);
    query.exec(function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1001', '查询详情出现异常。', null, err));
        }else{
            cb(utils.returnMsg(true, '0000', '查询详情成功。', rs, null));
        }
    });
};*/



/**
 * 分页查询
 * @param page
 * @param size
 * @param name
 * @param cb
 */
exports.getSchedules = function(page, size, conditionMap, cb) {
    var populate = {path:'schedule_creator ',select:{_id: 1,user_name: 1}};  //j将发布者schedule_creator从_id转换成 姓名 存到 schedule_creator 变量中传到页面显示。
    utils.pagingQuery4Eui(model.$CommonCoreSchedule, page, size, conditionMap, cb, populate);
};

/**
 * 查询详情
 * @param id
 * @param fields
 * @param cb
 */
exports.getScheduleInfo = function(id, fields, cb) {
    var query = model.$CommonCoreSchedule.find({});
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
 * 删除待办事项
 * @param id
 * @param fields
 * @param cb
 */
exports.deleteSchedule = function(id, cb) {
   console.log("**********************************"+id+"**************************************");
    model.$CommonCoreSchedule.remove({_id:id},function(err,docs){
        if(err) {
            cb(utils.returnMsg(false, '1002', '删除信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '删除信息成功。', null, null));
        }
    });

};


/**
 * 获取信息(主页使用)
 * @param cb
 */
exports.getScheduleByIndex = function(cb){
    var query = model.$CommonCoreSchedule.find({});
    query.limit(parseInt(6));
    query.where("schedule_grade","1");
    query.sort({schedule_complete_time:1});
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
exports.getSchedulesByIndexMore = function(cb){
    var query = model.$CommonCoreSchedule.find({});
    query.limit(parseInt(12));
    query.sort({schedule_complete_time:1});
    query.exec(function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1004', '查询信息时出现异常。', null, error));
        }else{
            cb(utils.returnMsg(true, '0000', '查询信息成功。', rs, null));
        }
    });
}




/**
 * 添加数据
 * @param entity
 * @param cb
 */
exports.saveSchedules = function(entity, cb) {
    model.$CommonCoreSchedule(entity).save(function(error) {
        if (error) {
            cb(utils.returnMsg(false, '1000', '添加信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '添加信息成功。', null, null));
        }
    });
};



/**
 * 修改数据
 * @param conditions
 * @param update
 * @param cb
 */
exports.updateSchedule = function(conditions, update, cb) {
    var options = {};
    model.$CommonCoreSchedule.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1002', '修改信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改信息成功。', null, null));
        }
    });
};

// /**
//  *
//  * @param conditions
//  * @param update
//  * @param cb
//  */
// exports.doUpNotice = function(id, cb) {
//     var options = {};
//     model.$CommonCoreNotice.update({_id:id},{$set:{"notice_up_time":getNowFormatDate()}}, options, function (error) {
//         if(error) {
//             cb(utils.returnMsg(false, '1002', '置顶信息时出现异常。', null, error));
//         }
//         else {
//             cb(utils.returnMsg(true, '0000', '置顶信息成功。', null, null));
//         }
//     });
// };
//
// function getNowFormatDate() {
//     var date = new Date();
//     var seperator1 = "-";
//     var seperator2 = ":";
//     var month = date.getMonth() + 1;
//     var strDate = date.getDate();
//     if (month >= 1 && month <= 9) {
//         month = "0" + month;
//     }
//     if (strDate >= 0 && strDate <= 9) {
//         strDate = "0" + strDate;
//     }
//     var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
//         + " " + date.getHours() + seperator2 + date.getMinutes()
//         + seperator2 + date.getSeconds();
//     return currentdate;
// }
//
// /**
//  * 审核数据
//  * @param ids
//  * @param entity
//  * @param cb
//  */
// exports.reviewNotices = function(id, entity, cb) {
//     var options = {};
//     model.$CommonCoreNotice.update({_id:id},{$set:entity}, options, function (error) {
//         if(error) {
//             cb(utils.returnMsg(false, '1003', '审核信息时出现异常。', null, error));
//         }
//         else {
//             cb(utils.returnMsg(true, '0000', '审核信息成功。', null, null));
//         }
//     });
// }


// exports.getNoticeMaxDate = function(cb){
//
//     var query = model.$CommonCoreNotice.find({});
//
//     query.where("notice_status","2");
//
//     query.limit(1);
//
//     query.sort({notice_up_time:-1});
//
//     query.exec(function(err,rs){
//         if(err){
//             cb(utils.returnMsg(false, '1004', '查询信息时出现异常。', null, err));
//         }else{
//             cb(utils.returnMsg(true, '0000', '查询信息成功。', rs, null));
//         }
//     });
