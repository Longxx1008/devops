/**
 * Created by zhaojing on 2016/8/4.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var processService = require('../../bpm/services/process_service');

router.route('/procbase')

    // -------------------------------query查询流程基本属性列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var filterParam1 = req.query.filterParam1;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        if(filterParam1){
            conditionMap['$or'] = [{'proc_code':new RegExp(filterParam1)},{'proc_name':new RegExp(filterParam1)}];
        }
        // 调用分页
        processService.getProcessBaseList(page, length, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------create添加流程基本属性-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var proc_code = req.body.proc_code;//流程编码
        var proc_name = req.body.proc_name;//流程名

        // 验证流程名是否为空
        if(!proc_name) {
            utils.respMsg(res, false, '2001', '流程名不能为空。', null, null);
            return;
        }
        // 验证流程编码是否为空
        if(!proc_code) {
            utils.respMsg(res, false, '2002', '流程编码不能为空。', null, null);
            return;
        }
        processService.checkCode(1,proc_code, function(result) {
            if(result.success){
                //构造流程基本属性信息保存参数
                var processBaseEntity = {};
                processBaseEntity.proc_code = proc_code;
                processBaseEntity.proc_name = proc_name;
                processBaseEntity.proc_create_time = new Date();
                processBaseEntity.proc_creator = req.session.current_user.user_name;
                processBaseEntity.proc_status = 1;
                // 调用业务层保存方法
                processService.saveProcessBase(processBaseEntity, function(result){
                    utils.respJsonData(res, result);
                });
            }else{
                utils.respJsonData(res, result);
            }
        });
    });

router.route('/procbase/:id')
    // -------------------------------update修改流程基本属性信息-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程基本属性id
        var proc_code = req.body.proc_code;//流程编码
        var proc_name = req.body.proc_name;//流程名

        // 验证流程名是否为空
        if(!proc_name) {
            utils.respMsg(res, false, '2001', '流程名不能为空。', null, null);
            return;
        }
        // 验证流程编码是否为空
        if(!proc_code) {
            utils.respMsg(res, false, '2002', '流程编码不能为空。', null, null);
            return;
        }
        processService.checkCode(2,proc_code, function (result) {
            if(result.success){
                //构造流程基本属性信息保存参数
                var processBaseEntity = {};
                processBaseEntity.proc_code = proc_code;
                processBaseEntity.proc_name = proc_name;
                processBaseEntity.proc_create_time = new Date();
                processBaseEntity.proc_creator = req.session.current_user.user_name;
                // 调用修改方法
                processService.updateProcessBase(id, processBaseEntity, function(result) {
                    utils.respJsonData(res, result);
                });
            }else{
                utils.respJsonData(res, result);
            }
        },id);
    });

router.route('/procdefine')

    // -------------------------------query查询流程定义内容列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var filterParam2 = req.query.filterParam2;
        var proc_id = req.query.proc_id;
        var _id = req.query.id;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        if(filterParam2){
            conditionMap.proc_code = filterParam2;
        }
        if(proc_id){
            conditionMap.proc_id = proc_id;
        }
        if(_id){
            conditionMap._id = _id;
        }
        // 调用分页
        processService.getProcessDefineList(page, length, conditionMap, function(result1){
            if(_id){
                processService.getProcessItemsById(_id, function(result2){
                    if(result2.length > 0){
                        var items = [];
                        for(var i=0;i<result2.length;i++){
                            items.push(result2[i]._doc);
                        }
                        result1.items = items;
                    }
                    utils.respJsonData(res, result1);
                });
            }else{
                utils.respJsonData(res, result1);
            }
        });
    })

    // -------------------------------create添加流程定义内容-------------------------------
    .post(function(req,res){
        // 获取提交信息
        var proc_code = req.body.proc_code;//流程编码
        var proc_name = req.body.proc_name;//流程名称
        var proc_define = req.body.proc_define;//流程图定义信息

        var lineNodeDatas = JSON.parse(req.body.lineNodeDatas);//流程图连接线数据
        var taskNodeDatas = JSON.parse(req.body.taskNodeDatas);//流程图任务节点数据

        // 验证流程编码是否为空
        if(!proc_code) {
            utils.respMsg(res, false, '2001', '流程编码不能为空。', null, null);
            return;
        }

        //根据流程编码获取流程基本属性信息
        processService.getProcessBaseInfoByProcCode(proc_code,function(result1){
            //构造流程定义保存参数
            var processDefineEntity = {};
            processDefineEntity.proc_id = result1._id;//流程基本属性ID
            processDefineEntity.proc_code = proc_code;//流程编码
            processDefineEntity.proc_name = proc_name;//流程名称
            if(!result1.proc_latest_ver){
                processDefineEntity.proc_ver = 1;//流程版本号
            }else{
                processDefineEntity.proc_ver = parseInt(result1.proc_latest_ver) + 1;//流程版本号
            }
            processDefineEntity.proc_define = proc_define;//流程图定义信息
            processDefineEntity.proc_create_time = new Date();
            processDefineEntity.proc_creator = req.session.current_user.user_name;
            processDefineEntity.proc_status = 1;

            //保存流程定义信息
            processService.saveProcessDefine(processDefineEntity,function(result2,define_id){
                if(result2.success){
                    //构造流程基本属性信息保存参数
                    var processBaseEntity = {};
                    processBaseEntity.proc_latest_ver = processDefineEntity.proc_ver;
                    //更新流程基本属性信息
                    processService.updateProcessBase(processDefineEntity.proc_id, processBaseEntity, function(result3) {
                        if(result3.success){
                            var itemArray = [];
                            for(var i=0; i<lineNodeDatas.length; i++){
                                var processItemEntity = {};
                                processItemEntity.proc_id = result1._id;
                                processItemEntity.proc_code = proc_code;
                                processItemEntity.proc_ver = processDefineEntity.proc_ver;
                                processItemEntity.proc_define_id = define_id;
                                processItemEntity.item_code = lineNodeDatas[i].item_code;
                                processItemEntity.item_type = lineNodeDatas[i].item_type;
                                processItemEntity.item_el = lineNodeDatas[i].item_el;

                                itemArray.push(processItemEntity);
                            }
                            for(var i=0; i<taskNodeDatas.length; i++){
                                var processItemEntity = {};
                                processItemEntity.proc_id = result1._id;
                                processItemEntity.proc_code = proc_code;
                                processItemEntity.proc_ver = processDefineEntity.proc_ver;
                                processItemEntity.proc_define_id = define_id;
                                processItemEntity.item_code = taskNodeDatas[i].item_code;
                                processItemEntity.item_type = taskNodeDatas[i].item_type;
                                processItemEntity.item_sms_warn = taskNodeDatas[i].item_sms_warn;
                                processItemEntity.item_show_text = taskNodeDatas[i].selectVal;
                                if(taskNodeDatas[i].selectType == 1){//参与人
                                    processItemEntity.item_assignee_user = taskNodeDatas[i].item_assignee_user;
                                }else if(taskNodeDatas[i].selectType == 2){//参与角色
                                    processItemEntity.item_assignee_role = taskNodeDatas[i].item_assignee_role;
                                }else if(taskNodeDatas[i].selectType == 3){//参照人
                                    processItemEntity.item_assignee_ref_task = taskNodeDatas[i].item_assignee_ref_task;
                                }

                                itemArray.push(processItemEntity);
                            }
                            if(itemArray.length > 0){
                                processService.saveProcessItems(itemArray,function(result4){
                                    utils.respJsonData(res, result4);
                                });
                            }else{
                                utils.respJsonData(res, result3);
                            }
                        }else{
                            utils.respJsonData(res, result3);
                        }
                    });
                }else{
                    utils.respJsonData(res, result2);
                }
            });
        });
    });

router.route('/procdefine/:id')
    // -------------------------------update修改流程实例内容-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程实例id
        var proc_define = req.body.proc_define;//流程图定义信息

        var lineNodeDatas = JSON.parse(req.body.lineNodeDatas);//流程图连接线数据
        var taskNodeDatas = JSON.parse(req.body.taskNodeDatas);//流程图任务节点数据

        var processDefineEntity = {};
        processDefineEntity.proc_define = proc_define;
        processDefineEntity.proc_create_time = new Date();
        processDefineEntity.proc_creator = req.session.current_user.user_name;

        // 调用修改方法
        processService.updateProcessDefine(id, processDefineEntity, function(result1) {
            if(result1.success){
                var conditions = {proc_define_id: id};
                processService.deleteProcessItem(conditions, function (result2) {
                    if (result2.success) {
                        processService.getProcessDefineById(id, function (result3) {
                            var itemArray = [];
                            for(var i=0; i<lineNodeDatas.length; i++){
                                var processItemEntity = {};
                                processItemEntity.proc_id = result3.proc_id;
                                processItemEntity.proc_code = result3.proc_code;
                                processItemEntity.proc_ver = result3.proc_ver;
                                processItemEntity.proc_define_id = id;
                                processItemEntity.item_code = lineNodeDatas[i].item_code;
                                processItemEntity.item_type = lineNodeDatas[i].item_type;
                                processItemEntity.item_el = lineNodeDatas[i].item_el;

                                itemArray.push(processItemEntity);
                            }
                            for(var i=0; i<taskNodeDatas.length; i++){
                                var processItemEntity = {};
                                processItemEntity.proc_id = result3.proc_id;
                                processItemEntity.proc_code = result3.proc_code;
                                processItemEntity.proc_ver = result3.proc_ver;
                                processItemEntity.proc_define_id = id;
                                processItemEntity.item_code = taskNodeDatas[i].item_code;
                                processItemEntity.item_type = taskNodeDatas[i].item_type;
                                processItemEntity.item_sms_warn = taskNodeDatas[i].item_sms_warn;
                                processItemEntity.item_show_text = taskNodeDatas[i].selectVal;
                                if(taskNodeDatas[i].selectType == 1){//参与人
                                    processItemEntity.item_assignee_user = taskNodeDatas[i].item_assignee_user;
                                }else if(taskNodeDatas[i].selectType == 2){//参与角色
                                    processItemEntity.item_assignee_role = taskNodeDatas[i].item_assignee_role;
                                }else if(taskNodeDatas[i].selectType == 3){//参照人
                                    processItemEntity.item_assignee_ref_task = taskNodeDatas[i].item_assignee_ref_task;
                                }

                                itemArray.push(processItemEntity);
                            }
                            if(itemArray.length > 0){
                                processService.saveProcessItems(itemArray,function(result4){
                                    utils.respJsonData(res, result4);
                                });
                            }else{
                                utils.respJsonData(res, result1);
                            }
                        });
                    }else{
                        utils.respJsonData(res, result2);
                    }
                });
            }else{
                utils.respJsonData(res, result1);
            }
        });
    });

router.route('/processChangeStatus/:id')
    // -------------------------------启用、禁用操作-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程基本属性id
        var value = req.body.proc_status;
        var flag = req.body.flag;

        // 调用启用、禁用方法
        processService.processChangeStatus(id, value, flag, function(result) {
            utils.respJsonData(res, result);
        });
    });

module.exports = router;