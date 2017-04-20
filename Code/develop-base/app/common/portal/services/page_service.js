var model = require('../../core/models/portal_model');
var utils = require('../../../common/core/utils/app_utils');

/**
 * 分页查询portal页面列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getPageList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$PortalPage, page, size, conditionMap, cb, null, {'page_code':1});
}

/**
 * 新增页面
 * @param data
 * @param cb
 */
exports.savePage = function(data, cb) {
    model.$PortalPage(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增portal页面时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增portal页面成功。', null, null));
        }
    });
}

/**
 * 修改页面
 * @param id
 * @param data
 * @param cb
 */
exports.updatePage = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$PortalPage.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改portal页面时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改portal页面成功。', null, null));
        }
    });
}

exports.getPage = function(id, cb){
    model.$PortalPage
        .find({'_id':id})
        .populate('page_layout_modules.module_id')
        .exec(function(error, result) {
            if (error) {
                cb(utils.returnMsg(false, '1000', '获取portal布局页面出现异常', null, error));
            }
            else {
                if(result && result.length >= 1) {
                    //console.log(result[0]);
                    cb(utils.returnMsg(true, '0000', '获取portal布局页面成功', result[0], null));
                }
                else {
                    cb(utils.returnMsg(false, '1001', '未获取到portal布局页面', null, null));
                }
            }
        });
}

/**
 * 获取模块组件列表
 * @param sysid
 * @param cb
 */
exports.getPortalModuleList = function(sysid, cb) {
    model.$PortalModule.find({'sys_id':sysid, 'module_status':1}).sort({'module_type':1, 'module_order':1})
        .exec(function(error, result) {
            if (error) {
                cb(utils.returnMsg(false, '1000', '获取portal模块组件列表出现异常', null, error));
            }
            else {
                if(result) {
                    cb(utils.returnMsg(true, '0000', '获取portal模块组件列表成功', result, null));
                }
                else {
                    cb(utils.returnMsg(false, '1001', '未获取到portal模块组件列表', null, null));
                }
            }
        });
}

/**
 * 更新页面中拥有的组件
 */
exports.updatePortalPageHasModules = function(userid, pageid, col_index_moduleids, cb) {
    var col_index_moduleid_array = col_index_moduleids.split(',');

    var page_layout_modules = new Array();

    col_index_moduleid_array.forEach(function(item){
        var item_array = item.split(':');
        var module = model.$PortalModule({_id: item_array[1]});
        page_layout_modules.push({col_index:parseInt(item_array[0]), module_id:module});
    });

    var conditions = {_id: pageid};
    var update = {$set: {page_layout_modules:page_layout_modules}};

    var options = {};
    model.$PortalPage.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '保存页面模块布局时出现异常', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '保存页面模块布局成功', null, null));
        }
    });
}