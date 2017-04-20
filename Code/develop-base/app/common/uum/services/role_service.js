// model
//var model = require('../models/role_model');
var model = require('../../core/models/user_model');
var role_menu_model = require('../../core/models/role_menu_model');
var utils = require('../../core/utils/app_utils');
var treeUtils = require('../../core/utils/tree_utils');

/**
 * 获取角色列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getRoleList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$CommonCoreRole, page, size, conditionMap, cb);
};

/**
 * 新增角色
 * @param data
 * @param cb
 */
exports.saveRole = function(data, cb) {
    // 实例模型，调用保存方法
    model.$CommonCoreRole(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增角色时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增角色成功。', null, null));
        }
    });
}

/**
 * 修改角色信息
 * @param id
 * @param data
 * @param cb
 */
exports.updateRole = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonCoreRole.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改角色时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改角色成功。', null, null));
        }
    });
}

/**
 * 获取角色拥有的菜单和操作权限（id）
 * @param role_id
 * @param cb
 */
exports.getRoleHasMenusAndOpts = function(role_id, cb) {
    // 获取当前角色分配的菜单及操作
    //model.$CommonRoleMenuOptModel
    role_menu_model.$.find({role_id:role_id}).exec(function(err1, result){
        var hasMenusOptsArray = new Array();
        result.forEach(function (o) {
            o.menu_opts.forEach(function (opt) {
                hasMenusOptsArray.push(opt);
            });
            hasMenusOptsArray.push(o.menu_id);
        });
        cb(hasMenusOptsArray);
    });
}

/**
 * 根据系统获取菜单和操作树
 * @param sys_id
 * @param cb
 */
exports.getMenuAndOptTreeBySys = function(sys_id, cb) {
    //model.$CommonMenuInfoModel
    role_menu_model.$CommonCoreRoleMenu.find({menu_sysid: sys_id, menu_status: 1}, null, {sort: {'menu_pid': 1, 'menu_order': 1}}).exec(function (error, menus) {
        //model.$CommonMenuOptModel
        role_menu_model.$CommonCoreMenuOpt.find().exec(function (err, opts) {
            var menuOptArray = new Array;
            menus.forEach(function (menu) {
                var menuObj = {};
                menuObj['id'] = menu._id;
                menuObj['text'] = menu.menu_name;
                menuObj['pid'] = menu.menu_pid;
                menuObj['iconCls'] = 'icon-role-menu';
                menuObj['attributes'] = {'pid': menu.menu_pid,'type':1};

                opts.forEach(function (opt) {
                    if (opt.menu_id == menu._id) {
                        var childObj = {};
                        childObj['id'] = opt._id;
                        childObj['text'] = opt.opt_name;
                        childObj['pid'] = opt.menu_id;
                        childObj['iconCls'] = 'icon-role-opt';
                        childObj['attributes'] = {'pid': opt.menu_id,'type':2};
                        menuOptArray.push(childObj);
                    }
                });

                menuOptArray.push(menuObj);
            });
            cb(treeUtils.transData(menuOptArray, "id", "pid", "children"));
        });
    });
}

/**
 * 保存角色权限
 * @param role_id
 * @param datas
 * @param cb
 */
exports.saveRoleMenuOpt = function(role_id, datas, cb) {
    // 清空role_id相关数据
    var conditions = {role_id: role_id};
    //model.$CommonRoleMenuOptModel
    role_menu_model.$.remove(conditions, function (error) {
        if (error) {
            cb(utils.returnMsg(false, '1000', '分配角色权限时出现异常。', null, error));
        }
        else {
            var menus = new Array();
            // 解析data数据
            datas.forEach(function(data){
                // 菜单
                if(data.type == 1) {
                    //var menu = model.$CommonMenuInfoModel({_id: data.id});
                    var menu = role_menu_model.$CommonCoreRoleMenu({_id: data.id});
                    menus.push({role_id:role_id,menu_id:menu,menu_opts:[]});
                }
                // 操作
                else {
                    menus.forEach(function(menu){
                        if(menu.menu_id._id == data.pid) {
                            //var opt = model.$CommonMenuOptModel({_id: data.id});
                            var opt = role_menu_model.$CommonCoreMenuOpt({_id: data.id});
                            menu.menu_opts.push(opt);
                        }
                    });
                }
            });
            // 批量保存菜单信息
            //model.$CommonRoleMenuOptModel
            role_menu_model.$.create(menus, function(err, docs) {
                if(error) {
                    cb(utils.returnMsg(false, '1001', '分配角色权限时出现异常。', null, error));
                }
                else {
                    cb(utils.returnMsg(true, '0000', '分配角色权限成功。', null, null));
                }
            });
        }
    });
}

