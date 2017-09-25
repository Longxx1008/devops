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
exports.getScheduleList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$CommonCoreSchedule, page, size, conditionMap, cb);
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
};
