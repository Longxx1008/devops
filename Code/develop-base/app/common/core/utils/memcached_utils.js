var Memcached = require('memcached');
var config = require('../../../../config');
var key_prefix = config.project.appid + '_';
var utils = require('./app_utils');

exports.setVal = function(key, value, lifetime, cb) {
    var memcached = new Memcached(config.memcached.server_locations, config.memcached.options);
    memcached.set(key_prefix + key, value, lifetime, function (err, result) {
        if(err) {
            console.error(err);
            cb(err, result);
        }
        else {
            console.log(key_prefix + key + ' stored in memcached');
            // 保存成功之后的回调
            cb(err, result);
        }
        memcached.end();
    });
}

exports.getVal = function(key, cb) {
    var memcached = new Memcached(config.memcached.server_locations, config.memcached.options);
    memcached.get(key_prefix + key, function (err, data) {
        if(err) {
            console.error( err );
            cb(err, data);
        }
        else {
            cb(err, data);
        }
        memcached.end();
    });
}

exports.delVal = function(key, cb) {
    var memcached = new Memcached(config.memcached.server_locations, config.memcached.options);
    memcached.del(key_prefix + key, function(err, result){
        cb(err, result);
        memcached.end();
    });
}

/**
 * 根据参数名获取参数值
 * @param req
 * @param param_name
 * @param cb
 */
exports.getSysParamByName = function(req, param_name, cb) {
    this.getSysParam(req, function(sysParamMap){
        if(sysParamMap.hasOwnProperty(param_name)) {
            cb(sysParamMap[param_name]);
        }
        else {
            cb(null);
        }
    });
}

/**
 * 根据参数名获取参数值
 * @param req
 * @param param_name
 * @param cb
 */
exports.getSysParam = function(req, cb) {
    this.getVal('common_sys_param_data', function(err, data){
        var currentUser = utils.getCurrentUser(req);
        var sysId = currentUser.user_sys._id;
        if(sysId) {
            if(data.hasOwnProperty(sysId)) {
                cb(data[sysId]);
            }
            else {
                cb({});
            }
        }
        else {
            cb({});
        }
    });
}

exports.getDict = function(cb) {
    this.getVal('common_dict_data', cb);
}

/**
 * 保存字典数据至缓存
 * @param dictData
 * @param cb
 */
exports.setDict = function(dictData, cb) {
    this.setVal('common_dict_data', dictData, 0, function (err, result){
        cb(err, result);
    });
}

/**
 * 保存系统参数数据至缓存
 * @param sysParamData
 * @param cb
 */
exports.setSysParam = function(sysParamData, cb) {
    this.setVal('common_sys_param_data', sysParamData, 0, function (err, result){
        cb(err, result);
    });
}

/**
 * 保存app api定义至缓存
 * @param apiData
 * @param cb
 */
exports.setAppApiDefine = function(apiData, cb) {
    this.setVal('common_app_api_data', apiData, 0, function (err, result){
        cb(err, result);
    });
}

/**
 * 从缓存中获取app api定义
 * @param cb
 */
exports.getAppApiDefine = function(cb) {
    this.getVal('common_app_api_data', cb);
}