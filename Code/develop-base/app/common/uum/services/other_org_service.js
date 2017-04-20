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
exports.getOrgList = function(page, size, conditionMap, cb, populate) {
    utils.pagingQuery4Eui(model.$CommonCoreOrgAttachAttr, page, size,conditionMap, cb, populate);
};

function shallowClone(obj){
    var clone = {};
    for(var p in obj){
        if(obj.hasOwnProperty(p)){
            clone[p] = obj[p];
        }
    }
    return clone;
}

function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

exports.getorgAttach = function(cb) {
    //1.按org_id进行分组查询，并按日期进行过滤
    model.$CommonCoreOrgAttachAttr.aggregate(
        [
            {$match : {start_time : {$lte : new Date()},end_time : {$gte : new Date()},status:1}},
            {$group : {_id : "$org_id",org_count :{$sum : 1}}}
        ],
        function(err1,docs1){
            //2.按过滤后的org_id查询相对应的人员总数
            var orgIds = [];
            for(var o in docs1){
                orgIds.push(docs1[o]._id);
            }
            model.$.aggregate(
                [
                    {$match : {user_org : {$in : orgIds}}},
                    {$group : {_id : "$user_org",user_count :{$sum : 1}}}
                ],
                function(err2,docs2){
                    //3.查询扩展机构表的有效数据，按日期进行筛选，并按org_id和机构表进行关联
                    var query = model.$CommonCoreOrgAttachAttr.find({});
                    query.where('$and', [{'start_time': {$lte: new Date()}, 'end_time': {$gte: new Date()}, 'status': 1}]);
                    query.populate('org_id');
                    query.exec(function (err, docs3) {
                        if (err) {
                            cb(exports.returnMsg(false, '1000', '查询时出现异常。', null, err));
                        }else{
                            //4.组装返回的结果数据，数据包含org_id,org_type,attr_items,user_count
                            var result = [];
                            for(var i=0;i<docs1.length;i++){
                                var obj = {};
                                obj.org_id = docs1[i]._id;
                                obj.org_type = "";
                                obj.attr_items = [];
                                for(var j=0;j<docs2.length;j++){
                                    if(JSON.stringify(docs1[i]._id) == JSON.stringify(docs2[j]._id)){
                                        obj.user_count = docs2[j].user_count;
                                    }
                                }
                                result.push(obj);
                            }
                            for(var i=0;i<result.length;i++){
                                for(var j=0;j<docs3.length;j++){
                                    if(JSON.stringify(result[i].org_id) == JSON.stringify(docs3[j]._doc.org_id._doc._id)){
                                        result[i].org_type = docs3[j]._doc.org_id._doc.org_type;
                                        for(var k=0;k<docs3[j]._doc.attr_items.length;k++){
                                            result[i].attr_items.push(docs3[j]._doc.attr_items[k]);
                                        }
                                    }
                                }
                            }
                            cb(result);
                        }
                    });
                }
            );
        }
    );
};

exports.saveOtherOrg = function(tempEntity, cb) {
    var conditions = {};
    conditions.org_id = tempEntity.org_id;
    conditions.start_time = tempEntity.start_time;
    conditions.end_time = tempEntity.end_time;
    model.$CommonCoreOrgAttachAttr.find(conditions, function(err1,rs1){
        if (err1) {
            cb(utils.returnMsg(false, '1000', '添加信息时出现异常。', null, error));
        }else {
            if(rs1.length >= 1){
                model.$CommonCoreOrgAttachAttr.update(conditions,{$addToSet:{attr_items:{$each:tempEntity.attr_items}}},function(err2,rs2){
                    if(err2){
                        cb(utils.returnMsg(false, '1000', '添加信息时出现异常。', null, err2));
                    }else{
                        cb(utils.returnMsg(true, '0000', '添加信息成功。', null, null));
                    }
                });
            }else{
                // 实例模型，调用保存方法
                model.$CommonCoreOrgAttachAttr(tempEntity).save(function(error) {
                    if (error) {
                        cb(utils.returnMsg(false, '1000', '添加信息时出现异常。', null, error));
                    }
                    else {
                        cb(utils.returnMsg(true, '0000', '添加信息成功。', null, null));
                    }
                });
            }
        }
    });
};

exports.getOtherOrgInfo = function(id, fields, cb) {
    var query = model.$CommonCoreOrgAttachAttr.find({});
    query.where('_id', id);
    query.populate('org_id');
    query.exec(function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1000', '查询详情出现异常。', null, err));
        }else{
            cb(utils.returnMsg(true, '0000', '查询详情成功。', rs, null));
        }
    });
};

exports.updateOrg = function(conditions, update, cb) {
    var options = {};
    model.$CommonCoreOrgAttachAttr.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改信息成功。', null, null));
        }
    });
};

exports.deleteOtherOrg = function(conditions, cb) {
    model.$CommonCoreOrgAttachAttr.update(conditions,{$set:{status:0}},{},function(err,rs){
        if(err){
            cb(utils.returnMsg(false, '1000', '删除信息时出现异常。', null, error));
        }else{
            cb(utils.returnMsg(true, '0000', '删除信息成功。', null, null));
        }
    });
    /*if(rs[0]._doc.attr_items.length > 1){
     model.$CommonCoreOrgAttachAttr.update(conditions,{$pull:{attr_items:areacode}},function(err2,rs2){
     if(err2){
     cb(utils.returnMsg(false, '1000', '删除信息时出现异常。', null, err2));
     }else{
     cb(utils.returnMsg(true, '0000', '删除信息成功。', null, null));
     }
     })
     }else{
     model.$CommonCoreOrgAttachAttr.remove(conditions, function (err3) {
     if (err3) {
     cb(utils.returnMsg(false, '1000', '删除信息时出现异常。', null, err3));
     }
     else {
     cb(utils.returnMsg(true, '0000', '删除信息成功。', null, null));
     }
     });
     }*/
};