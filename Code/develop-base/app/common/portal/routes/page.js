/**
 * Created by ShiHukui on 2016/2/19.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var service = require('../services/page_service');
var config = require('../../../../config');
var memcached_utils = require('../../core/utils/memcached_utils');
/**
 * 页面管理
 */
router.route('/')
    .get(function(req,res){
        // 分页条件
        var page_code = req.query.page_code;
        var page_status = req.query.page_status;
        var sys_id = req.query.sys_id;

        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;
        var conditionMap = {};
        // or 查询
        if(page_code){
            conditionMap['$or'] = [{'page_code':new RegExp(page_code)},{'page_name':new RegExp(page_code)}];
        }
        if(page_status && page_status != -1){
            conditionMap.page_status = parseInt(page_status);
        }
        if(sys_id){
            conditionMap.sys_id = sys_id;
        }

        // 调用分页
        service.getPageList(page, length, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    })
    .post(function(req,res){

        var sys_id = req.body.sys_id;
        var page_is_customize = req.body.page_is_customize;
        var page_code = req.body.page_code;
        var page_name = req.body.page_name;
        var page_layout_col_type = req.body.page_layout_col_type;
        var page_status = req.body.page_status;
        var page_remark = req.body.page_remark;


        // 验证角色编号是否为空
        if(!sys_id) {
            utils.respMsg(res, false, '2001', '所属系统不能为空。', null, null);
            return;
        }
        if(!page_is_customize) {
            utils.respMsg(res, false, '2002', '是否允许自定义不能为空。', null, null);
            return;
        }
        if(!page_code) {
            utils.respMsg(res, false, '2003', '页面编号不能为空。', null, null);
            return;
        }
        if(!page_name) {
            utils.respMsg(res, false, '2004', '页面名称不能为空。', null, null);
            return;
        }
        if(!page_layout_col_type) {
            utils.respMsg(res, false, '2005', '页面布局比例不能为空。', null, null);
            return;
        }
        if(!page_status) {
            utils.respMsg(res, false, '2006', '页面状态不能为空。', null, null);
            return;
        }


        //构造角色保存参数
        var entity = {};
        entity.sys_id = sys_id;
        entity.page_is_customize = parseInt(page_is_customize);
        entity.page_code = page_code;
        entity.page_name = page_name;
        entity.page_layout_col_type = page_layout_col_type;
        entity.page_status = parseInt(page_status);
        entity.page_remark = page_remark;
        /*entity.page_layout = 'themes/portal_eui/layout';
        entity.page_body = 'common/portal/template/tpl';*/
        // 调用业务层保存方法
        service.savePage(entity, function(result){
            utils.respJsonData(res, result);
        });
    });


router.route('/:id')
    .put(function(req,res){

        var id = req.params.id;
        var sys_id = req.body.sys_id;
        var page_is_customize = req.body.page_is_customize;
        var page_code = req.body.page_code;
        var page_name = req.body.page_name;
        var page_layout_col_type = req.body.page_layout_col_type;
        var page_status = req.body.page_status;
        var page_remark = req.body.page_remark;

        if(!id) {
            utils.respMsg(res, false, '2000', '页面ID不能为空。', null, null);
            return;
        }
        // 验证角色编号是否为空
        if(!sys_id) {
            utils.respMsg(res, false, '2001', '所属系统不能为空。', null, null);
            return;
        }
        if(!page_is_customize) {
            utils.respMsg(res, false, '2002', '是否允许自定义不能为空。', null, null);
            return;
        }
        if(!page_code) {
            utils.respMsg(res, false, '2003', '页面编号不能为空。', null, null);
            return;
        }
        if(!page_name) {
            utils.respMsg(res, false, '2004', '页面名称不能为空。', null, null);
            return;
        }
        if(!page_layout_col_type) {
            utils.respMsg(res, false, '2005', '页面布局比例不能为空。', null, null);
            return;
        }
        if(!page_status) {
            utils.respMsg(res, false, '2006', '页面状态不能为空。', null, null);
            return;
        }


        //构造角色保存参数
        var entity = {};
        entity.sys_id = sys_id;
        entity.page_is_customize = page_is_customize;
        entity.page_code = page_code;
        entity.page_name = page_name;
        entity.page_layout_col_type = page_layout_col_type;
        entity.page_status = parseInt(page_status);
        entity.page_remark = page_remark;

        /*entity.page_layout = 'themes/portal_eui/layout';
        entity.page_body = 'common/portal/template/tpl';*/

        service.updatePage(id, entity, function(result){
            utils.respJsonData(res, result);
        });
    });
/**
 * 页面组件设置
 */
router.route('/cfg/:id')
    // 查看页面组件
    .get(function(req,res){
        var id = req.params.id;
        if(!id) {
            utils.respMsg(res, false, '2000', '页面ID不能为空。', null, null);
            return;
        }
        service.getPage(id, function(result){
            if(result.success) {
                var tpl = result.data.page_body;
                //var layout = result.data.page_layout;

                // 获取页面布局情况
                var col_type = result.data.page_layout_col_type;
                if (!col_type) {
                    col_type = "1:1:1";
                }

                var col_types = col_type.split(':');
                // 转换成百分比
                var layout_cols = new Array();
                var total = 0;
                col_types.forEach(function (col_type) {
                    total += parseInt(col_type);
                });
                col_types.forEach(function (col_type) {
                    layout_cols.push(parseInt(col_type) / total * 100);
                });
                memcached_utils.getVal('common_dict_data', function(err, dictData) {
                    service.getPortalModuleList(result.data.sys_id, function (modules) {
                        res.render(config.project.appviewurl + 'common/portal/page_cfg_layout', {
                            layout_id: result.data._id,
                            layout: false,
                            layout_cols: layout_cols,
                            layout_page: result.data,
                            layout_modules: result.data.page_layout_modules,
                            layout_all_modules: modules.data,
                            layout_module_types: dictData['common_portal_module_type']//[{"id": "1", "text": "公共组件"}, {"id": "2", "text": "其他组件"}]
                        });
                    });
                });
            }
            else {
                res.render(config.project.appviewurl + 'common/portal/template/tpl_default', {
                    message:'加载portal页面出现异常',
                    layout:'themes/portal_eui/portal_cfg_layout'
                });
            }
        });
    })
    // 保存页面组件设置
    .put(function(req,res){
        var pageid = req.params.id;
        var col_index_moduleids = req.body.mids;

        if(!pageid) {
            utils.respMsg(res, false, '2001', '页面id不能为空。', null, null);
            return;
        }
        else {
            service.updatePortalPageHasModules(0, pageid, col_index_moduleids, function(result){
                utils.respJsonData(res, result);
            });
        }
    });
module.exports = router;