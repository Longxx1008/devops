// model
//var model = require('../models/org_model');
var model = require('../../core/models/user_model');
var utils = require('../../../common/core/utils/app_utils');
var tree = require('../../../common/core/utils/tree_utils');

/**
 * 分页查询
 * @param page
 * @param size
 * @param name
 * @param cb
 */
exports.getOrgList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$CommonCoreOrg, page, size,conditionMap, cb, null, {'org_pid': 1, 'org_order': 1});
};

exports.saveOrg = function(tempModel, cb) {
    // 实例模型，调用保存方法
    model.$CommonCoreOrg(tempModel).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '添加信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '添加信息成功。', null, null));
        }
    });
};

exports.getOrg = function(criteria,fields, cb) {
 /*   var criteria = {_id: id}; // 查询条件
    var fields = {_id:0, name: 1, age: 1}; // 待返回的字段*/
    var options = {};
    model.$CommonCoreOrg.find(criteria, fields, options, function (error, result) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '查询详情出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '查询详情成功。', result, null));
        }
    });
};

/**
 * 返回机构树
 * @param cb
 */
exports.getOrgTree = function(cb){
    var fields = {_id:1, org_name: 1, org_pid: 1}; // 待返回的字段
    var options = {sort: {'org_pid': 1, 'org_order': 1}};
    model.$CommonCoreOrg.find({},fields, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(tree.buildEasyuiTree(result, '_id', 'org_name', 'org_pid'));
        }
    });
}


exports.updateOrg = function(conditions, update, cb) {
    var options = {};
    model.$CommonCoreOrg.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改信息成功。', null, null));
        }
    });
};

exports.deleteOrg = function(conditions, cb) {
    model.$CommonCoreOrg.remove(conditions, function (error) {
        if (error) {
            cb(utils.returnMsg(false, '1000', '删除信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '删除信息成功。', null, null));
        }
    });
};