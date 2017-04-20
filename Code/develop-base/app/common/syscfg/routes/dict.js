/**
 * Created by zhaojing on 2016/3/30.
 */

var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var tree = require('../../../common/core/utils/tree_utils');
var dictService = require('../services/dict_service');
var coreService = require('../../core/services/core_service');

router.route('/')

    // -------------------------------query查询字典列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var dict_name = req.query.dict_name;
        var dict_status = req.query.dict_status;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        if(dict_name){
            conditionMap['$or'] = [{'dict_code':new RegExp(dict_name)},{'dict_name':new RegExp(dict_name)}];
        }
        if(dict_status && dict_status != -1){
            conditionMap.dict_status = parseInt(dict_status);
        }
        // 调用分页
        dictService.getDictList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------create添加字典-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var dict_name = req.body.dict_name;//字典名
        var dict_code = req.body.dict_code;//字典编码
        var dict_status = req.body.dict_status;//字典状态
        var dict_remark = req.body.dict_remark;//字典描述

        // 验证字典名是否为空
        if(!dict_name) {
            utils.respMsg(res, false, '2001', '字典名不能为空。', null, null);
            return;
        }
        // 验证字典编码是否为空
        if(!dict_code) {
            utils.respMsg(res, false, '2002', '字典编码不能为空。', null, null);
            return;
        }
        // 验证字典状态是否为空
        if(!dict_status) {
            utils.respMsg(res, false, '2003', '字典状态不能为空。', null, null);
            return;
        }

        dictService.checkCode(1,dict_code, function (result) {
            if(result.success){
                //构造字典保存参数
                var dictEntity = {};
                dictEntity.dict_name = dict_name;
                dictEntity.dict_code = dict_code;
                dictEntity.dict_status = dict_status;
                if(dict_remark){
                    dictEntity.dict_remark = dict_remark;
                }

                // 调用业务层保存方法
                dictService.saveDict(dictEntity, function(result){
                    utils.respJsonData(res, result);
                });
            }else{
                utils.respJsonData(res, result);
            }
        });
    });
router.route('/dictAttrByCombotree/:id')

    // -------------------------------query查询字典属性列表-------------------------------
    .get(function(req,res){
        var id = req.params.id;//字典id
        var conditionMap = {};
        conditionMap.dict_id = id;
        dictService.getDictAttrListByCombotree(conditionMap,function(result){
            var dictAttrArray = new Array();
            result.forEach(function (dictArrt) {
                var dictArrtObj = {};
                dictArrtObj['id'] = dictArrt._id;
                dictArrtObj['dict_id'] = dictArrt.dict_id;
                dictArrtObj['field_code'] = dictArrt.field_code;
                dictArrtObj['text'] = dictArrt.field_name;
                dictArrtObj['field_value'] = dictArrt.field_value;
                dictArrtObj['field_status'] = dictArrt.field_status;
                dictArrtObj['field_remark'] = dictArrt.field_remark;
                dictArrtObj['field_parent_id'] = dictArrt.field_parent_id;
                dictArrtObj['field_parent_value'] = dictArrt.field_parent_value;
                dictArrtObj['field_checked'] = dictArrt.field_checked;
                dictArrtObj['field_order'] = dictArrt.field_order;

                dictAttrArray.push(dictArrtObj);
            });
            utils.respJsonData(res, tree.transData(dictAttrArray, "id", "field_parent_id", "children"));
        });
    })

router.route('/dictAttr')

    // -------------------------------query查询字典属性列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var dict_id = req.query.dict_id;
        var field_name = req.query.field_name;
        var field_status = req.query.field_status;

        var conditionMap = {};
        conditionMap.dict_id = dict_id;
        if(field_name){
            conditionMap['$or'] = [{'field_code':new RegExp(field_name)},{'field_name':new RegExp(field_name)}];
        }
        if(field_status && field_status != -1){
            conditionMap.field_status = parseInt(field_status);
        }
        // 调用分页
        dictService.getDictAttrList(conditionMap, "field_order", function(result){
            var dictArray = new Array();
            result.forEach(function (dict) {
                var dictObj = {};
                dictObj['_id'] = dict._id;
                dictObj['field_name'] = dict.field_name;
                dictObj['field_parent_id'] = dict.field_parent_id;
                dictObj['field_parent_value'] = dict.field_parent_value;
                dictObj['field_code'] = dict.field_code;
                dictObj['field_value'] = dict.field_value;
                dictObj['field_status'] = dict.field_status;
                dictObj['field_checked'] = dict.field_checked;
                dictObj['field_order'] = dict.field_order;
                dictObj['field_remark'] = dict.field_remark;

                dictArray.push(dictObj);
            });
            utils.respJsonData(res, tree.transData(dictArray, "_id", "field_parent_id", "children"));
        });
    })

    // -------------------------------create添加字典属性-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var dict_id = req.body.dict_id;//字典ID
        //var field_code = req.body.field_code;//字段编码
        var field_name = req.body.field_name;//字段名
        var field_value = req.body.field_value;//字段值
        var field_status = req.body.field_status;//字段状态
        var field_remark = req.body.field_remark;//字段描述
        var field_parent_id = req.body.field_parent_id;//父节点ID
        var field_parent_value = req.body.field_parent_value;//父节点值
        var field_checked = req.body.field_checked;//默认选中(1:是；0:否)
        var field_order = req.body.field_order;//字典序号

        // 验证字典ID是否为空
        if(!dict_id) {
            utils.respMsg(res, false, '2004', '字典ID不能为空。', null, null);
            return;
        }
        // 验证字段编码是否为空
        /*if(!field_code) {
            utils.respMsg(res, false, '2005', '字段编码不能为空。', null, null);
            return;
        }*/
        // 验证字段名是否为空
        if(!field_name) {
            utils.respMsg(res, false, '2006', '字段名不能为空。', null, null);
            return;
        }
        // 验证字段值是否为空
        if(!field_value) {
            utils.respMsg(res, false, '2007', '字段值不能为空。', null, null);
            return;
        }
        // 验证字段状态是否为空
        if(!field_status) {
            utils.respMsg(res, false, '2008', '字段状态不能为空。', null, null);
            return;
        }


        /*dictService.checkCode(2,field_code, function (result) {
            if(result.success){*/
        //构造字典保存参数
        var dictAttrEntity = {};
        dictAttrEntity.dict_id = dict_id;
        //dictAttrEntity.field_code = field_code;
        dictAttrEntity.field_name = field_name;
        dictAttrEntity.field_value = field_value;
        dictAttrEntity.field_status = field_status;
        dictAttrEntity.field_checked = field_checked;
        dictAttrEntity.field_order = field_order;
        if(field_remark){
            dictAttrEntity.field_remark = field_remark;
        }
        if(field_parent_id) {
            dictAttrEntity.field_parent_id = field_parent_id;
        }
        if(field_parent_value) {
            dictAttrEntity.field_parent_value = field_parent_value;
        }
        // 调用业务层保存方法
        dictService.saveDictAttr(dictAttrEntity, function(result){
            utils.respJsonData(res, result);
        });
            /*}else{
                utils.respJsonData(res, result);
            }
        });*/
    });

function isRepeat(arr){
    var hash = {};
    for(var i in arr) {
        if(hash[arr[i]]){
            return true;
        }else {
            hash[arr[i]] = true;
        }
    }
    return false;
}

router.route('/dictAndAttr')

    // -------------------------------create添加字典以及属性-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var dict_name = req.body.dict_name;//字典名
        var dict_code = req.body.dict_code;//字典编码
        var dict_status = 1;//req.body.dict_status;//字典状态
        var dict_remark = '';req.body.dict_remark;//字典描述

        //var field_code = req.body['field_code[]'];//字段编码
        var field_name = req.body.field_name ? [req.body.field_name] : req.body['field_name[]'];//字段名
        var field_value = req.body.field_value ? [req.body.field_value] : req.body['field_value[]'];//字段值
        //var field_checked = 0;req.body['field_checked[]'];//默认选中(1:是；0:否)
        var field_order = req.body.field_order ? [req.body.field_order] : req.body['field_order[]'];//字典序号
        //var field_status = 1;//req.body['field_status[]'];//字段状态

        // 验证字典名是否为空
        if(!dict_name) {
            utils.respMsg(res, false, '2001', '字典名不能为空。', null, null);
            return;
        }
        // 验证字典编码是否为空
        if(!dict_code) {
            utils.respMsg(res, false, '2002', '字典编码不能为空。', null, null);
            return;
        }
        // 验证字典状态是否为空
        /*if(!dict_status) {
            utils.respMsg(res, false, '2003', '字典状态不能为空。', null, null);
            return;
        }
        // 验证字段编码是否为空
        if(!field_code) {
            utils.respMsg(res, false, '2005', '字段编码不能为空。', null, null);
            return;
        }
        //验证字段编码数组是否存在重复数据
        var temp = isRepeat(field_code);
        if(temp){
            utils.respMsg(res, false, '2016', '字段编码存在重复。', null, null);
            return;
        }*/
        // 验证字段名是否为空
        if(!field_name) {
            utils.respMsg(res, false, '2006', '属性名称不能为空。', null, null);
            return;
        }
        // 验证字段值是否为空
        if(!field_value) {
            utils.respMsg(res, false, '2007', '属性值不能为空。', null, null);
            return;
        }
        /*// 验证字段状态是否为空*/
        if(!field_order) {
            utils.respMsg(res, false, '2008', '排序号不能为空。', null, null);
            return;
        }

        dictService.checkCode(1,dict_code, function (result) {
            if(result.success){
                /*dictService.checkCode(5,field_code,function(result){
                    if(result.success){*/
                //构造字典保存参数
                var dictEntity = {};
                dictEntity.dict_name = dict_name;
                dictEntity.dict_code = dict_code;
                dictEntity.dict_status = dict_status;
                if(dict_remark){
                    dictEntity.dict_remark = dict_remark;
                }
                // 调用业务层保存方法
                dictService.saveDictAndReturnId(dictEntity, function(result){
                    if(result.success){
                        var dictId = result.id;
                        var attrs = new Array();
                        for(var i = 0; i < field_name.length; i++){
                            var dictAttrEntity = {};
                            dictAttrEntity.dict_id = dictId;
                            //dictAttrEntity.field_code = field_code[i];
                            dictAttrEntity.field_name = field_name[i];
                            dictAttrEntity.field_value = field_value[i];
                            dictAttrEntity.field_checked = 0;//field_checked[i];
                            dictAttrEntity.field_order = field_order[i];
                            dictAttrEntity.field_status = 1;//field_status[i];
                            attrs.push(dictAttrEntity);
                        }
                        dictService.saveAllAttr(attrs,function(result){
                            utils.respJsonData(res, result);
                        });
                    }else{
                        utils.respJsonData(res, result);
                    }
                });
                   /* }else{
                        utils.respJsonData(res, result);
                    }
                });*/
            }else{
                utils.respJsonData(res, result);
            }
        });
    });

router.route('/:id')
    // -------------------------------update修改字典-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//字典id
        var dict_name = req.body.dict_name;//字典名
        var dict_code = req.body.dict_code;//字典编码
        var dict_status = req.body.dict_status;//字典状态
        var dict_remark = req.body.dict_remark;//字典描述

        // 验证字典名是否为空
        if(!dict_name) {
            utils.respMsg(res, false, '2009', '字典名不能为空。', null, null);
            return;
        }
        // 验证字典编码是否为空
        if(!dict_code) {
            utils.respMsg(res, false, '2010', '字典编码不能为空。', null, null);
            return;
        }
        // 验证字典状态是否为空
        if(!dict_status) {
            utils.respMsg(res, false, '2011', '字典状态不能为空。', null, null);
            return;
        }

        dictService.checkCode(3,dict_code, function (result) {
            if(result.success){
                var dictEntity = {};
                dictEntity.dict_name = dict_name;
                dictEntity.dict_code = dict_code;
                dictEntity.dict_status = dict_status;
                if(dict_remark){
                    dictEntity.dict_remark = dict_remark;
                }
                // 调用修改方法
                dictService.updateDict(id, dictEntity, function(result) {
                    utils.respJsonData(res, result);
                });
            }else{
                utils.respJsonData(res, result);
            }
        },id);
    });

router.route('/dictAttr/:id')
    // -------------------------------update修改字典属性-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//字典属性id
        var dict_id = req.body.dict_id;//字典id
        //var field_code = req.body.field_code;//字段编码
        var field_name = req.body.field_name;//字段名
        var field_value = req.body.field_value;//字段值
        var field_status = req.body.field_status;//字段状态
        var field_remark = req.body.field_remark;//字段描述
        var field_parent_id = req.body.field_parent_id;//父节点ID
        var field_parent_value = req.body.field_parent_value;//父节点值
        var field_checked = req.body.field_checked;//默认选中(1:是；0:否)
        var field_order = req.body.field_order;//字典序号

        // 验证字典id是否为空
        if(!dict_id) {
            utils.respMsg(res, false, '2012', '字典id不能为空。', null, null);
            return;
        }
        // 验证字段编码是否为空
        /*if(!field_code) {
            utils.respMsg(res, false, '2013', '字段编码不能为空。', null, null);
            return;
        }*/
        // 验证字段名是否为空
        if(!field_name) {
            utils.respMsg(res, false, '2013', '字段名不能为空。', null, null);
            return;
        }
        // 验证字段值是否为空
        if(!field_value) {
            utils.respMsg(res, false, '2014', '字段值不能为空。', null, null);
            return;
        }
        // 验证字段状态是否为空
        if(!field_status) {
            utils.respMsg(res, false, '2015', '字段状态不能为空。', null, null);
            return;
        }

        /*dictService.checkCode(4,field_code, function (result) {
            if(result.success){*/
        var dictAttrEntity = {};
        dictAttrEntity.dict_id = dict_id;
        //dictAttrEntity.field_code = field_code;
        dictAttrEntity.field_name = field_name;
        dictAttrEntity.field_value = field_value;
        dictAttrEntity.field_status = field_status;
        dictAttrEntity.field_checked = field_checked;
        dictAttrEntity.field_order = field_order;
        if(field_remark){
            dictAttrEntity.field_remark = field_remark;
        }
        if(field_parent_id){
            dictAttrEntity.field_parent_id = field_parent_id;
        }
        if(field_parent_value){
            dictAttrEntity.field_parent_value = field_parent_value;
        }
        // 调用修改方法
        dictService.updateDictAttr(id, dictAttrEntity, function(result) {
            utils.respJsonData(res, result);
        });
            /*}else{
                utils.respJsonData(res, result);
            }
        },id);*/
    });

router.route('/updateNow')
// -------------------------------同步字典-------------------------------
    .get(function(req,res){
        coreService.saveDictInCache(function(err,result){
            utils.respJsonData(res, result);
        });
    });
module.exports = router;