var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var appApiService = require('../services/app_api_service');

router.route('/')
    // 分页查询接口定义
    .get(function(req,res){
        // 分页条件
        var filter_name = req.query.filter_name;
        var filter_type = req.query.filter_type;

        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(filter_name){
            conditionMap['$or'] = [{'api_code':new RegExp(filter_name)},{'api_name':new RegExp(filter_name)},{'api_service_name':new RegExp(filter_name)},{'api_service_method':new RegExp(filter_name)}];
        }
        if(filter_type) {
            conditionMap.api_type = filter_type;
        }
        appApiService.getAppApiDefineList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })
    .post(function(req, res){

        var api_type = req.param("api_type");
        var api_code = req.param("api_code");
        var api_name = req.param("api_name");
        var api_auth_access = req.param("api_auth_access");
        var api_logging = req.param("api_logging");
        var api_is_demo = req.param("api_is_demo");
        var api_demo_result = req.param("api_demo_result");
        var api_service_name = req.param("api_service_name");
        var api_service_method = req.param("api_service_method");
        var api_remark = req.param("api_remark");
        var api_status = req.param("api_status");
        var api_repeat_access = req.param("api_repeat_access");
        var api_expdt_set = req.param("api_expdt_set");
        var api_expdt_start = req.param("api_expdt_start");
        var api_expdt_end = req.param("api_expdt_end");
        var api_enable_cache = req.param("api_enable_cache");
        var api_cache_type = req.param("api_cache_type");
        var api_cache_key = req.param("api_cache_key");
        var api_cache_expire = req.param("api_cache_expire");

        if(!api_type) {
            utils.respMsg(res, false, '2001', '分类不能为空。', null, null);
            return;
        }
        if(!api_code) {
            utils.respMsg(res, false, '2002', '接口名不能为空。', null, null);
            return;
        }
        if(!api_name) {
            utils.respMsg(res, false, '2003', '接口描述不能为空。', null, null);
            return;
        }
        if(!api_service_name) {
            utils.respMsg(res, false, '2004', '服务名不能为空。', null, null);
            return;
        }
        if(!api_service_method) {
            utils.respMsg(res, false, '2005', '方法名不能为空。', null, null);
            return;
        }
        if(!api_is_demo) {
            utils.respMsg(res, false, '2006', '是否为模拟接口不能为空。', null, null);
            return;
        }
        else {
            if(api_is_demo == 1) {
                if(!api_demo_result) {
                    utils.respMsg(res, false, '2007', '模拟数据不能为空。', null, null);
                    return;
                }
            }
        }
        if(!api_auth_access) {
            utils.respMsg(res, false, '2008', '是否允许匿名调用不能为空。', null, null);
            return;
        }
        if(!api_logging) {
            utils.respMsg(res, false, '2009', '是否开启日志记录不能为空。', null, null);
            return;
        }
        if(!api_repeat_access) {
            utils.respMsg(res, false, '2010', '是否允许重复访问不能为空。', null, null);
            return;
        }
        if(!api_status) {
            utils.respMsg(res, false, '2011', '状态不能为空。', null, null);
            return;
        }
        if(!api_expdt_set) {
            utils.respMsg(res, false, '2012', '是否限期访问不能为空。', null, null);
            return;
        }
        else {
            if(api_expdt_set == 1) {
                if(!api_expdt_start && !api_expdt_end) {
                    utils.respMsg(res, false, '2013', '开始和结束时间至少填写一个。', null, null);
                    return;
                }
            }
        }
        // 验证通过组装数据
        var data = {};
        data.api_type = api_type;
        data.api_code = api_code;
        data.api_name = api_name;
        data.api_auth_access = api_auth_access;
        data.api_logging = api_logging;
        data.api_is_demo = api_is_demo;
        data.api_demo_result = api_demo_result;
        data.api_service_name = api_service_name;
        data.api_service_method = api_service_method;
        data.api_remark = api_remark;
        data.api_status = api_status;
        data.api_repeat_access = api_repeat_access;
        data.api_expdt_set = api_expdt_set;
        data.api_expdt_start = api_expdt_start;
        data.api_expdt_end = api_expdt_end;
        /*data.api_enable_cache = api_enable_cache;
        data.api_cache_type = api_cache_type;
        data.api_cache_key = api_cache_key;
        data.api_cache_expire = api_cache_expire;*/

        appApiService.saveAppApiDefine(data, function(result) {
            utils.respJsonData(res, result);
        });
    });

router.route('/:id')
    .put(function(req, res){
        var id = req.param("id");
        var api_type = req.param("api_type");
        var api_code = req.param("api_code");
        var api_name = req.param("api_name");
        var api_auth_access = req.param("api_auth_access");
        var api_logging = req.param("api_logging");
        var api_is_demo = req.param("api_is_demo");
        var api_demo_result = req.param("api_demo_result");
        var api_service_name = req.param("api_service_name");
        var api_service_method = req.param("api_service_method");
        var api_remark = req.param("api_remark");
        var api_status = req.param("api_status");
        var api_repeat_access = req.param("api_repeat_access");
        var api_expdt_set = req.param("api_expdt_set");
        var api_expdt_start = req.param("api_expdt_start");
        var api_expdt_end = req.param("api_expdt_end");
        var api_enable_cache = req.param("api_enable_cache");
        var api_cache_type = req.param("api_cache_type");
        var api_cache_key = req.param("api_cache_key");
        var api_cache_expire = req.param("api_cache_expire");

        if(!id) {
            utils.respMsg(res, false, '2000', 'ID不能为空。', null, null);
            return;
        }
        if(!api_type) {
            utils.respMsg(res, false, '2001', '分类不能为空。', null, null);
            return;
        }
        if(!api_code) {
            utils.respMsg(res, false, '2002', '接口名不能为空。', null, null);
            return;
        }
        if(!api_name) {
            utils.respMsg(res, false, '2003', '接口描述不能为空。', null, null);
            return;
        }
        if(!api_service_name) {
            utils.respMsg(res, false, '2004', '服务名不能为空。', null, null);
            return;
        }
        if(!api_service_method) {
            utils.respMsg(res, false, '2005', '方法名不能为空。', null, null);
            return;
        }
        if(!api_is_demo) {
            utils.respMsg(res, false, '2006', '是否为模拟接口不能为空。', null, null);
            return;
        }
        else {
            if(api_is_demo == 1) {
                if(!api_demo_result) {
                    utils.respMsg(res, false, '2007', '模拟数据不能为空。', null, null);
                    return;
                }
            }
        }
        if(!api_auth_access) {
            utils.respMsg(res, false, '2008', '是否允许匿名调用不能为空。', null, null);
            return;
        }
        if(!api_logging) {
            utils.respMsg(res, false, '2009', '是否开启日志记录不能为空。', null, null);
            return;
        }
        if(!api_repeat_access) {
            utils.respMsg(res, false, '2010', '是否允许重复访问不能为空。', null, null);
            return;
        }
        if(!api_status) {
            utils.respMsg(res, false, '2011', '状态不能为空。', null, null);
            return;
        }
        if(!api_expdt_set) {
            utils.respMsg(res, false, '2012', '是否限期访问不能为空。', null, null);
            return;
        }
        else {
            if(api_expdt_set == 1) {
                if(!api_expdt_start && !api_expdt_end) {
                    utils.respMsg(res, false, '2013', '开始和结束时间至少填写一个。', null, null);
                    return;
                }
            }
        }
        // 验证通过组装数据
        var data = {};
        data.api_type = api_type;
        data.api_code = api_code;
        data.api_name = api_name;
        data.api_auth_access = api_auth_access;
        data.api_logging = api_logging;
        data.api_is_demo = api_is_demo;
        data.api_demo_result = api_demo_result;
        data.api_service_name = api_service_name;
        data.api_service_method = api_service_method;
        data.api_remark = api_remark;
        data.api_status = api_status;
        data.api_repeat_access = api_repeat_access;
        data.api_expdt_set = api_expdt_set;
        data.api_expdt_start = api_expdt_start;
        data.api_expdt_end = api_expdt_end;
        /*data.api_enable_cache = api_enable_cache;
        data.api_cache_type = api_cache_type;
        data.api_cache_key = api_cache_key;
        data.api_cache_expire = api_cache_expire;*/

        appApiService.updateAppApiDefine(id, data, function(result) {
            utils.respJsonData(res, result);
        });
    });

router.route('/sync')
    .get(function(req, res){

    });

module.exports = router;