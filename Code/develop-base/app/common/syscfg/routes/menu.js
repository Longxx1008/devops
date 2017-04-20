/**
 * Created by ShiHukui on 2016/2/19.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var service = require('../services/menu_service');
var config = require('../../../../config');
/**
 * 菜单管理
 */
router.route('/')
    .get(function(req,res){
        // 分页条件
        var menu_code = req.query.menu_code;
        var menu_status = req.query.menu_status;
        var menu_sysid = req.query.sys_id;
        var menu_pid = req.query.menu_pid;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(menu_code){
            conditionMap['$or'] = [{'menu_code':new RegExp(menu_code)},{'menu_name':new RegExp(menu_code)}];
        }
        if(menu_status && menu_status != -1){
            conditionMap.menu_status = parseInt(menu_status);
        }
        if(menu_sysid){
            conditionMap.menu_sysid = menu_sysid;
        }
        if(menu_pid){
            conditionMap.menu_pid = menu_pid;
        }
        else {
            conditionMap.menu_pid = '0';
        }
        //console.log(page+','+length+','+conditionMap);
        // 调用分页
        service.getMenuList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })
    .post(function(req,res){

        var menu_sysid = req.body.menu_sysid;
        var menu_pid = req.body.menu_pid;
        var menu_code = req.body.menu_code;
        var menu_name = req.body.menu_name;
        var menu_url = req.body.menu_url;
        var menu_nav = req.body.menu_nav;
        var menu_order = req.body.menu_order;
        var menu_status = req.body.menu_status;
        var menu_type = req.body.menu_type;
        //var menu_level = req.body.menu_level;
        var menu_cls = req.body.menu_cls;
        var menu_hidden = req.body.menu_hidden;
        var menu_use_sys_layout = req.body.menu_use_sys_layout;
        var menu_target = req.body.menu_target;
        var menu_remark = req.body.menu_remark;

        // 验证角色编号是否为空
        if(!menu_sysid) {
            utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
            return;
        }
        if(!menu_pid) {
            utils.respMsg(res, false, '2002', '上级菜单不能为空。', null, null);
            return;
        }
        if(!menu_code) {
            utils.respMsg(res, false, '2003', '菜单编码不能为空。', null, null);
            return;
        }
        if(!menu_name) {
            utils.respMsg(res, false, '2004', '菜单名称不能为空。', null, null);
            return;
        }
        if(!menu_url) {
            utils.respMsg(res, false, '2005', '菜单url不能为空。', null, null);
            return;
        }
        if(!menu_nav) {
            utils.respMsg(res, false, '2006', '菜单导航不能为空。', null, null);
            return;
        }
        if(!menu_order) {
            utils.respMsg(res, false, '2007', '排序号不能为空。', null, null);
            return;
        }
        if(!menu_status) {
            utils.respMsg(res, false, '2008', '菜单状态不能为空。', null, null);
            return;
        }
        if(!menu_type) {
            utils.respMsg(res, false, '2009', '菜单类型不能为空。', null, null);
            return;
        }
        if(!menu_hidden) {
            utils.respMsg(res, false, '2010', '菜单是否隐藏不能为空。', null, null);
            return;
        }
        if(!menu_use_sys_layout) {
            utils.respMsg(res, false, '2011', '菜单是否沿用系统布局不能为空。', null, null);
            return;
        }
        if(!menu_target) {
            utils.respMsg(res, false, '2012', '菜单目标不能为空。', null, null);
            return;
        }
        /*if(!menu_level) {
            utils.respMsg(res, false, '2010', '菜单层级不能为空。', null, null);
            return;
        }*/

        //构造角色保存参数
        var menuEntity = {};
        menuEntity.menu_sysid = menu_sysid;
        menuEntity.menu_pid = menu_pid;
        menuEntity.menu_code = menu_code;
        menuEntity.menu_name = menu_name;
        menuEntity.menu_url = menu_url;
        menuEntity.menu_nav = menu_nav;
        menuEntity.menu_order = menu_order;
        menuEntity.menu_status = menu_status;
        menuEntity.menu_type = menu_type;
        //menuEntity.menu_level = menu_level;
        menuEntity.menu_cls = menu_cls;
        menuEntity.menu_hidden = menu_hidden;
        menuEntity.menu_use_sys_layout = menu_use_sys_layout;
        menuEntity.menu_target = menu_target;

        if(menu_remark){
            menuEntity.menu_remark = menu_remark;
        }

        // 调用业务层保存方法
        service.saveMenu(menuEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

/**
 * 菜单管理
 */
router.route('/tree/:sysid')
    .get(function(req,res){
        var sysid = req.params.sysid;
        if(sysid) {
            service.getSysMenu(sysid, function(result){
                utils.respJsonData(res, [{id:'0', text:config.datas.tree_menu.root_node_name ? config.datas.tree_menu.root_node_name : "ROOT", children:result}]);
            });
        }
        else {
            utils.respJsonData(res, new Array());
        }
    });

router.route('/:id')
    .put(function(req,res){
        var id = req.params.id;
        var menu_sysid = req.body.menu_sysid;
        var menu_pid = req.body.menu_pid;
        var menu_code = req.body.menu_code;
        var menu_name = req.body.menu_name;
        var menu_url = req.body.menu_url;
        var menu_nav = req.body.menu_nav;
        var menu_order = req.body.menu_order;
        var menu_status = req.body.menu_status;
        var menu_type = req.body.menu_type;
        //var menu_level = req.body.menu_level;
        var menu_cls = req.body.menu_cls;
        var menu_hidden = req.body.menu_hidden;
        var menu_use_sys_layout = req.body.menu_use_sys_layout;
        var menu_target = req.body.menu_target;
        var menu_remark = req.body.menu_remark;

        if(!id) {
            utils.respMsg(res, false, '2000', '菜单ID不能为空。', null, null);
            return;
        }
        if(!menu_sysid) {
            utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
            return;
        }
        if(!menu_pid) {
            utils.respMsg(res, false, '2002', '上级菜单不能为空。', null, null);
            return;
        }
        if(!menu_code) {
            utils.respMsg(res, false, '2003', '菜单编码不能为空。', null, null);
            return;
        }
        if(!menu_name) {
            utils.respMsg(res, false, '2004', '菜单名称不能为空。', null, null);
            return;
        }
        if(!menu_url) {
            utils.respMsg(res, false, '2005', '菜单url不能为空。', null, null);
            return;
        }
        if(!menu_nav) {
            utils.respMsg(res, false, '2006', '菜单导航不能为空。', null, null);
            return;
        }
        if(!menu_order) {
            utils.respMsg(res, false, '2007', '排序号不能为空。', null, null);
            return;
        }
        if(!menu_status) {
            utils.respMsg(res, false, '2008', '菜单状态不能为空。', null, null);
            return;
        }
        if(!menu_type) {
            utils.respMsg(res, false, '2009', '菜单类型不能为空。', null, null);
            return;
        }
        if(!menu_hidden) {
            utils.respMsg(res, false, '2010', '菜单是否隐藏不能为空。', null, null);
            return;
        }
        if(!menu_use_sys_layout) {
            utils.respMsg(res, false, '2011', '菜单是否沿用系统布局不能为空。', null, null);
            return;
        }
        if(!menu_target) {
            utils.respMsg(res, false, '2012', '菜单目标不能为空。', null, null);
            return;
        }
        /*if(!menu_level) {
            utils.respMsg(res, false, '2010', '菜单层级不能为空。', null, null);
            return;
        }*/

        //构造角色保存参数
        var menuEntity = {};
        menuEntity.menu_sysid = menu_sysid;
        menuEntity.menu_pid = menu_pid;
        menuEntity.menu_code = menu_code;
        menuEntity.menu_name = menu_name;
        menuEntity.menu_url = menu_url;
        menuEntity.menu_nav = menu_nav;
        menuEntity.menu_order = menu_order;
        menuEntity.menu_status = menu_status;
        menuEntity.menu_type = menu_type;
        //menuEntity.menu_level = menu_level;
        menuEntity.menu_cls = menu_cls;
        menuEntity.menu_hidden = menu_hidden;
        menuEntity.menu_use_sys_layout = menu_use_sys_layout;
        menuEntity.menu_target = menu_target;

        if(menu_remark){
            menuEntity.menu_remark = menu_remark;
        }

        // 调用业务层保存方法
        service.updateMenu(id, menuEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

/**
 * 操作管理
 */
router.route('/opt/')
    .get(function(req,res){
        // 分页条件
        var menu_id = req.query.menu_id;
        // or 查询
        if(!menu_id){
            utils.respMsg(res, false, '2001', '菜单ID不能为空。', null, null);
            return;
        }
        service.getMenuOpt(menu_id,  function(result){
            utils.respMsg4EasyuiPaging(res, true, '0000', '菜单操作查询成功。', result, result.length)
        });
    })

    .post(function(req,res){

        var menu_id = req.body.menu_id;
        var opt_code = req.body.opt_code;
        var opt_name = req.body.opt_name;
        var opt_method = req.body.opt_method;
        var opt_url = req.body.opt_url;
        var opt_order = req.body.opt_order;
        var opt_status = req.body.opt_status;
        var opt_remark = req.body.opt_remark;

        // 验证角色编号是否为空
        if(!menu_id) {
            utils.respMsg(res, false, '2001', '请选择菜单', null, null);
            return;
        }
        if(!opt_code) {
            utils.respMsg(res, false, '2002', '操作代码不能为空', null, null);
            return;
        }
        if(!opt_name) {
            utils.respMsg(res, false, '2003', '操作名称不能为空', null, null);
            return;
        }
        if(!opt_method) {
            utils.respMsg(res, false, '2004', '操作方法不能为空', null, null);
            return;
        }
        if(!opt_url) {
            utils.respMsg(res, false, '2005', '操作url不能为空', null, null);
            return;
        }
        if(!opt_order) {
            utils.respMsg(res, false, '2006', '排序号不能为空', null, null);
            return;
        }
        if(!opt_status) {
            utils.respMsg(res, false, '2007', '状态不能为空', null, null);
            return;
        }

        //构造角色保存参数
        var menuOptEntity = {};
        menuOptEntity.menu_id = menu_id;
        menuOptEntity.opt_code = opt_code;
        menuOptEntity.opt_name = opt_name;
        menuOptEntity.opt_method = opt_method;
        menuOptEntity.opt_url = opt_url;
        menuOptEntity.opt_order = opt_order;
        menuOptEntity.opt_status = opt_status;

        if(opt_remark){
            menuOptEntity.opt_remark = opt_remark;
        }

        // 调用业务层保存方法
        service.saveMenuOpt(menuOptEntity, function(result){
            utils.respJsonData(res, result);
        });
    });
router.route('/opt/batch')
    .post(function(req,res){

        var menu_id = req.body.batch_menu_id;
        var opt_url_prefix = req.body.batch_opt_url_prefix;
        var opt_codes = req.body.batch_opt_code ? [req.body.batch_opt_code] : req.body['batch_opt_code[]'];
        var opt_names = req.body.batch_opt_name ? [req.body.batch_opt_name] : req.body['batch_opt_name[]'];
        var opt_methods = req.body.batch_opt_method ? [req.body.batch_opt_method] : req.body['batch_opt_method[]'];
        var opt_urls = req.body.batch_opt_url ? [req.body.batch_opt_url] : req.body['batch_opt_url[]'];
        var opt_orders = req.body.batch_opt_order ? [req.body.batch_opt_order] : req.body['batch_opt_order[]'];

        // 验证角色编号是否为空
        if(!menu_id) {
            utils.respMsg(res, false, '2000', '请选择菜单', null, null);
            return;
        }
        if(!opt_url_prefix) {
            utils.respMsg(res, false, '2001', '操作url前缀不能为空', null, null);
            return;
        }
        if(!opt_codes) {
            utils.respMsg(res, false, '2002', '操作代码不能为空', null, null);
            return;
        }
        if(!opt_names) {
            utils.respMsg(res, false, '2003', '操作名称不能为空', null, null);
            return;
        }
        if(!opt_methods) {
            utils.respMsg(res, false, '2004', '操作方法不能为空', null, null);
            return;
        }
        if(!opt_urls) {
            utils.respMsg(res, false, '2005', '操作url不能为空', null, null);
            return;
        }
        if(!opt_orders) {
            utils.respMsg(res, false, '2006', '排序号不能为空', null, null);
            return;
        }

        var menuOpts = new Array();
        for(var i = 0; i < opt_codes.length; i++) {
            //构造角色保存参数
            var menuOptEntity = {};
            menuOptEntity.menu_id = menu_id;
            menuOptEntity.opt_code = opt_codes[i];
            menuOptEntity.opt_name = opt_names[i];
            menuOptEntity.opt_method = opt_methods[i];
            menuOptEntity.opt_url = opt_url_prefix + opt_urls[i];
            menuOptEntity.opt_order = opt_orders[i];
            menuOptEntity.opt_status = 1;

            menuOpts.push(menuOptEntity);
        }

        // 调用业务层保存方法
        service.batchSaveMenuOpt(menuOpts, function(result){
            utils.respJsonData(res, result);
        });
    });
router.route('/opt/:id')
    .put(function(req,res){
        var id = req.params.id;
        var menu_id = req.body.menu_id;
        var opt_code = req.body.opt_code;
        var opt_name = req.body.opt_name;
        var opt_method = req.body.opt_method;
        var opt_url = req.body.opt_url;
        var opt_order = req.body.opt_order;
        var opt_status = req.body.opt_status;
        var opt_remark = req.body.opt_remark;

        // 验证角色编号是否为空
        if(!id) {
            utils.respMsg(res, false, '2000', '操作ID不能为空', null, null);
            return;
        }
        if(!menu_id) {
            utils.respMsg(res, false, '2001', '请选择菜单', null, null);
            return;
        }
        if(!opt_code) {
            utils.respMsg(res, false, '2002', '操作代码不能为空', null, null);
            return;
        }
        if(!opt_name) {
            utils.respMsg(res, false, '2003', '操作名称不能为空', null, null);
            return;
        }
        if(!opt_method) {
            utils.respMsg(res, false, '2004', '操作方法不能为空', null, null);
            return;
        }
        if(!opt_url) {
            utils.respMsg(res, false, '2005', '操作url不能为空', null, null);
            return;
        }
        if(!opt_order) {
            utils.respMsg(res, false, '2006', '排序号不能为空', null, null);
            return;
        }
        if(!opt_status) {
            utils.respMsg(res, false, '2007', '状态不能为空', null, null);
            return;
        }


        //构造角色保存参数
        var menuOptEntity = {};
        menuOptEntity.menu_id = menu_id;
        menuOptEntity.opt_code = opt_code;
        menuOptEntity.opt_name = opt_name;
        menuOptEntity.opt_method = opt_method;
        menuOptEntity.opt_url = opt_url;
        menuOptEntity.opt_order = opt_order;
        menuOptEntity.opt_status = opt_status;

        if(opt_remark){
            menuOptEntity.opt_remark = opt_remark;
        }

        // 调用业务层保存方法
        service.updateMenuOpt(id, menuOptEntity, function(result){
            utils.respJsonData(res, result);
        });
    });
module.exports = router;

