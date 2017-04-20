/**
 * Created by ShiHukui on 2016/2/19.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../../common/core/utils/app_utils');
var userService = require('../services/user_service');

router.route('/')
    .get(function(req,res){
        // 分页条件
        var filter_name = req.query.filter_name;
        var filter_sys = req.query.filter_sys;
        var filter_org = req.query.filter_org;
        var filter_tel = req.query.filter_tel;

        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(filter_name){
            conditionMap['$or'] = [{'login_account':new RegExp(filter_name)},{'user_name':new RegExp(filter_name)}];
        }
        if(filter_sys) {
            conditionMap.user_sys = filter_sys;
        }
        if(filter_org && filter_org != 0) {
            conditionMap.user_org = filter_org;
        }
        if(filter_tel) {
            conditionMap.user_tel = filter_tel;
        }

        // 调用分页
        userService.getUserList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })

    .post(function(req,res){
        // 获取提交信息
        var login_account = req.body.login_account;
        var user_no = req.body.user_no;
        var user_name = req.body.user_name;
        var user_gender = req.body.user_gender;
        var user_phone = req.body.user_phone;
        var user_email = req.body.user_email;
        var user_status = req.body.user_status;
        var user_org = req.body.user_org;
        var user_sys = req.body.user_sys;
        // 数组特殊处理
        var user_role = req.body.user_roles ? [req.body.user_roles] : req.body['user_roles[]'];

        // 验证
        if(!login_account) {
            utils.respMsg(res, false, '2001', '登录账号不能为空。', null, null);
        }
        if(!user_sys) {
            utils.respMsg(res, false, '2002', '归属系统不能为空。', null, null);
        }
        if(!user_status) {
            utils.respMsg(res, false, '2003', '状态不能为空。', null, null);
        }
        if(!user_role) {
            utils.respMsg(res, false, '2004', '拥有角色不能为空。', null, null);
        }
        if(!user_no) {
            utils.respMsg(res, false, '2005', '用户编号不能为空。', null, null);
        }
        if(!user_name) {
            utils.respMsg(res, false, '2006', '用户姓名不能为空。', null, null);
        }
        if(!user_org) {
            utils.respMsg(res, false, '2007', '所在机构/部门不能为空。', null, null);
        }
        if(!user_gender) {
            utils.respMsg(res, false, '2008', '所在机构/部门不能为空。', null, null);
        }
        // 验证通过组装数据
        var data = {};
        data.login_account = login_account;
        data.user_status = parseInt(user_status);
        data.user_no = user_no;
        data.user_name = user_name;
        data.user_gender = parseInt(user_gender);
        data.user_roles = new Array();
        if(user_phone){
            data.user_phone = user_phone;
        }
        if(user_email){
            data.user_email = user_email;
        }
        userService.saveUser(data, user_sys, user_role, user_org, function(result) {
            utils.respJsonData(res, result);
        });
    });

/**
 * 获取角色数据
 */
router.route('/getRoleData/:sysid')
    .get(function(req,res){
        var sysid = req.params.sysid;
        if(sysid) {
            userService.getRoleBySys(sysid, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respJsonData(res, new Array());
        }
    });

/**
 * 获取角色数据
 */
router.route('/resetpwd/:id')
    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            userService.resetPwd(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '2000', '用户ID不能为空。', null, null);
        }
    });

router.route('/:id')
    .put(function(req,res){

        // 获取提交信息
        var id = req.params.id;
        var login_account = req.body.login_account;
        var user_no = req.body.user_no;
        var user_name = req.body.user_name;
        var user_gender = req.body.user_gender;
        var user_phone = req.body.user_phone;
        var user_email = req.body.user_email;
        var user_status = req.body.user_status;
        var user_org = req.body.user_org;
        var user_sys = req.body.user_sys;
        // 数组特殊处理
        var user_role = req.body.user_roles ? [req.body.user_roles] : req.body['user_roles[]'];

        // 验证
        if(!id) {
            utils.respMsg(res, false, '2000', 'ID不能为空。', null, null);
        }
        if(!login_account) {
            utils.respMsg(res, false, '2001', '登录账号不能为空。', null, null);
        }
        if(!user_sys) {
            utils.respMsg(res, false, '2002', '归属系统不能为空。', null, null);
        }
        if(!user_status) {
            utils.respMsg(res, false, '2003', '状态不能为空。', null, null);
        }
        if(!user_role) {
            utils.respMsg(res, false, '2004', '拥有角色不能为空。', null, null);
        }
        if(!user_no) {
            utils.respMsg(res, false, '2005', '用户编号不能为空。', null, null);
        }
        if(!user_name) {
            utils.respMsg(res, false, '2006', '用户姓名不能为空。', null, null);
        }
        if(!user_org) {
            utils.respMsg(res, false, '2007', '所在机构/部门不能为空。', null, null);
        }
        if(!user_gender) {
            utils.respMsg(res, false, '2008', '所在机构/部门不能为空。', null, null);
        }
        // 验证通过组装数据
        var data = {};
        data.login_account = login_account;
        data.user_status = parseInt(user_status);
        data.user_no = user_no;
        data.user_name = user_name;
        data.user_gender = parseInt(user_gender);
        data.user_roles = new Array();
        if(user_phone){
            data.user_phone = user_phone;
        }
        if(user_email){
            data.user_email = user_email;
        }
        userService.updateUser(id, data, user_sys, user_role, user_org, function(result) {
            utils.respJsonData(res, result);
        });
    })

    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            userService.getUser(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '2000', '用户ID不能为空。', null, null);
        }
    });

module.exports = router;

