var model = require('../../core/models/portal_model');
var utils = require('../../../common/core/utils/app_utils');

/**
 * 分页查询组件列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getModuleList = function(page, size, conditionMap, populate, cb) {
    utils.pagingQuery4Eui(model.$PortalModule, page, size, conditionMap, cb, populate, {'module_type':1,'module_order':1});
}

/**
 * 新增组件
 * @param data
 * @param cb
 */
exports.saveModule = function(data, cb) {
    model.$PortalModule(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增组件时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增组件成功。', null, null));
        }
    });
}

/**
 * 修改组件
 * @param module_id
 * @param data
 * @param cb
 */
exports.updateModule = function(module_id, data, cb) {
    var conditions = {_id: module_id};
    var update = {$set: data};

    var options = {};
    model.$PortalModule.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改组件时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改组件成功。', null, null));
        }
    });
}

exports.getPortalModule = function(moduleid, cb) {
    model.$PortalModule.find({'_id':moduleid, 'module_status':1})
        .exec(function(error, result) {
            if (error) {
                cb(utils.returnMsg(false, '1000', '获取portal布局模块出现异常', null, error));
            }
            else {
                if(result && result.length >= 1) {
                    cb(utils.returnMsg(true, '0000', '获取portal布局模块成功', result[0], null));
                }
                else {
                    cb(utils.returnMsg(false, '1001', '未获取到portal布局模块', null, null));
                }
            }
        });
}