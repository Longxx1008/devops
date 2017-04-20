/**
 * Created by ChenJun on 2016/7/26.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var service = require('../services/report_service');
var config = require('../../../../config');
/**
 * 报表管理
 */
router.route('/')
    .get(function(req,res){
        // 分页条件
        var report_name = req.query.filter_name;
        var report_sysid = req.query.sys_id;
        var report_catalogid = req.query.report_catalogid;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(report_name){
            conditionMap = {'report_name':new RegExp(report_name)};
            //conditionMap['$or'] = [{'param_name':new RegExp(param_name)},{'menu_name':new RegExp(menu_code)}];
        }

        if(report_catalogid){
            conditionMap.report_catalogid = report_catalogid;
        }

        if(report_sysid){
            conditionMap.report_sysid = report_sysid;
        }

        console.log(page+','+length+','+conditionMap);
        // 调用分页
        service.getReportList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })
    .post(function(req,res){

        var report_name = req.body.report_name;
        //var report_addr = req.body.report_addr;
        var report_desc = req.body.report_desc;
        var report_db = req.body.report_db;
        var creator = req.body.creator;
        var report_catalogid = req.body.report_catalogid;
        var report_sysid = req.body.report_sysid;

        // 验证角色编号是否为空
        if(!report_name) {
            utils.respMsg(res, false, '2001', '报表名不能为空。', null, null);
            return;
        }

        //检查报表名称是否存在
        var conditionMap = {};
        // or 查询
        if(report_name){
            conditionMap = {'report_name':report_name};
        }
        service.getReportList(1, 1, conditionMap,  function(result){
            console.log(result);
            if(result.total>0){
                utils.respMsg(res, false, '2001', '系统中存在相同的报表名，新增失败', null, null);
                return;
            }else{
              /*  if(!report_addr) {
                    utils.respMsg(res, false, '2002', '报表地址不能为空', null, null);
                    return;
                }*/
                if(!creator) {
                    utils.respMsg(res, false, '2003', '创建人不能为空', null, null);
                    return;
                }

                if(!report_catalogid) {
                    utils.respMsg(res, false, '2004', '报表类别不能为空', null, null);
                    return;
                }

                if(!report_sysid) {
                    utils.respMsg(res, false, '2001', '系统不能为空', null, null);
                    return;
                }

                if(!report_db) {
                    utils.respMsg(res, false, '2001', '连接数据库不能为空', null, null);
                    return;
                }

                //构造角色保存参数
                var reportEntity = {};
                reportEntity.report_name = report_name;
                //reportEntity.report_addr = report_addr;
                reportEntity.creator = creator;
                reportEntity.createDt = new Date();
                reportEntity.report_catalogid = report_catalogid;
                reportEntity.report_sysid = report_sysid;
                reportEntity.report_db = report_db;
                //var str = '{"ReportVersion":"2016.1","ReportGuid":"92ea15c62ec1-d213-1c91-ac9f798fb5de","ReportName":"Report","ReportAlias":"Report","ReportCreated":"/Date(1479949843000+0800)/","ReportChanged":"/Date(1479949843000+0800)/","CalculationMode":"Interpretation","Pages":{"0":{"Ident":"StiPage","Name":"Page1","Guid":"64bf35f5-80ec-5c77-2e09-0a3180673ade","Interaction":{"Ident":"StiInteraction"},"Border":";Black;2;;;;;solid:Black","Brush":"solid:Transparent","Components":{"0":{"Ident":"StiText","Name":"Text1","MinSize":"0,0","MaxSize":"0,0","ClientRectangle":"6.4,2.2,3.8,0.6","Interaction":{"Ident":"StiInteraction"},"Text":{"Value":""},"Border":";Black;;;;;;solid:Black","Brush":"solid:Transparent","TextBrush":"solid:Black","Type":"Expression"}},"PageWidth":21,"PageHeight":29.7,"Watermark":{"TextBrush":"solid:50,0,0,0"},"Margins":{"Left":1,"Right":1,"Top":1,"Bottom":1}}}}';
                var str = '{"ReportVersion":"2016.1","ReportGuid":"805ca60c7eb0-0ac7-568a-95817c09f4e8","ReportName":"Report","ReportAlias":"Report","ReportCreated":"/Date(1485076243000+0800)/","ReportChanged":"/Date(1485076243000+0800)/","CalculationMode":"Interpretation","Pages":{"0":{"Ident":"StiPage","Name":"Page1","Guid":"64bf35f5-80ec-5c77-2e09-0a3180673ade","Interaction":{"Ident":"StiInteraction"},"Border":";Black;2;;;;;solid:Black","Brush":"solid:Transparent","PageWidth":21,"PageHeight":29.7,"Watermark":{"TextBrush":"solid:50,0,0,0"},"Margins":{"Left":1,"Right":1,"Top":1,"Bottom":1}}}}'
                reportEntity.report_addr =str;
                if(report_desc){
                    reportEntity.report_desc = report_desc;
                }

                // 调用业务层保存方法
                service.saveReport(reportEntity, function(result){
                    utils.respJsonData(res, result);
                });
            }

        });
    });

router.route('/:id')
    .put(function(req,res){
        var id = req.params.id;
        var report_name = req.body.report_name;
        var report_addr = req.body.report_addr;
        var report_db = req.body.report_db;
        if(id==0){
            //保存修改内容
            var reportEntity = {};
            reportEntity.report_addr = report_addr;
            // 调用业务层保存方法
            service.updateReportContent(report_name, reportEntity, function(result){
                utils.respJsonData(res, result);
            });
        }else{
           //普通列表修改
            var report_desc = req.body.report_desc;
            var creator = req.body.creator;
            var report_catalogid = req.body.report_catalogid;
            var report_sysid = req.body.report_sysid;

            // 验证角色编号是否为空
            if(!report_name) {
                utils.respMsg(res, false, '2001', '报表名不能为空。', null, null);
                return;
            }
           /* if(!report_addr) {
                utils.respMsg(res, false, '2002', '报表地址不能为空。', null, null);
                return;
            }*/
            //检查报表名称是否存在
            var conditionMap = {};
            // or 查询
            if(report_name){
                conditionMap = {'report_name':report_name};
            }
            service.getReportList(1, 1, conditionMap,  function(result){
                console.log(result);
                if(result.total>0){
                    for(var i =0;i<result.total;i++){
                        if(!result.rows[0]._id.equals(id)){
                            utils.respMsg(res, false, '2001', '系统中存在相同的报表名，修改失败', null, null);
                            return;
                        }
                    }
                }
                if(!creator) {
                    utils.respMsg(res, false, '2003', '创建人不能为空。', null, null);
                    return;
                }

                if(!report_catalogid) {
                    utils.respMsg(res, false, '2004', '报表类别不能为空。', null, null);
                    return;
                }

                if(!report_sysid) {
                    utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
                    return;
                }

                if(!report_db) {
                    utils.respMsg(res, false, '2001', '连接数据库不能为空', null, null);
                    return;
                }

                //构造角色保存参数
                var reportEntity = {};
                reportEntity.report_name = report_name;
                reportEntity.report_db = report_db;
                reportEntity.creator = creator;
                reportEntity.createDt = new Date();
                reportEntity.report_catalogid = report_catalogid;
                reportEntity.report_sysid = report_sysid;
                //reportEntity.report_addr =str;
                if(report_desc){
                    reportEntity.report_desc = report_desc;
                }

                // 调用业务层保存方法
                service.updateReport(id, reportEntity, function(result){
                    utils.respJsonData(res, result);
                });

            });
        }

    });

/**
 * 参数类别管理
 */
router.route('/tree/:sysid')
    .get(function(req,res){
        var sysid = req.params.sysid;
        if(sysid) {
            service.getReportCatalogTree(sysid,function(result){
                utils.respJsonData(res, [{id:'0', text:config.datas.tree_param.root_node_name ? config.datas.tree_param.root_node_name : "全部", children:result}]);
            });
        }
        else {
            utils.respJsonData(res, new Array());
        }
    });

/**
 * 类别管理
 */
router.route('/catalog/')
    .post(function(req,res){
        var catalog_name = req.body.catalog_name;
        var catalog_pid = req.body.catalog_pid;
        var catalog_remark = req.body.catalog_remark;
        var catalog_status = req.body.catalog_status;
        var catalog_sysid = req.body.catalog_sysid;

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
        service.saveReportCatalog(catalogEntity, function(result){
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

        service.getReportCatalog(id,  function(result){
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
        if(!catalog_name) {
            utils.respMsg(res, false, '2002', '类别名不能为空。', null, null);
            return;
        }
        if(!catalog_sysid) {
            utils.respMsg(res, false, '2001', '系统不能为空。', null, null);
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
        service.updateReportCatalog(id,catalogEntity, function(result){
            utils.respJsonData(res, result);
        });
    });


router.route('/role/')
    .post(function(req,res){
        var report_id = req.body.report_id;
        var datas = req.body.datas;

        var arrData = datas.split(",");

        if(!report_id) {
            utils.respMsg(res, false, '2001', '报表编号不能为空。', null, null);
            return;
        }

        if(!datas) {
            utils.respMsg(res, false, '2002', '角色不能为空。', null, null);
            return;
        }

        service.saveReportRole(report_id,arrData,function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/role/:id')
    .get(function(req,res){
        var id = req.params.id;
        console.log("id:"+id);
        if (!id) {
            //{'success': false, 'code': '2000', 'msg': 'id不能为空。'}
            utils.respMsg(res, false, '2000', 'id不能为空。', null, null);
        }

        service.getReportRole(id,  function(result){
            utils.respMsg(res, true, '0000', '查询成功。', result, null);
        });
    });

module.exports = router;

