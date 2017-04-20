// 字典model
var model = require('../../core/models/dict_model');
var utils = require('../../core/utils/app_utils');

/**
 * 编码唯一性验证
 * @param flag
 * @param code
 * @param cb
 */
exports.checkCode = function (flag,code,cb,id) {
    var query;
    if(flag == 1){
        query =  model.$.find({});
        query.where('dict_code',code);
    }else if(flag == 2){
        query =  model.$DictAttr.find({});
        query.where('field_code',code);
    }else if(flag == 3){
        query =  model.$.find({});
        query.where('dict_code',code);
        query.where({'_id':{'$ne':id}});
    }else if(flag == 4){
        query =  model.$DictAttr.find({});
        query.where('field_code',code);
        query.where({'_id':{'$ne':id}});
    }else if(flag == 5){
        query =  model.$DictAttr.find({});
        query.where({'field_code':{'$in':code}});
    }
    query.exec(function(err,rs){
        if(err){
            cb({'success':false, 'code':'1004', 'msg':'编码唯一性验证时出现异常。'});
        }else{
            if(rs.length > 0){
                cb({'success':false, 'code':'1005', 'msg':'编码重复'});
            }else {
                cb({'success':true});
            }
        }
    });
}

/**
 * 获取字典列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getDictList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$, page, size, conditionMap, cb);
};

/**
 * 获取字典属性列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getDictAttrListByCombotree = function(conditionMap,cb) {
    var query = model.$DictAttr.find({});
    if(conditionMap){
        for(var key in conditionMap){
            query.where(key, conditionMap[key]);
        }
    }
    query.exec(function(error,rs){
        if(error){
            cb(exports.returnMsg(false, '1000', '查询时出现异常。', null, error));
        }else{
            cb(rs);
        }
    });
};


/**
 * 获取字典属性列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getDictAttrList = function(conditionMap, sort, cb) {
    var query = model.$DictAttr.find({});
    if(conditionMap){
        for(var key in conditionMap){
            query.where(key, conditionMap[key]);
        }
    }
    if(sort) {
        query.sort(sort);
    }
    query.exec(function(error,rs){
        if(error){
            cb(exports.returnMsg(false, '1000', '查询时出现异常。', null, error));
        }else{
            cb(rs);
        }
    });
};

/**
 * 新增字典
 * @param data
 * @param cb
 */
exports.saveDict = function(data, cb) {
    // 实例模型，调用保存方法
    model.$(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增字典时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增字典成功。', null, null));
        }
    });
}

/**
 * 新增字典并返回ID
 * @param data
 * @param cb
 */
exports.saveDictAndReturnId = function (data,cb){
    model.$(data).save(function(err,rs){
        if(err) {
            cb({'success':false, 'code':'1000', 'msg':'新增字典时出现异常。'});
        }
        else {
            cb({'success':true, 'id':rs._doc._id});
        }
    });
}

/**
 * 新增字典属性
 * @param data
 * @param cb
 */
exports.saveDictAttr = function(data, cb) {
    // 实例模型，调用保存方法
    model.$DictAttr(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1001', '新增字典属性时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增字典属性成功。', null, null));
        }
    });
}

/**
 * 批量新增
 * @param data
 * @param cb
 */
exports.saveAllAttr = function(data,cb){
    model.$DictAttr.create(data, function(err, docs) {
        if(err) {
            cb(utils.returnMsg(false, '1006', '批量新增操作时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '批量新增操作成功。', null, null));
        }
    });
}

/**
 * 修改字典信息
 * @param id
 * @param data
 * @param cb
 */
exports.updateDict = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1002', '修改字典时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改字典成功。', null, null));
        }
    });
}

/**
 * 修改字典属性信息
 * @param id
 * @param data
 * @param cb
 */
exports.updateDictAttr = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$DictAttr.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1003', '修改字典属性时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改字典属性成功。', null, null));
        }
    });
}