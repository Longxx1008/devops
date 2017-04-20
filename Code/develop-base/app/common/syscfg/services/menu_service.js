var model = require('../../core/models/role_menu_model');
var utils = require('../../../common/core/utils/app_utils');
var tree = require('../../../common/core/utils/tree_utils');

/**
 * 获取系统菜单
 * @param cb
 */
exports.getSysMenu = function(sysid, cb) {
    var criteria = {menu_sysid: sysid};
    var fields ={_id:1, menu_name:1, menu_pid:1, menu_nav:1};
    var options = {sort:{'menu_pid':1,'menu_order':1}};

    model.$CommonCoreRoleMenu.find(criteria, fields, options, function (error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            var menuArray = new Array();
            result.forEach(function (menu) {
                var menuObj = {};
                menuObj['id'] = menu._id;
                menuObj['text'] = menu.menu_name;
                menuObj['pid'] = menu.menu_pid;
                //menuObj['iconCls'] = 'icon-role-menu';
                menuObj['attributes'] = {'nav': menu.menu_nav};

                menuArray.push(menuObj);
            });
            cb(tree.transData(menuArray, "id", "pid", "children"));
            //cb(tree.buildEasyuiTree(result, "_id", "menu_name", "menu_pid", ["menu_nav"]));
        }
    });
}

/**
 * 分页查询菜单信息
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getMenuList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$CommonCoreRoleMenu, page, size, conditionMap, cb, null, {'menu_pid':1,'menu_order':1});
}

/**
 * 新增菜单
 * @param data
 * @param cb
 */
exports.saveMenu = function(data, cb) {
    model.$CommonCoreRoleMenu(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增菜单时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增菜单成功。', null, null));
        }
    });
}

/**
 * 修改菜单
 * @param data
 * @param cb
 */
exports.updateMenu = function(id, data, cb) {

    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonCoreRoleMenu.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改菜单时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改菜单成功。', null, null));
        }
    });
}

/**
 * 获取系统操作数据
 * @param menu_id
 * @param cb
 */
exports.getMenuOpt = function(menu_id, cb) {
    var options = {sort: {'opt_order':1}};
    model.$CommonCoreMenuOpt.find({menu_id:menu_id}, null, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
    });
}

/**
 * 新增菜单操作
 * @param data
 * @param cb
 */
exports.saveMenuOpt = function(data, cb) {
    model.$CommonCoreMenuOpt(data).save(function(error, result) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增操作时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增操作成功。', null, null));
        }
    });
}

/**
 * 修改菜单操作
 * @param id
 * @param data
 * @param cb
 */
exports.updateMenuOpt = function(id, data, cb) {

    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonCoreMenuOpt.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改操作时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改操作成功。', null, null));
        }
    });
}

/**
 * 批量新增菜单操作
 * @param menuOpts
 * @param cb
 */
exports.batchSaveMenuOpt = function(menuOpts, cb) {
    console.log(menuOpts);
    model.$CommonCoreMenuOpt.create(menuOpts, function(err, docs) {
        if(err) {
            cb(utils.returnMsg(false, '1001', '批量新增操作时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '批量新增操作成功。', null, null));
        }
    });
}

