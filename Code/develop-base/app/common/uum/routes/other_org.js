/**
 * Created by zhaojing on 2016/6/03.
 */

var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var service = require('../services/other_org_service');
var orgService = require('../services/org_service');
var config = require('../../../../config');
var userModel = require('../../core/models/user_model');

router.route('/')

    // -------------------------------query查询列表-------------------------------
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;

        var start_time;
        var end_time;
        var contract_term = req.query.contract_term;
        if(contract_term){
            var term = contract_term.split('~');
            start_time = term[0];
            end_time = term[1];
        }
        var orgType;
        if(req.query.orgType){
            orgType = req.query.orgType;
        }
        var areaCode;
        if(req.query.areaCode){
            areaCode = req.query.areaCode.substring(orgType.length);
        }
        var criteria = {};
        if(orgType){
            criteria.org_type = orgType; // 查询条件
        }
        var fields = {_id:1, org_code: 1, org_name: 1, org_fullname: 1, org_type: 1}; // 待返回的字段
        orgService.getOrg(criteria, fields,function(result){
            var conditionMap = {};
            var orgIdArray = [];
            for(var i=0;i<result.data.length;i++){
                orgIdArray.push(result.data[i]._doc._id);
            }
            conditionMap.org_id = {'$in':orgIdArray};
            if(start_time && end_time){
                conditionMap['$or'] = [{'start_time':{$gte: start_time, $lt: end_time}},{'end_time':{$gte: start_time, $lt: end_time}}];
            }else{
                conditionMap['$and'] = [{'start_time':{$lt: new Date()}},{'end_time':{$gte: new Date()}}];
            }
            if(areaCode){
                conditionMap.attr_items = areaCode;
            }
            conditionMap.status = 1;
            service.getOrgList(page, size, conditionMap, function(result){
                for(var i=0;i<result.rows.length;i++){
                    result.rows[i]._doc.org_code = result.rows[i]._doc.org_id._doc.org_code;
                    result.rows[i]._doc.org_name = result.rows[i]._doc.org_id._doc.org_name;
                    result.rows[i]._doc.org_fullname = result.rows[i]._doc.org_id._doc.org_fullname;
                }
                utils.respJsonData(res, result);
            },'org_id');
        });
    })

    // -------------------------------create添加-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var org_id = req.body.org_id;//机构ID
        var start_time;
        var end_time;
        var contract_term = req.body.contract_term;
        if(contract_term){
            var term = contract_term.split('~');
            start_time = term[0];
            end_time = term[1];
        }
        var attr_items = req.body.attr_items.split("#");//区域数组

        // 验证机构ID是否为空
        if(!org_id) {
            utils.respMsg(res, false, '2001', '机构不能为空。', null, null);
        }
        // 验证起止日期是否为空
        if(!contract_term) {
            utils.respMsg(res, false, '2002', '起止日期不能为空。', null, null);
        }
        // 验证区域数组是否为空
        if(attr_items.length < 0) {
            utils.respMsg(res, false, '2003', '区域不能为空。', null, null);
        }

        //构造保存参数
        var other_orgEntity = {};
        other_orgEntity.org_id = org_id;
        other_orgEntity.start_time = start_time;
        other_orgEntity.end_time = end_time;
        other_orgEntity.attr_items = attr_items;
        other_orgEntity.status = 1;
        // 实例模型，调用保存方法
        service.saveOtherOrg(other_orgEntity, function(result){
            utils.respJsonData(res, result);
        });
    })

router.route('/getOrgInfo/')
    // -------------------------------获取机构信息-------------------------------
    .get(function(req, res){
        var orgType = req.query.orgType;

        var fields = {_id:1, org_name: 1,org_fullname:1, org_pid: 1}; // 待返回的字段
        var options = {sort: {'org_pid': 1, 'org_order': 1}};
        userModel.$CommonCoreOrg.find({org_type:orgType,org_status:1},fields, options, function(error, result) {
            if(error) {
                utils.respJsonData(res, new Array());
            }
            else {
                utils.respJsonData(res, result);
            }
        });
    });

router.route('/getorgAttach/')
    // -------------------------------获取统计信息-------------------------------
    .get(function(req, res){
        service.getorgAttach(function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/:id')
    // -------------------------------delete删除-------------------------------
    .delete(function(req,res){
        // 获取提交信息
        var _id = req.params.id;//ID

        // 验证ID是否为空
        if(!_id) {
            utils.respMsg(res, false, '2005', 'ID不能为空。', null, null);
        }
        var conditionMap = {};
        conditionMap._id = _id;
        service.deleteOtherOrg(conditionMap,function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------get获取详情-------------------------------
    .get(function(req,res){
        var id = req.params.id;
        if (!id) {
            utils.respMsg(res, false, '1009', 'id不能为空。', null, null);
        }
        var fields = {_id:0, org_id: 1, start_time: 1, end_time: 1, attr_items: 1, status: 1}; // 待返回的字段
        service.getOtherOrgInfo(id,fields,function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------update修改-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//id
        var org_id = req.body.org_id;//机构ID
        var start_time;
        var end_time;
        var contract_term = req.body.contract_term;
        if(contract_term){
            var term = contract_term.split('~');
            start_time = term[0];
            end_time = term[1];
        }
        var attr_items = req.body.attr_items.split("#");//区域数组

        // 验证机构ID是否为空
        if(!org_id) {
            utils.respMsg(res, false, '2001', '机构不能为空。', null, null);
        }
        // 验证起止日期是否为空
        if(!contract_term) {
            utils.respMsg(res, false, '2002', '起止日期不能为空。', null, null);
        }
        // 验证区域数组是否为空
        if(attr_items.length < 0) {
            utils.respMsg(res, false, '2003', '区域不能为空。', null, null);
        }

        //构造保存参数
        var other_orgEntity = {};
        other_orgEntity.org_id = org_id;
        other_orgEntity.start_time = start_time;
        other_orgEntity.end_time = end_time;
        other_orgEntity.attr_items = attr_items;

        var conditions = {_id: id};
        var update = {$set: other_orgEntity};
        service.updateOrg(conditions,update,function(result){
            utils.respJsonData(res, result);
        });
    })

module.exports = router;