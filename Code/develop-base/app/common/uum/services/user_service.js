var model = require('../../core/models/user_model');
var utils = require('../../core/utils/app_utils');
var config = require('../../../../config');

/**
 * 分页查询用户列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getUserList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$, page, size, conditionMap, cb, ['user_org', 'user_sys']);
};

/**
 * 根据系统获取角色
 * @param sys_id
 * @param cb
 */
exports.getRoleBySys = function(sys_id, cb) {
    var fields = {_id:1, role_name: 1};
    var options = {};
    model.$CommonCoreRole.find({role_status:1, sys_id: sys_id}, fields, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
    });
}

/**
 * 新增用户
 */
exports.saveUser = function(data, sysid, roleids, orgid, cb) {
    try{
        // 按规则设置密码
        var password = data.login_account + config.project.password_suffix;
        data.login_password = utils.encryptDataByMD5(password);

        var sys = model.$CommonCoreSys({_id:sysid});
        data.user_sys = sys;

        var org = model.$CommonCoreOrg({_id:orgid});
        data.user_org = org;

        roleids.forEach(function(roleid) {
            var role = model.$CommonCoreRole({_id:roleid});
            data.user_roles.push(role);
        });

        // 实例模型，调用保存方法
        model.$(data).save(function(error){
            if(error) {
                cb(utils.returnMsg(false, '1000', '新增用户时出现异常', null, error));
            }
            else {
                cb(utils.returnMsg(true, '0000', '新增用户成功', null, null));
            }
        });
    }
    catch(e){
        cb(utils.returnMsg(false, '1001', '新增用户时出现异常', null, e));
    }
};

/**
 * 获取用户详情
 * @param userid
 * @param cb
 */
exports.getUser = function(userid, cb){
    model.$.find({_id:userid}, function(error, result) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '获取用户信息时出现异常', null, error));
        }
        else {
            if(result.length == 0) {
                cb(utils.returnMsg(false, '1001', '未能获取该用户信息', null, null));
            }
            else {
                cb(utils.returnMsg(true, '0000', '获取用户信息成功', result[0], null));
            }
        }
    });
};

/**
 * 修改用户信息
 * @param id
 * @param data
 * @param sysid
 * @param roleids
 * @param orgid
 * @param cb
 */
exports.updateUser = function(id, data, sysid, roleids, orgid, cb) {
    try{
        var sys = model.$CommonCoreSys({_id:sysid});
        data.user_sys = sys;

        var org = model.$CommonCoreOrg({_id:orgid});
        data.user_org = org;

        roleids.forEach(function(roleid) {
            var role = model.$CommonCoreRole({_id:roleid});
            data.user_roles.push(role);
        });

        var conditions = {_id: id};
        var update = {$set: data};

        var options = {};
        model.$.update(conditions, update, options, function (error) {
            if(error) {
                cb(utils.returnMsg(false, '1000', '修改用户信息时出现异常。', null, error));
            }
            else {
                cb(utils.returnMsg(true, '0000', '修改用户信息成功。', null, null));
            }
        });
    }
    catch(e){
        cb(utils.returnMsg(false, '1001', '修改用户信息时出现异常', null, e));
    }
}

/**
 * 重置密码
 * @param userid
 * @param cb
 */
exports.resetPwd = function(userid, cb) {
    model.$.find({_id:userid}, function(error, result) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '重置密码时出现异常', null, error));
        }
        else {
            if(result.length == 0) {
                cb(utils.returnMsg(false, '1001', '重置密码时未能找到该用户', null, null));
            }
            else {

                var user = result[0];
                //var password = user.login_account + '';
                var password = user.login_account + config.project.password_suffix;

                var conditions = {_id: userid};
                var update = {$set: {login_password:utils.encryptDataByMD5(password)}};

                var options = {};
                model.$.update(conditions, update, options, function (error) {
                    if(error) {
                        cb(utils.returnMsg(false, '1002', '重置密码时出现异常', null, error));
                    }
                    else {
                        cb(utils.returnMsg(true, '0000', '重置密码成功。', null, null));
                    }
                });
            }
        }
    });
}
