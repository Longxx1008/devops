var model = require('../../core/models/user_model');
var utils = require('../../../common/core/utils/app_utils');

/**
 * 分页查询系统
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getSysList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$CommonCoreSys, page, size, conditionMap, cb);
}

/**
 * 保存系统信息
 * @param data
 * @param cb
 */
exports.saveSys = function(data, cb) {
    model.$CommonCoreSys(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '添加系统时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '添加系统成功。', null, null));
        }
    });
}

exports.updateSys = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonCoreSys.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改系统时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改系统成功。', null, null));
        }
    });
}
