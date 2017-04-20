/**
 * Created by zhaojing on 2016/9/13.
 */
var model = require('../models/schedule_model');
var utils = require('../../core/utils/app_utils');
var mqtt_pub_client = require('../server/mqtt_pub_client')

/**
 * 获取任务列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getScheduleList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$, page, size, conditionMap, cb, null, {schedule_create_time:-1});
};

/**
 * 获取任务日志列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getScheduleLogList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$ScheduleLog, page, size, conditionMap, cb, null, {schedule_create_time:-1});
};

/**
 * 保存任务
 * @param data
 * @param cb
 */
exports.saveSchedule = function(data, cb){
    // 实例模型，调用保存方法
    model.$(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增任务时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增任务成功。', null, null));
        }
    });
}

/**
 * 修改任务
 * @param id
 * @param data
 * @param cb
 */
exports.updateSchedule = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1001', '修改任务时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改任务成功。', null, null));
        }
    });
}

/**
 * 启用、停用操作
 * @param jobInfo
 * @param schedule_status
 */
exports.startOrStop = function(jobInfo, schedule_status){
    var message = {
        schedule_id:jobInfo._id,
        schedule_name:jobInfo.schedule_name,
        schedule_code:jobInfo.schedule_code,
        schedule_cron:jobInfo.schedule_cron,
        schedule_date:jobInfo.schedule_date,
        schedule_js_path:jobInfo.schedule_js_path,
        schedule_js_fun:jobInfo.schedule_js_fun,
        schedule_ip:jobInfo.schedule_ip,
        schedule_status:schedule_status
    }
    mqtt_pub_client.publishOne(message);
}
