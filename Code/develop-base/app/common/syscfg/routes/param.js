/**
 * Created by ChenJun on 2016/3/30.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var coreservice = require('../../core/services/core_service.js');
var service = require('../services/param_service');
var config = require('../../../../config');
/**
 * 参数管理
 */
router.route('/')
    .get(function(req,res){
        // 分页条件
        var param_name = req.query.param_name;
        var param_status = req.query.param_status;
        var param_sysid = req.query.sys_id;
        var param_catalogid = req.query.param_catalogid;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(param_name){
            conditionMap = {'param_name':new RegExp(param_name)};
            //conditionMap['$or'] = [{'param_name':new RegExp(param_name)},{'menu_name':new RegExp(menu_code)}];
        }
        if(param_status && param_status != -1){
            conditionMap.param_status = parseInt(param_status);
        }
        if(param_sysid){
            conditionMap.param_sysid = param_sysid;
        }

        if(param_catalogid){
            conditionMap.param_catalogid = param_catalogid;
        }

        console.log(page+','+length+','+conditionMap);
        // 调用分页
        service.getParamList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })
    .post(function(req,res){

        var param_sysid = req.body.param_sysid;
        var param_name = req.body.param_name;
        var param_val = req.body.param_val;
        var param_desc = req.body.param_desc;
        var param_status = req.body.param_status;
        var param_catalogid = req.body.param_catalogid;

        // 验证角色编号是否为空
        if(!param_sysid) {
            utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
            return;
        }
        if(!param_name) {
            utils.respMsg(res, false, '2002', '参数名不能为空。', null, null);
            return;
        }
        if(!param_val) {
            utils.respMsg(res, false, '2003', '参数值不能为空。', null, null);
            return;
        }
       /* if(!param_desc) {
            utils.respMsg(res, false, '2004', '参数描述不能为空。', null, null);
            return;
        }*/
        if(!param_status) {
            utils.respMsg(res, false, '2005', '参数状态不能为空。', null, null);
            return;
        }
        if(!param_catalogid) {
            utils.respMsg(res, false, '2006', '参数类别不能为空。', null, null);
            return;
        }

        //构造角色保存参数
        var paramEntity = {};
        paramEntity.param_sysid = param_sysid;
        paramEntity.param_name = param_name;
        paramEntity.param_val = param_val;
        //paramEntity.param_desc = param_desc;
        paramEntity.param_status = param_status;
        paramEntity.param_catalogid = param_catalogid;

        if(param_desc){
            paramEntity.param_desc = param_desc;
        }

        // 调用业务层保存方法
        service.saveParam(paramEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

/**
 * 参数类别管理
 */
router.route('/tree/:sysid')
    .get(function(req,res){
        var sysid = req.params.sysid;
        if(sysid) {
            service.getSysCatalog(sysid, function(result){
                utils.respJsonData(res, [{id:'0', text:config.datas.tree_param.root_node_name ? config.datas.tree_param.root_node_name : "全部", children:result}]);
            });
        }
        else {
            utils.respJsonData(res, new Array());
        }
    });

/**
 * 同步参数
 */
router.route('/syn/')
    .get(function(req,res){
        coreservice.saveSysParamInCache(function(err,result){
            utils.respJsonData(res, result);
        });
    });

router.route('/:id')
    .put(function(req,res){
        var id = req.params.id;
        var param_sysid = req.body.param_sysid;
        var param_name = req.body.param_name;
        var param_val = req.body.param_val;
        var param_desc = req.body.param_desc;
        var param_status = req.body.param_status;
        var param_catalogid = req.body.param_catalogid;

        if(!id) {
            utils.respMsg(res, false, '2000', '参数ID不能为空。', null, null);
            return;
        }
        if(!param_sysid) {
            utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
            return;
        }
        if(!param_name) {
            utils.respMsg(res, false, '2002', '参数名不能为空。', null, null);
            return;
        }
        if(!param_val) {
            utils.respMsg(res, false, '2003', '参数值不能为空。', null, null);
            return;
        }
        if(!param_status) {
            utils.respMsg(res, false, '2005', '参数状态不能为空。', null, null);
            return;
        }
        if(!param_catalogid) {
            utils.respMsg(res, false, '2006', '参数类别不能为空。', null, null);
            return;
        }

        //构造角色保存参数
        var paramEntity = {};
        paramEntity.param_sysid = param_sysid;
        paramEntity.param_name = param_name;
        paramEntity.param_val = param_val;
        //paramEntity.param_desc = param_desc;
        paramEntity.param_status = param_status;
        paramEntity.param_catalogid = param_catalogid;

        if(param_desc){
            paramEntity.param_desc = param_desc;
        }

        // 调用业务层保存方法
        service.updateParam(id, paramEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

/**
 * 类别管理
 */
router.route('/catalog/')
    .post(function(req,res){
        var catalog_sysid = req.body.catalog_sysid;
        var catalog_name = req.body.catalog_name;
        var catalog_pid = req.body.catalog_pid;
        var catalog_remark = req.body.catalog_remark;
        var catalog_status = req.body.catalog_status;

        // 验证角色编号是否为空
        if(!catalog_sysid) {
            utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
            return;
        }
        if(!catalog_name) {
            utils.respMsg(res, false, '2002', '类别名不能为空。', null, null);
            return;
        }

        //构造角色保存参数
        var catalogEntity = {};
        catalogEntity.catalog_sysid = catalog_sysid;
        catalogEntity.catalog_name = catalog_name;
        catalogEntity.catalog_pid = 0;
        catalogEntity.catalog_status = 1;

        if(catalog_remark){
            catalogEntity.catalog_remark = catalog_remark;
        }

        // 调用业务层保存方法
        service.saveParamCatalog(catalogEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/catalog/:id')
    .get(function(req,res){
        var id = req.params.id;
        console.log("id:"+id);
        if (!id) {
            //{'success': false, 'code': '2000', 'msg': 'id不能为空。'}
            utils.respMsg(res, false, '2000', 'id不能为空。', null, null);
        }

        service.getParamCatalog(id,  function(result){
            utils.respMsg(res, true, '0000', '查询成功。', result, null);
        });
    })
    .put(function(req,res){
        var id = req.params.id;
        var catalog_sysid = req.body.catalog_sysid;
        var catalog_name = req.body.catalog_name;
        var catalog_pid = req.body.catalog_pid;
        var catalog_remark = req.body.catalog_remark;
        var catalog_status = req.body.catalog_status;

        // 验证角色编号是否为空
        if(!id) {
            utils.respMsg(res, false, '2000', '参数ID不能为空。', null, null);
            return;
        }
        if(!catalog_sysid) {
            utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
            return;
        }
        if(!catalog_name) {
            utils.respMsg(res, false, '2002', '类别名不能为空。', null, null);
            return;
        }

        //构造角色保存参数
        var catalogEntity = {};
        catalogEntity.catalog_sysid = catalog_sysid;
        catalogEntity.catalog_name = catalog_name;
        catalogEntity.catalog_pid = 0;
        catalogEntity.catalog_status = 1;

        if(catalog_remark){
            catalogEntity.catalog_remark = catalog_remark;
        }

        // 调用业务层保存方法
        service.updateParamCatalog(id,catalogEntity, function(result){
            utils.respJsonData(res, result);
        });
    });
module.exports = router;

