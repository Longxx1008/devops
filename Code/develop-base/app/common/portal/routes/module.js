/**
 * Created by ShiHukui on 2016/2/19.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var service = require('../services/module_service');
var config = require('../../../../config');
/**
 * 组件管理
 */
router.route('/')
    .get(function(req,res){
        // 分页条件
        var module_code = req.query.module_code;
        var module_status = req.query.module_status;
        var sys_id = req.query.sys_id;
        var role_id = req.query.role_id;
        var module_type = req.query.module_type;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;
        var queryCodeOr = new Array();
        var queryRoleOr = new Array();
        var conditionMap = {};
        // or 查询
        if(module_code){
            //conditionMap['$or'] = [{'module_code':new RegExp(module_code)},{'module_title':new RegExp(module_code)}];
            queryCodeOr.push({'module_code':new RegExp(module_code)});
            queryCodeOr.push({'module_title':new RegExp(module_code)});
        }
        if(module_status && module_status != -1){
            conditionMap.module_status = parseInt(module_status);
        }
        if(sys_id){
            conditionMap.sys_id = sys_id;
        }
        if(role_id){// 角色过滤
            //{module_roles:{$elemMatch:{$eq:'56d80e3ca6fbe05a1394ad93'}}}
            //conditionMap.module_roles = {$elemMatch:{$eq:role_id}};
            //conditionMap['$or'] = [{'module_roles':{$elemMatch:{$eq:role_id}}}, {'module_is_public':1}];
            queryRoleOr.push({'module_roles':{$elemMatch:{$eq:role_id}}});
            queryRoleOr.push({'module_is_public':1});
        }
        if(queryCodeOr.length > 0 && queryRoleOr.length > 0) {
            conditionMap['$and'] = [{'$or':queryCodeOr},{'$or':queryRoleOr}];
        }
        else {
            if(queryCodeOr.length > 0) {
                conditionMap['$or'] = queryCodeOr;
            }
            if(queryRoleOr.length > 0) {
                conditionMap['$or'] = queryRoleOr;
            }
        }
        if(module_type){
            conditionMap.module_type = module_type;
        }
        // 调用分页
        service.getModuleList(page, length, conditionMap, null,  function(result){
            utils.respJsonData(res, result);
        });
    })
    .post(function(req,res){

        var sys_id = req.body.sys_id;
        var module_type = req.body.module_type;
        var module_is_public = req.body.module_is_public;
        var role_ids = req.body.role_ids ? [req.body.role_ids] : req.body['role_ids[]'];
        var module_code = req.body.module_code;
        var module_title = req.body.module_title;
        var module_url = req.body.module_url;
        var module_cls = req.body.module_cls;

        var module_body_cls = req.body.module_body_cls;
        var module_icon_cls = req.body.module_icon_cls;

        var module_height = req.body.module_height;
        var module_order = req.body.module_order;
        var module_status = req.body.module_status;
        var module_remark = req.body.module_remark;
        var module_params = req.body.module_params;

        // 验证角色编号是否为空
        if(!sys_id) {
            utils.respMsg(res, false, '2001', '所属系统不能为空。', null, null);
            return;
        }
        if(!module_type) {
            utils.respMsg(res, false, '2002', '组件类型不能为空。', null, null);
            return;
        }
        if(!module_is_public) {
            utils.respMsg(res, false, '2003', '是否为公用组件不能为空。', null, null);
            return;
        }
        else {
            if(module_is_public == 0) {
                if(!role_ids) {
                    utils.respMsg(res, false, '2004', '所属角色不能为空。', null, null);
                    return;
                }
            }
        }
        if(!module_code) {
            utils.respMsg(res, false, '2005', '组件编码不能为空。', null, null);
            return;
        }
        if(!module_title) {
            utils.respMsg(res, false, '2006', '组件标题不能为空。', null, null);
            return;
        }
        if(!module_url) {
            utils.respMsg(res, false, '2007', '组件url不能为空。', null, null);
            return;
        }
        if(!module_cls) {
            utils.respMsg(res, false, '2008', '标题样式不能为空。', null, null);
            return;
        }
        if(!module_body_cls) {
            utils.respMsg(res, false, '2009', '组件边框不能为空。', null, null);
            return;
        }
        if(!module_height) {
            utils.respMsg(res, false, '2010', '组件高度不能为空。', null, null);
            return;
        }
        if(!module_order) {
            utils.respMsg(res, false, '2011', '组件序号不能为空。', null, null);
            return;
        }
        if(!module_status) {
            utils.respMsg(res, false, '2012', '组件状态不能为空。', null, null);
            return;
        }

        //构造角色保存参数
        var entity = {};
        entity.sys_id = sys_id;
        entity.module_type = module_type;
        entity.module_is_public = parseInt(module_is_public);
        if(module_is_public == 0) {
            entity.module_roles = role_ids;
        }
        entity.module_code = module_code;
        entity.module_title = module_title;
        entity.module_url = module_url;
        entity.module_cls = module_cls;

        entity.module_icon_cls = module_icon_cls;
        entity.module_body_cls = module_body_cls

        entity.module_height = parseInt(module_height);
        entity.module_order = parseInt(module_order);
        entity.module_status = parseInt(module_status);

        entity.module_remark = module_remark;
        entity.module_params = module_params;
        // 调用业务层保存方法
        service.saveModule(entity, function(result){
            utils.respJsonData(res, result);
        });
    });


router.route('/:id')
    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            // 获取当前用户所在系统
            var currentUser = utils.getCurrentUser(req);
            if(currentUser) {
                service.getPortalModule(id, function (result) {
                    if (result.success) {
                        // 检查是否是外网
                        var is_http_prefix = /^http:\/\/+/.test(result.data.module_url); // 是否外网
                        if(is_http_prefix){
                            res.render(config.project.appviewurl + 'common/portal/modules/module_frame', {
                                url:result.data.module_url + (result.data.module_params ? '?' + result.data.module_params : ''),
                                id:result.data._id,
                                exid:utils.getUUID(),
                                layout: false
                            });
                        }
                        else {
                            res.render(config.project.appviewurl + result.data.module_url, {
                                id:result.data._id,
                                exid:utils.getUUID(),
                                params:result.data.module_params ? result.data.module_params : '',
                                layout: false
                            });
                        }
                    }
                    else {
                        res.render(config.project.appviewurl + 'common/portal/modules/module_error', {
                            layout: false,
                            msg: '模块已被停用'
                        });
                    }
                });
            }
            else {
                res.render(config.project.appviewurl + 'common/portal/modules/module_error', {
                    layout: false,
                    msg: '登录超时，请重新登录'
                });
            }
        }
        else {
            res.render(config.project.appviewurl + 'common/portal/modules/module_error', {
                layout: false,
                msg: '模块不存在'
            });
        }
    })
    .put(function(req,res){

        var id = req.params.id;
        var sys_id = req.body.sys_id;
        var module_type = req.body.module_type;
        var module_is_public = req.body.module_is_public;
        var role_ids = req.body.role_ids ? [req.body.role_ids] : req.body['role_ids[]'];
        var module_code = req.body.module_code;
        var module_title = req.body.module_title;
        var module_url = req.body.module_url;
        var module_cls = req.body.module_cls;

        var module_body_cls = req.body.module_body_cls;
        var module_icon_cls = req.body.module_icon_cls;

        var module_height = req.body.module_height;
        var module_order = req.body.module_order;
        var module_status = req.body.module_status;
        var module_remark = req.body.module_remark;
        var module_params = req.body.module_params;
        if(!id) {
            utils.respMsg(res, false, '2000', '组件ID不能为空。', null, null);
            return;
        }
        // 验证角色编号是否为空
        if(!sys_id) {
            utils.respMsg(res, false, '2001', '所属系统不能为空。', null, null);
            return;
        }
        if(!module_type) {
            utils.respMsg(res, false, '2002', '组件类型不能为空。', null, null);
            return;
        }
        if(!module_is_public) {
            utils.respMsg(res, false, '2003', '是否为公用组件不能为空。', null, null);
            return;
        }
        else {
            if(module_is_public == 0) {
                if(!role_ids) {
                    utils.respMsg(res, false, '2004', '所属角色不能为空。', null, null);
                    return;
                }
            }
        }
        if(!module_code) {
            utils.respMsg(res, false, '2005', '组件编码不能为空。', null, null);
            return;
        }
        if(!module_title) {
            utils.respMsg(res, false, '2006', '组件标题不能为空。', null, null);
            return;
        }
        if(!module_url) {
            utils.respMsg(res, false, '2007', '组件url不能为空。', null, null);
            return;
        }
        if(!module_cls) {
            utils.respMsg(res, false, '2008', '组件样式不能为空。', null, null);
            return;
        }
        if(!module_body_cls) {
            utils.respMsg(res, false, '2009', '组件边框不能为空。', null, null);
            return;
        }
        if(!module_height) {
            utils.respMsg(res, false, '2010', '组件高度不能为空。', null, null);
            return;
        }
        if(!module_order) {
            utils.respMsg(res, false, '2011', '组件序号不能为空。', null, null);
            return;
        }
        if(!module_status) {
            utils.respMsg(res, false, '2012', '组件状态不能为空。', null, null);
            return;
        }

        //构造角色保存参数
        var entity = {};
        entity.sys_id = sys_id;
        entity.module_type = module_type;
        entity.module_is_public = parseInt(module_is_public);
        if(module_is_public == 0) {
            entity.module_roles = role_ids;
        }
        else {
            entity.module_roles = [];
        }
        entity.module_code = module_code;
        entity.module_title = module_title;
        entity.module_url = module_url;
        entity.module_cls = module_cls;

        entity.module_icon_cls = module_icon_cls;
        entity.module_body_cls = module_body_cls

        entity.module_height = parseInt(module_height);
        entity.module_order = parseInt(module_order);
        entity.module_status = parseInt(module_status);
        entity.module_remark = module_remark;
        entity.module_params = module_params;

        console.log(JSON.stringify(entity));
        // 调用业务层保存方法
        service.updateModule(id, entity, function(result){
            utils.respJsonData(res, result);
        });
    });
module.exports = router;