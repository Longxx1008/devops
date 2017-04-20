var model = require('../../core/models/app_model');
var utils = require('../../core/utils/app_utils');
var config = require('../../../../config');

/**
 * 分页查询Api定义列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getAppApiDefineList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$, page, size, conditionMap, cb);
};

/**
 * 保存App api定义
 * @param data
 * @param cb
 */
exports.saveAppApiDefine = function(data, cb) {
    model.$(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增App接口定义时出现异常', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增App接口定义成功', null, null));
        }
    });
}

/**
 * 修改接口定义
 * @param id
 * @param data
 * @param cb
 */
exports.updateAppApiDefine = function(id, data, cb) {
    try{

        var conditions = {_id: id};
        var update = {$set: data};

        var options = {};
        model.$.update(conditions, update, options, function (error) {
            if(error) {
                console.log(error);
                cb(utils.returnMsg(false, '1000', '修改App接口定义时出现异常。', null, error));
            }
            else {
                cb(utils.returnMsg(true, '0000', '修改App接口定义成功。', null, null));
            }
        });
    }
    catch(e){
        cb(utils.returnMsg(false, '1001', '修改App接口定义时出现异常', null, e));
    }
}

exports.findTest = function() {

    var fields = {};
    var options = {sort: {'my_order': -1}};
    model.$.find({}, fields, options, function(error, result) {
        if(error) {
            console.log('error');
        }
        else {
            result.sort(function (a, b) {
                return b.my_order - a.my_order;
            });

            for(var i = 0;  i < result.length; i++) {
                console.log(result[i].api_code+'|'+result[i].api_name+'|'+result[i].my_order);
            }
        }
    });
}

exports.findTest();