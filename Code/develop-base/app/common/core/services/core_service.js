/**
 * Created by ShiHukui on 2016/2/29.
 */
/*var menuModel = require('../models/menu_model');*/
var userModel = require('../models/user_model');
var roleMenuModel = require('../models/role_menu_model');
var portalModel = require('../models/portal_model');
var dictModel = require('../models/dict_model');
var paramModel = require('../models/param_model');
var app_api_model = require('../models/app_model');

var utils = require('../utils/app_utils');
var tree = require('../utils/tree_utils');
var memcached_utils = require('../utils/memcached_utils');


var schedule = require('node-schedule');
var config = require('../../../../config');


/**
 * 系统启动时初始化内容
 */
exports.init = function() {

    // 加载字典
    this.saveDictInCache(function(err, result){
        if(err) {
            console.error('加载字典失败。');
        }
        else {
            console.log('加载字典成功。');
        }
    });

    // 加载系统参数
    this.saveSysParamInCache(function (err, result){
        if(err) {
            console.error('加载系统参数失败。');
        }
        else {
            console.log('加载系统参数成功。');
        }
    });
    // 加载AppApi接口定义
    this.saveAppApiInCache(function (err, result){
        if(err) {
            console.error('加载AppApi接口定义失败。');
        }
        else {
            console.log('加载AppApi接口定义成功。');
        }
    });


}

exports.saveAppApiInCache = function(cb) {
    this.getAllAppApiData(function(apiData){
        memcached_utils.setAppApiDefine(apiData, function(err, result){
            cb(err, result);
        })
    });
}

/**
 * 保存数据字典至缓存
 * @param cb
 */
exports.saveDictInCache = function(cb) {
    // 加载字典数据
    this.getAllDictData(function(dictData){
        memcached_utils.setDict(dictData, function (err, result){
            cb(err, result);
        });
    });
}

/**
 * 保存系统参数值缓存
 * @param cb
 */
exports.saveSysParamInCache = function(cb) {
    // 加载系统参数
    this.getAllSysParamData(function(sysParamData){
        memcached_utils.setSysParam(sysParamData, function (err, result){
            cb(err, result);
        });
    });
}

/**
 * 获取系统菜单
 */
exports.getSysMenu = function(cb) {
    // 查询状态为启用的菜单
    roleMenuModel.$CommonCoreRoleMenu.find({menu_status:1}, null, {sort: {'menu_pid': 1, 'menu_order': 1}}, function(error, result){
        if(error) {
            cb(utils.returnMsg(false, '1000', '获取系统菜单时出现异常。', null, error));
        }
        else {
            /*var map ={};
             if(result != []) {
             for(var i = 0; i < result.length; i++) {
             var item = result[i];
             map[item.menu_code] = item;
             }
             }
             global.sysMenuMap = map;*/
            //console.log(tree.buildSysTree(result));
            // 递归生成系统菜单
            //cb(utils.returnMsg(true, '0000', '获取系统菜单成功。', tree.buildTree(result), null));
            //cb(utils.returnMsg(true, '0000', '获取系统菜单成功。', tree.buildSysTree(result), null));
            cb(utils.returnMsg(true, '0000', '获取系统菜单成功。', result, null));
        }
    });
};

/**
 * 获取系统数据
 * @param cb
 */
exports.getSysData = function(cb) {
    var fields = {_id:1, sys_code: 1, sys_name: 1}; // 待返回的字段
    var options = {};
    userModel.$CommonCoreSys.find({sys_status:1},fields, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
    });
};

/**
 * 获取机构数据
 * @param cb
 */
exports.getOrgTreeData = function(cb) {
    var fields = {_id:1, org_name: 1, org_pid: 1}; // 待返回的字段
    var options = {sort: {'org_pid': 1, 'org_order': 1}};
    userModel.$CommonCoreOrg.find({org_status:1},fields, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(tree.buildEasyuiTree(result, '_id', 'org_name', 'org_pid'));
        }
    });
}

//var memcached_utils = require('../utils/memcached_utils');

/**
 * 获取字典数据
 * @param cb
 */
/*var mongoose = require('mongoose');
 var testid = mongoose.mongo.ObjectId();*/
exports.getDictTreeData = function(dict_code, cb) {
    console.log("dict_code:"+dict_code);
    var fields = {field_value:1, field_name:1, field_parent_value:1}; // 待返回的字段
    var options = {sort: {'field_parent_value': 1, 'field_order': 1}};
    dictModel.$.find({dict_code:dict_code, dict_status:1}, function(err, dict){

        if(err) {
            cb(new Array());
        }
        else {
            if(dict.length > 0) {
                dictModel.$DictAttr.find({field_status:1, dict_id:dict[0]},fields, options, function(error, dictAttrs){
                    if(error) {
                        cb(new Array());
                    }
                    else {
                        //console.log(dictAttrs);
                        cb(tree.buildEasyuiTree(dictAttrs, 'field_value', 'field_name', 'field_parent_value'));
                    }
                });
            }
            else {
                cb(new Array());
            }
        }
    });
    /*dictModel.$DictAttr.find({field_status:1,'dict_id.dict_code':dict_code},fields, options)
     //.populate({path: 'dict_id', match: {'dict_code':{$eq: dict_code}, 'dict_status': {$eq: 1}}})
     //.find({"dict_id":null})
     //.populate("dict_id")
     //.where({"dict_id.dict_status":1})
     //.find({"dict_id":{$ne:null}})
     .exec(function(error, result) {
     console.log(error+"/"+result);
     if(error) {
     cb(new Array());
     }
     else {
     cb(tree.buildEasyuiTree(result, 'field_value', 'field_name', 'field_parent_value'));
     }
     });*/
}

/**
 * 获取所有的字典数据
 * @param cb
 */
exports.getAllDictData = function(cb) {
    var fields = {}; // 待返回的字段
    var options = {sort: {'dict_id':1, 'field_parent_value': 1, 'field_order': 1}};
    dictModel.$DictAttr.find({field_status:1},fields, options)
        .populate('dict_id')
        .exec(function(error, dictAttrs){
            if(error) {
                cb({});
            }
            else {
                // 循环处理字典数据
                var dictMap = {};
                for(var i = 0; i < dictAttrs.length; i++) {

                    // 解析字典属性
                    var dictCode = dictAttrs[i].dict_id.dict_code;
                    var dictAttrValue = dictAttrs[i].field_value;
                    var dictAttrText = dictAttrs[i].field_name;
                    var dictAttrPval = dictAttrs[i].field_parent_value;

                    var dictAttrMap = {id:dictAttrValue, text:dictAttrText, pid:dictAttrPval};

                    if(dictMap.hasOwnProperty(dictCode)) {
                        dictMap[dictCode].push(dictAttrMap);
                    }
                    else {
                        dictMap[dictCode] = [dictAttrMap];
                    }
                }
                // 返回结果
                cb(dictMap);
            }
        });
}

/**
 * 获取所有系统参数
 * @param cb
 */
exports.getAllSysParamData = function(cb) {
    var fields = {}; // 待返回的字段
    var options = {sort: {'param_sysid':1}};
    paramModel.$CommonParam.find({param_status:1},fields, options)
        .exec(function(error, paramData){
            if(error) {
                cb({});
            }
            else {
                // 循环处理字典数据
                var sysParamMap = {};
                for(var i = 0; i < paramData.length; i++) {

                    // 解析字典属性
                    var param_sysid = paramData[i].param_sysid;
                    var param_name = paramData[i].param_name;
                    var param_val = paramData[i].param_val;

                    if(sysParamMap.hasOwnProperty(param_sysid)) {
                        sysParamMap[param_sysid][param_name] = param_val;
                    }
                    else {
                        var param = {};
                        param[param_name] = param_val;
                        sysParamMap[param_sysid] = param;
                    }
                }
                // 返回结果
                cb(sysParamMap);
            }
        });
}

/**
 * 获取所有api定义
 * @param cb
 */
exports.getAllAppApiData = function(cb) {
    var fields = {}; // 待返回的字段
    var options = {};
    app_api_model.$.find({},fields, options)
        .exec(function(error, apiData){
            if(error) {
                cb({});
            }
            else {
                // 循环处理字典数据
                var apiMap = {};
                for(var i = 0; i < apiData.length; i++) {

                    // 解析字典属性
                    var api_code = apiData[i].api_code;

                    if(apiMap.hasOwnProperty(api_code)) {
                        apiMap[api_code] = apiData[i];
                    }
                    else {
                        apiMap[api_code] = apiData[i];
                    }
                }
                // 返回结果
                cb(apiMap);
            }
        });
}

/**
 * 获取系统菜单
 */
exports.getEuiMenu = function(cb) {
    // 查询状态为启用的菜单
    roleMenuModel.$CommonCoreRoleMenu.find({menu_status:1}, function(error, result){
        if(error) {
            cb(utils.returnMsg(false, '1000', '获取系统菜单时出现异常。', null, error));
        }
        else {
            //console.log(tree.buildEasyuiTree(result, "_id", "menu_name", "menu_pid", ["menu_code"]));
            cb(tree.buildEasyuiTree(result, "_id", "menu_name", "menu_pid", ["menu_code"]));
        }
    });
};

/**
 * 统计账号登录错误次数
 * @param account
 * @param cb
 */
exports.getLoginAccountErrorCount = function(login_account, cb) {
    userModel.$CommonUserLoginErrorLog.count({login_account:login_account, login_date:utils.formatTime('yyyy-MM-dd')},
        function(error, count) {
            cb(error, count);
        }
    );
}

/**
 * 保存用户登录错误日志
 * @param login_account
 * @param login_password
 * @param cb
 */
exports.saveUserLoginErrorLog = function(login_account, login_password, cb) {
    userModel.$CommonUserLoginErrorLog(
        {
            login_account:login_account,
            login_password:login_password,
            login_date:utils.formatTime('yyyy-MM-dd'),
            login_time:new Date()
        }
    ).save(function(error){
        cb(error);
    });
}

/**
 * 用户登录
 * @param cb
 */
exports.userLogin = function(account, password, cb) {

    // 检查账号
    exports.getLoginAccountErrorCount(account, function(count_error, count){
        if(count_error){
            cb(utils.returnMsg(false, '1007', '根据账号名获取用户信息时出现异常。', null, count_error));
        }
        else {
            var password_daily_err_count = config.auth.password_daily_err_count ? config.auth.password_daily_err_count : 5;
            if(count >= password_daily_err_count) {
                cb(utils.returnMsg(false, '1008', '密码输入错误次数已超过'+password_daily_err_count+'次。', null, null));
            }
            else {
                // 根据账号名获取用户信息并关联用户所在机构，所属系统，所拥有权限
                userModel.$.find({'login_account':account})
                    .populate(['user_org', 'user_sys', {path: 'user_roles', match: { 'role_status': { $eq: 1 }}}])
                    .exec(function(error, result){
                        if(error) {
                            cb(utils.returnMsg(false, '1000', '根据账号名获取用户信息时出现异常。', null, error));
                        }
                        else {
                            //cb(utils.returnMsg(true, '0000', '获取系统菜单成功。', result, null));
                            //console.log(result);
                            // 检查账号是否正确
                            if(result.length == 0) {
                                cb(utils.returnMsg(false, '1001', '账号不存在', null, null));
                            }
                            else if(result.length > 1) {
                                cb(utils.returnMsg(false, '1002', '账号重复', null, null));
                            }
                            else {
                                var userInfo = result[0];

                                //console.log(userInfo);
                                // 检查密码是否正确
                                if(userInfo.login_password != password) {

                                    // 此处保存错误日志记录
                                    exports.saveUserLoginErrorLog(account, password, function(log_error){
                                        if(log_error) {
                                            cb(utils.returnMsg(false, '1009', '根据账号名获取用户信息时出现异常。', null, log_error));
                                        }
                                        else {
                                            cb(utils.returnMsg(false, '1003', '密码错误', null, null));
                                        }
                                    });
                                }
                                else {
                                    // 检查系统是否禁用
                                    if(!userInfo.user_sys) {
                                        cb(utils.returnMsg(false, '1004', '账号未关联系统', null, null));
                                    }
                                    else {
                                        if(userInfo.user_roles.length == 0) {
                                            cb(utils.returnMsg(false, '1005', '账号未设置角色', null, null));
                                        }
                                        else {
                                            var opts = {path: 'user_roles', match: {'sys_id': {$eq: userInfo.user_sys._id}}};
                                            // 过滤掉不是同一系统的角色
                                            userInfo.populate(opts, function (err, populatedUserInfo) {
                                                //console.log("populatedUserInfo:" + populatedUserInfo);

                                                if (populatedUserInfo.user_roles.length == 0) {
                                                    cb(utils.returnMsg(false, '1006', '账号未设置同一系统下的角色', null, null));
                                                }
                                                else {
                                                    cb(utils.returnMsg(true, '0000', '登录成功', populatedUserInfo, null));
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
            }
        }
    });
};

/**
 * 本地自登录
 * @param cb
 */
exports.localLogin = function(account, cb) {

    // 根据账号名获取用户信息并关联用户所在机构，所属系统，所拥有权限
    userModel.$.find({'login_account':account})
        .populate(['user_org', 'user_sys', {path: 'user_roles', match: { 'role_status': { $eq: 1 }}}])
        .exec(function(error, result){
            if(error) {
                cb(utils.returnMsg(false, '1000', '根据账号名获取用户信息时出现异常。', null, error));
            }
            else {
                //cb(utils.returnMsg(true, '0000', '获取系统菜单成功。', result, null));
                //console.log(result);
                // 检查账号是否正确
                if(result.length == 0) {
                    cb(utils.returnMsg(false, '1001', '账号不存在', null, null));
                }
                else if(result.length > 1) {
                    cb(utils.returnMsg(false, '1002', '账号重复', null, null));
                }
                else {
                    var userInfo = result[0];

                    //console.log(userInfo);
                    // 检查密码是否正确
                    if(false) {
                        cb(utils.returnMsg(false, '1003', '密码错误', null, null));
                    }
                    else {
                        // 检查系统是否禁用
                        if(!userInfo.user_sys) {
                            cb(utils.returnMsg(false, '1004', '账号未关联系统', null, null));
                        }
                        else {
                            if(userInfo.user_roles.length == 0) {
                                cb(utils.returnMsg(false, '1005', '账号未设置角色', null, null));
                            }
                            else {
                                var opts = {path: 'user_roles', match: {'sys_id': {$eq: userInfo.user_sys._id}}};
                                // 过滤掉不是同一系统的角色
                                userInfo.populate(opts, function (err, populatedUserInfo) {
                                    //console.log("populatedUserInfo:" + populatedUserInfo);

                                    if (populatedUserInfo.user_roles.length == 0) {
                                        cb(utils.returnMsg(false, '1006', '账号未设置同一系统下的角色', null, null));
                                    }
                                    else {
                                        cb(utils.returnMsg(true, '0000', '登录成功', populatedUserInfo, null));
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
};

/**
 * 根据角色获取所拥有的权限（菜单和操作）
 * @param role_id
 * @param cb
 */
exports.getMenusAndOptsByRole = function(role_id, cb) {
    //console.log("role_id : %s", role_id);
    roleMenuModel.$.find({'role_id':role_id})
        .populate([{path: 'menu_id', match: { 'menu_status': { $eq: 1 }}},{path: 'menu_opts', match: { 'opt_status': { $eq: 1 }}}]).exec(function(error, result) {
        if (error) {
            cb(utils.returnMsg(false, '1000', '根据角色ID获取权限信息时出现异常。', null, error));
        }
        else {
            if(result.length == 0) {
                cb(utils.returnMsg(false, '1001', '根据角色ID未获取到权限信息', null, null));
            }
            else {
                //console.log("%s 所拥有的权限 : %s", role_id, result);
                cb(utils.returnMsg(true, '0000', '根据角色ID获取权限信息成功', result, null));
            }
        }
    });
};

/**
 * 检查用户是否分配角色权限
 * @param user_id
 * @param role_id
 * @param cb
 */
exports.hasRoleByUser = function(user_id, role_id, cb) {
    userModel.$.find({'_id':user_id})
        .populate([{path:'user_roles', match:{'_id':{$eq:role_id}}}]).exec(function(error, result) {
        if (error) {
            cb(utils.returnMsg(false, '1000', '检查用户是否分配角色权限时出现异常。', null, error));
        }
        else {
            // 检查用户状态
            if(!result && result.length != 1) {
                cb(utils.returnMsg(false, '1001', '未查询到当前用户信息', null, null));
            }
            else {
                if (result[0].user_status != 1) {
                    cb(utils.returnMsg(false, '1002', '当前用户已被禁用', null, null));
                }
                else {
                    if (result[0].user_roles.length == 0) {
                        cb(utils.returnMsg(false, '1003', '当前用户无此角色权限', null, null));
                    }
                    else {
                        cb(utils.returnMsg(true, '0000', '当前用户有此角色权限', result[0].user_roles[0], null));
                    }
                }
            }
        }
    });
};

exports.getPortalPage = function(sysid, cb) {
    portalModel.$PortalPage
        .find({'sys_id':sysid, 'page_is_default':1, 'page_status':1})
        .populate([{path: 'page_layout_modules.module_id', match: { 'module_status': { $eq: 1 }}}])
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
 * 根据编码获取page定义
 * @param sysid
 * @param pageCode
 * @param cb
 */
exports.getPortalPageByCode = function(sysid, roleid, pageCode, cb) {
    portalModel.$PortalPage
        .find({'sys_id':sysid, 'page_code':pageCode, 'page_status':1})
        .populate([{path: 'page_layout_modules.module_id', match: { 'module_status': { $eq: 1 },'$or':[{'module_roles':{$elemMatch:{$eq:roleid}}}, {'module_is_public':1}]}}])
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
 * 获取个人自定义页面
 * @param user_id
 * @param page_id
 * @param cb
 */
exports.getPortalPagePersonal = function(user_id, role_id, page_id, cb) {
    portalModel.$PortalPagePersonal.find({user_id:user_id, page_id:portalModel.$PortalPage({_id:page_id})})
        .populate([{path: 'page_layout_modules.module_id', match: { 'module_status': { $eq: 1 }, '$or':[{'module_roles':{$elemMatch:{$eq:role_id}}}, {'module_is_public':1}]}}])
        .exec(function(error, result) {
            if (error) {
                cb(utils.returnMsg(false, '1000', '获取portal个人自定义布局模块出现异常', null, error));
            }
            else {
                if(result && result.length >= 1) {
                    cb(utils.returnMsg(true, '0000', '获取portal个人自定义布局模块成功', result[0], null));
                }
                else {
                    cb(utils.returnMsg(false, '1001', '未获取到portal个人自定义布局模块', null, null));
                }
            }
        });
}

exports.getPortalModule = function(sysid, moduleid, role_id, cb) {
    portalModel.$PortalModule.find({'sys_id':sysid, '_id':moduleid, 'module_status':1, '$or':[{'module_roles':{$elemMatch:{$eq:role_id}}}, {'module_is_public':1}]})
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

/**
 * 获取模块组件列表
 * @param sysid
 * @param cb
 */
exports.getPortalModuleList = function(sysid, roleid, cb) {
    portalModel.$PortalModule.find({'sys_id':sysid, 'module_status':1, '$or':[{'module_roles':{$elemMatch:{$eq:roleid}}}, {'module_is_public':1}]})
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

    // 检查页面是否可自定义
    portalModel.$PortalPage.find({_id:pageid, page_status:1, page_is_customize:1}).exec(function(error0, pageResult) {
        if (error0) {
            cb(utils.returnMsg(false, '1000', '保存页面模块布局时出现异常', null, error));
        }
        else {
            if(pageResult.length > 0) {
                var page_layout_modules = new Array();
                if (col_index_moduleids) {
                    var col_index_moduleid_array = col_index_moduleids.split(',');
                    col_index_moduleid_array.forEach(function (item) {
                        var item_array = item.split(':');
                        var module = portalModel.$PortalModule({_id: item_array[1]});
                        page_layout_modules.push({col_index: parseInt(item_array[0]), module_id: module});
                    });
                }
                //console.log('page_layout_modules:'+page_layout_modules.length);
                var conditions = {page_id: portalModel.$PortalPage({_id: pageid}), user_id: userid};
                // 检查用户个人页面定义是否存在
                portalModel.$PortalPagePersonal.find(conditions)
                    .exec(function (error, result) {
                        if (error) {
                            cb(utils.returnMsg(false, '1002', '保存页面模块布局时出现异常', null, error));
                        }
                        else {
                            // 数据存在做更新操作，否则做新增操作
                            if (result.length > 0) {
                                var update = {$set: {page_layout_modules: page_layout_modules}};

                                var options = {};
                                portalModel.$PortalPagePersonal.update(conditions, update, options, function (error1) {
                                    if (error1) {
                                        cb(utils.returnMsg(false, '1003', '保存页面模块布局时出现异常', null, error1));
                                    }
                                    else {
                                        cb(utils.returnMsg(true, '0000', '保存页面模块布局成功', null, null));
                                    }
                                });
                            }
                            else {
                                portalModel.$PortalPagePersonal(
                                    {
                                        page_id: portalModel.$PortalPage({_id: pageid}),
                                        user_id: userid,
                                        page_layout_modules: page_layout_modules
                                    }).save(function (error2) {
                                    if (error2) {
                                        cb(utils.returnMsg(false, '1004', '保存页面模块布局时出现异常', null, error2));
                                    }
                                    else {
                                        cb(utils.returnMsg(true, '0000', '保存页面模块布局成功', null, null));
                                    }
                                });
                            }
                        }
                    });
            }
            else {
                cb(utils.returnMsg(false, '1001', '保存页面模块布局时出现异常', null, null));
            }
        }
    });
}

/**
 * 获取机构附加属性
 * @param org_id
 * @param cb
 */
exports.getOrgAttachAttr = function(org_id, cb) {
    var fields = {_id:0,org_id:1,start_time:1,end_time:1,attr_items:1}; // 待返回的字段
    var options = {};
    var currentTime = new Date();
    userModel.$CommonCoreOrgAttachAttr.find({org_id:org_id, start_time:{'$lte':currentTime}, end_time:{'$gt':currentTime}},fields, options)
    //.populate("org_id")
        .exec(function(error, result) {
            if(error) {
                cb(null);
            }
            else {
                if(result.length > 0) {
                    cb(result[0]);
                }
                else {
                    cb(null);
                }
            }
        });
}



