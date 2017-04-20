var model = require('../../core/models/param_model');
var utils = require('../../core/utils/app_utils');
var tree = require('../../core/utils/tree_utils');

/**
 * 获取参数类别
 * @param cb
 */
exports.getSysCatalog = function(sysid, cb) {
    var criteria = {catalog_sysid: sysid};
    var fields ={_id:1, catalog_name:1, catalog_pid:1};
    var options = {};

    model.$CommonParamCataLog.find(criteria, fields, options, function (error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            var catalogArray = new Array();
            result.forEach(function (catalog) {
                var catalogObj = {};
                catalogObj['id'] = catalog._id;
                catalogObj['text'] = catalog.catalog_name;
                catalogObj['pid'] = catalog.catalog_pid;
                //menuObj['iconCls'] = 'icon-role-menu';
                //menuObj['attributes'] = {'nav': menu.menu_nav};

                catalogArray.push(catalogObj);
            });
            cb(tree.transData(catalogArray, "id", "pid"));
            //cb(tree.buildEasyuiTree(result, "_id", "menu_name", "menu_pid", ["menu_nav"]));
        }
    });
}

/**
 * 分页查询参数信息
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getParamList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$CommonParam, page, size, conditionMap, cb, null, {});
}

/**
 * 新增参数
 * @param data
 * @param cb
 */
exports.saveParam = function(data, cb) {
    model.$CommonParam(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增参数时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增参数成功。', null, null));
        }
    });
}

/**
 * 新增参数类别
 * @param data
 * @param cb
 */
exports.saveParamCatalog = function(data, cb) {
    model.$CommonParamCataLog(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增参数类别时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增参数类别成功。', null, null));
        }
    });
}

/**
 * 修改参数
 * @param data
 * @param cb
 */
exports.updateParam = function(id, data, cb) {

    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonParam.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改参数时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改参数成功。', null, null));
        }
    });
}

/**
 * 修改参数类别
 * @param data
 * @param cb
 */
exports.updateParamCatalog = function(id, data, cb) {

    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonParamCataLog.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改参数类别时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改参数类别成功。', null, null));
        }
    });
}

/**
 * 获取类别数据数据
 * @param menu_id
 * @param cb
 */

exports.getParamCatalog = function(id, cb) {
    var options = {};
    model.$CommonParamCataLog.find({_id:id}, null, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
    });
}
