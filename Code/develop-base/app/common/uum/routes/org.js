/**
 * Created by zhaojing on 2016/3/09.
 */

var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var service = require('../services/org_service');
var config = require('../../../../config');
router.route('/')

    // -------------------------------query查询列表-------------------------------
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;

        var org_name = req.query.opt_name;
        var org_pid = req.query.org_pid;

        var conditionMap = {};
        // or 查询
        if(org_name){
            conditionMap['$or'] = [{'org_code':new RegExp(org_name)},{'org_name':new RegExp(org_name)}];
        }
        if(org_pid) {
            conditionMap.org_pid = org_pid;
        }
        service.getOrgList(page, size, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------create添加-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var orgCode = req.body.org_code;//机构编号
        var orgName = req.body.org_name;//机构名
        var orgFullname = req.body.org_fullname;//机构全名
        var orgOrder = req.body.org_order;//排序号
        var orgType = req.body.org_type;//机构类型
        var orgPid = req.body.org_pid;//机构父节点
        var orgStatus = req.body.org_status;//机构状态
        var orgRemark = req.body.org_remark;//机构描述

        // 验证机构编号是否为空
        if(!orgCode) {
            utils.respMsg(res, false, '2001', '机构编号不能为空。', null, null);
        }
        // 验证机构名是否为空
        if(!orgName) {
            utils.respMsg(res, false, '2002', '机构名不能为空。', null, null);
        }
        // 验证机构全名是否为空
        if(!orgFullname) {
            utils.respMsg(res, false, '2003', '机构全名不能为空。', null, null);
        }
        // 验证排序号是否为空
        if(!orgOrder) {
            utils.respMsg(res, false, '2004', '排序号不能为空。', null, null);
        }
        // 验证机构类型是否为空
        if(!orgType) {
            utils.respMsg(res, false, '2005', '机构类型不能为空。', null, null);
        }
        // 验证机构父节点是否为空
        if(!orgPid) {
            utils.respMsg(res, false, '2006', '机构父节点不能为空。', null, null);
        }
        // 验证机构状态是否为空
        if(!orgStatus) {
            utils.respMsg(res, false, '2007', '机构状态不能为空。', null, null);
        }

        //构造机构保存参数
        var orgEntity = {};
        orgEntity.org_code = orgCode;
        orgEntity.org_name = orgName;
        orgEntity.org_fullname = orgFullname;
        orgEntity.org_order = orgOrder;
        orgEntity.org_type = orgType;
        orgEntity.org_pid = orgPid;
        orgEntity.org_status = orgStatus;
        if(orgRemark){
            orgEntity.org_remark = orgRemark;
        }
        // 实例模型，调用保存方法
        service.saveOrg(orgEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/tree')
    // query查询菜单树
    .get(function(req, res){
        service.getOrgTree(function(result) {
            utils.respJsonData(res, [{id:'0', text:config.datas.tree_org.root_node_name ? config.datas.tree_org.root_node_name : "贵州移动", children:result}]);
        });
    });

router.route('/:id')

    // -------------------------------update修改-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//机构id
        var orgCode = req.body.org_code;//机构编号
        var orgName = req.body.org_name;//机构名
        var orgFullname = req.body.org_fullname;//机构全名
        var orgOrder = req.body.org_order;//排序号
        var orgType = req.body.org_type;//机构类型
        var orgPid = req.body.org_pid;//机构父节点
        var orgStatus = req.body.org_status;//机构状态
        var orgRemark = req.body.org_remark;//机构描述

        // 验证id是否为空
        if (!id) {
            utils.respMsg(res, false, '2001', 'id不能为空。', null, null);
        }
        // 验证机构编号是否为空
        if(!orgCode) {
            utils.respMsg(res, false, '2002', '机构编号不能为空。', null, null);
        }
        // 验证机构名是否为空
        if(!orgName) {
            utils.respMsg(res, false, '2003', '机构名不能为空。', null, null);
        }
        // 验证机构全名是否为空
        if(!orgFullname) {
            utils.respMsg(res, false, '2004', '机构全名不能为空。', null, null);
        }
        // 验证排序号是否为空
        if(!orgOrder) {
            utils.respMsg(res, false, '2005', '排序号不能为空。', null, null);
        }
        // 验证机构类型是否为空
        if(!orgType) {
            utils.respMsg(res, false, '2006', '机构类型不能为空。', null, null);
        }
        // 验证机构父节点是否为空
        if(!orgPid) {
            utils.respMsg(res, false, '2007', '机构父节点不能为空。', null, null);
        }
        // 验证机构状态是否为空
        if(!orgStatus) {
            utils.respMsg(res, false, '2008', '机构状态不能为空。', null, null);
        }

        //构造机构保存参数
        var orgEntity = {};
        orgEntity.org_code = orgCode;
        orgEntity.org_name = orgName;
        orgEntity.org_fullname = orgFullname;
        orgEntity.org_order = orgOrder;
        orgEntity.org_type = orgType;
        orgEntity.org_pid = orgPid;
        orgEntity.org_status = orgStatus;
        if(orgRemark){
            orgEntity.org_remark = orgRemark;
        }

        var conditions = {_id: id};
        var update = {$set: orgEntity};
        service.updateOrg(conditions,update,function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------get获取详情-------------------------------
    .get(function(req,res){
        var id = req.params.id;
        if (!id) {
            utils.respMsg(res, false, '1009', 'id不能为空。', null, null);
        }
        var criteria = {_id: id}; // 查询条件
        var fields = {_id:0, org_code: 1, org_name: 1, org_fullname: 1, org_order: 1, org_type: 1, org_pid: 1, org_status: 1, org_remark: 1}; // 待返回的字段
        var options = {};
        service.getOrg(criteria,fields,function(result){
            utils.respJsonData(res, result);
        });
    });

module.exports = router;