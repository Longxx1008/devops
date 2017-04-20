/**
 * Created by zhaojing on 2016/8/22.
 */
var model = require('../models/process_model');
var utils = require('../../core/utils/app_utils');

/**
 * 编码唯一性验证
 * @param code
 * @param cb
 */
exports.checkCode = function (flag,code,cb,id) {
    var query;
    if(flag == 1){
        query =  model.$ProcessBase.find({});
        query.where('proc_code',code);
    }else if(flag == 2){
        query =  model.$ProcessBase.find({});
        query.where('proc_code',code);
        query.where({'_id':{'$ne':id}});
    }
    query.exec(function(err,rs){
        if(err){
            cb({'success':false, 'code':'1001', 'msg':'编码唯一性验证时出现异常。'});
        }else{
            if(rs.length > 0){
                cb({'success':false, 'code':'1002', 'msg':'编码重复'});
            }else {
                cb({'success':true});
            }
        }
    });
}

/**
 * 获取流程基本属性信息列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getProcessBaseList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$ProcessBase, page, size, conditionMap, cb);
};

/**
 * 获取流程实例信息列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getProcessDefineList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$ProcessDefine, page, size, conditionMap, cb, null, {proc_ver:-1});
};

/**
 * 根据流程编码获取流程基本属性信息
 * @param proc_code
 * @param cb
 */
exports.getProcessBaseInfoByProcCode = function(proc_code,cb){
    var query = model.$ProcessBase.find({});
    query.where('proc_code',proc_code);
    query.exec(function(error,rs){
        if(error){
            cb(exports.returnMsg(false, '1000', '获取流程基本属性信息ID时出现异常。', null, error));
        }else{
            cb(rs[0]._doc);
        }
    });
}

/**
 * 新增流程基本属性信息
 * @param data
 * @param cb
 */
exports.saveProcessBase = function(data, cb) {
    // 实例模型，调用保存方法
    model.$ProcessBase(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增流程基本属性信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增流程基本属性信息成功。', null, null));
        }
    });
}

/**
 * 新增流程实例信息
 * @param data
 * @param cb
 */
exports.saveProcessDefine = function(data, cb){
    // 实例模型，调用保存方法
    var arr = [];
    arr.push(data);
    model.$ProcessDefine.create(arr, function (err, docs) {
        if(err){
            cb(utils.returnMsg(false, '1000', '新增流程定义信息时出现异常。', null, error));
        }
        else{
            cb(utils.returnMsg(true, '0000', '新增流程定义信息成功。', null, null),docs[0]._doc._id);
        }
    });
}

/**
 * 修改流程基本属性信息
 * @param id
 * @param data
 * @param cb
 */
exports.updateProcessBase = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$ProcessBase.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1001', '修改流程基本属性信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改流程基本属性信息成功。', null, null));
        }
    });
}

/**
 * 修改流程实例信息
 * @param id
 * @param data
 * @param cb
 */
exports.updateProcessDefine = function(id, data, cb) {
    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$ProcessDefine.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1001', '修改流程定义信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改流程定义信息成功。', null, null));
        }
    });
}

/**
 * 启用、禁用操作
 * @param id
 * @param value
 * @param flag
 * @param cb
 */
exports.processChangeStatus = function(id, value, flag, cb){
    var conditions = {_id: id};
    var update = {$set: {proc_status:value}};
    var options = {};
    var db;
    if(flag == 1){
        db = model.$ProcessBase;
    }else if(flag == 2){
        db = model.$ProcessDefine;
    }
    db.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1002', '启用、禁用操作出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '启用、禁用操作成功。', null, null));
        }
    });
}

/**
 * 批量保存节点操作
 * @param items
 * @param cb
 */
exports.saveProcessItems = function(items, cb) {
    model.$ProcessItem.create(items, function (err, docs) {
        if(err){
            cb(utils.returnMsg(false, '1003', '保存时出现异常。', null, error));
        }
        else{
            cb(utils.returnMsg(true, '0000', '保存操作成功。', null, null));
        }
    });
}

/**
 * 根据流程实例id获取节点信息
 * @param id
 * @param cb
 */
exports.getProcessItemsById = function(id,cb){
    var query = model.$ProcessItem.find({});
    query.where('proc_define_id',id);
    query.exec(function(error,rs){
        if(error){
            cb(exports.returnMsg(false, '1000', '获取流程节点信息时出现异常。', null, error));
        }else{
            cb(rs);
        }
    });
}

/**
 * 删除节点配置
 * @param conditions
 * @param data
 * @param cb
 */
exports.deleteProcessItem = function(conditions, cb) {
    model.$ProcessItem.remove(conditions, function (error) {
        if (error) {
            cb(utils.returnMsg(false, '1000', '删除节点信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '删除节点信息成功。', null, null));
        }
    });
}

/**
 * 根据流程实例id获取流程实例信息
 * @param id
 * @param cb
 */
exports.getProcessDefineById = function(id,cb) {
    var query = model.$ProcessDefine.find({});
    query.where('_id', id);
    query.exec(function (error, rs) {
        if (error) {
            cb(exports.returnMsg(false, '1000', '获取流程实例信息时出现异常。', null, error));
        } else {
            cb(rs[0]._doc);
        }
    });
}

/**
 * 启动流程
 * @param proc_title            : 流程标题
 * @param proc_code             : 流程编码
 * @param proc_ver              : 流程版本号
 * @param proc_start_user       : 发起人
 * @param proc_start_user_name  : 发起人姓名
 * @param proc_inst_task_remark : 意见
 * @param proc_assignee_id      : 下一个处理人ID
 * @param proc_assignee_name    : 下一个处理人姓名
 * @param proc_route_code       : 决策路径
 * @param proc_params           : 参数
 * @param cb                    : 回调函数
 */
exports.startProcess = function(proc_title,
                                proc_code,
                                proc_ver,
                                proc_start_user,
                                proc_start_user_name,
                                proc_inst_task_remark,
                                proc_assignee_id,
                                proc_assignee_name,
                                proc_route_code,
                                proc_params,
                                cb) {

    // 获取流程code的最新版
    model.$ProcessDefine.find({proc_code:proc_code,proc_ver:proc_ver,proc_status:1}).exec(function(err,rs) {
        if (err) {
            cb({'success': false, 'code': '1001', 'msg': '获取编码对应的流程实例时出现异常'});
        } else {
            if(rs.length == 0){
                cb({'success': false, 'code': '1002', 'msg': '未获取到编码和版本号对应的流程实例'});
            }else{
                var processChart = rs[0]._doc.proc_define;
                if(!processChart){
                    cb({'success': false, 'code': '1003', 'msg': '流程定义信息有误，因为：未绘制流程图例'});
                }else {
                    var process_define_info = JSON.parse(rs[0]._doc.proc_define);
                    // 获取定义中的nodes及lines
                    var process_nodes = process_define_info['nodes'];
                    var process_lines = process_define_info['lines'];
                    // 判断定义中的nodes及lines是否为空
                    if(isEmptyObject(process_nodes) || isEmptyObject(process_lines)){
                        cb({'success': false, 'code': '1004', 'msg': '流程定义信息有误，因为：未绘制流程节点或流程线'});
                    }else{
                        // 获取流程实例的起点编码
                        var start_node_code = getStartNodeCode(process_nodes);
                        if(!start_node_code){
                            cb({'success': false, 'code': '1005', 'msg': '流程定义信息有误，因为：未绘制流程起点'});
                        }else{
                            // 获取流程实例的起点的节点信息
                            var start_node = getNodeInfo(process_nodes, start_node_code);
                            var start_node_name = start_node.name;
                            var start_node_type = start_node.type;
                            // 获取起点后的第一个任务节点信息
                            var first_task_nodes = getSubNode(process_nodes, process_lines, start_node_code);
                            if (first_task_nodes.length == 1) {

                                // 获取第一个任务节点
                                var first_task_node = first_task_nodes[0];
                                // 获取第一个任务节点的编码、名称、类型
                                var first_task_code = first_task_node.node_code;
                                var first_task_name = getNodeInfo(process_nodes, first_task_code).name;
                                var first_task_type = first_task_node.node_type;

                                // 获取第一个任务节点的后续节点
                                var second_task_nodes = getSubNode(process_nodes, process_lines, first_task_code);
                                // 检查后续节点是否有多个
                                var second_task_nodes_length = second_task_nodes.length;
                                if (second_task_nodes_length == 1) {
                                    // 获取后续节点信息
                                    var next_node = second_task_nodes[0];
                                    var next_node_info = getNodeInfo(process_nodes, next_node.node_code);

                                    // 检查next_node是否是end节点
                                    if(next_node_info.node_type == 'end round'){

                                        var processInstEntity = {};
                                        processInstEntity.proc_id = rs[0]._doc.proc_id;
                                        processInstEntity.proc_code = rs[0]._doc.proc_code;
                                        processInstEntity.proc_name = rs[0]._doc.proc_name;
                                        processInstEntity.proc_ver = rs[0]._doc.proc_ver;
                                        processInstEntity.proc_title = proc_title;
                                        processInstEntity.proc_cur_task = next_node.node_code;
                                        processInstEntity.proc_cur_task_name = next_node_info.name;
                                        processInstEntity.proc_start_user = proc_start_user;
                                        processInstEntity.proc_start_user_name = proc_start_user_name;
                                        processInstEntity.proc_start_time = new Date();
                                        processInstEntity.proc_cur_user = '';
                                        processInstEntity.proc_cur_user_name = '';
                                        processInstEntity.proc_cur_arrive_time = new Date();
                                        processInstEntity.proc_params = '';
                                        processInstEntity.proc_inst_status = 0;// 流程结束

                                        //保存流程流转当前信息
                                        var proc_inst_arr = [];
                                        proc_inst_arr.push(processInstEntity);
                                        model.$ProcessInst.create(proc_inst_arr, function (err, docs) {
                                            if(err){
                                                cb({'success': false, 'code': '1009', 'msg': '保存流程信息出现异常'});
                                            }else{
                                                var proc_inst_task_arr = [];
                                                //构造起点保存信息
                                                var processInstTaskEntity = {};
                                                processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                processInstTaskEntity.proc_inst_task_code = start_node_code;
                                                processInstTaskEntity.proc_inst_task_name = start_node_name;
                                                processInstTaskEntity.proc_inst_task_type = start_node_type;
                                                processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                processInstTaskEntity.proc_inst_task_status = 0;
                                                processInstTaskEntity.proc_inst_task_assignee = '';
                                                processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                processInstTaskEntity.proc_inst_task_params = '';
                                                processInstTaskEntity.proc_inst_task_claim = 0;
                                                processInstTaskEntity.proc_inst_task_sign = 0;
                                                processInstTaskEntity.proc_inst_task_sms = 0;
                                                processInstTaskEntity.proc_inst_task_remark = '';

                                                proc_inst_task_arr.push(processInstTaskEntity);
                                                //构造第一个人工节点的保存信息
                                                var processInstTaskEntity = {};
                                                processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                processInstTaskEntity.proc_inst_task_code = first_task_code;
                                                processInstTaskEntity.proc_inst_task_name = first_task_name;
                                                processInstTaskEntity.proc_inst_task_type = first_task_type;
                                                processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                processInstTaskEntity.proc_inst_task_status = 0;
                                                processInstTaskEntity.proc_inst_task_assignee = proc_start_user;
                                                processInstTaskEntity.proc_inst_task_assignee_name = proc_start_user_name;
                                                processInstTaskEntity.proc_inst_task_params = '';
                                                processInstTaskEntity.proc_inst_task_claim = 0;
                                                processInstTaskEntity.proc_inst_task_sign = 0;
                                                processInstTaskEntity.proc_inst_task_sms = 0;
                                                processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                proc_inst_task_arr.push(processInstTaskEntity);
                                                //构造终点的保存信息
                                                var processInstTaskEntity = {};
                                                processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                processInstTaskEntity.proc_inst_task_status = 0;
                                                processInstTaskEntity.proc_inst_task_assignee = '';
                                                processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                processInstTaskEntity.proc_inst_task_params = '';
                                                processInstTaskEntity.proc_inst_task_claim = 0;
                                                processInstTaskEntity.proc_inst_task_sign = 0;
                                                processInstTaskEntity.proc_inst_task_sms = 0;
                                                processInstTaskEntity.proc_inst_task_remark = '';

                                                proc_inst_task_arr.push(processInstTaskEntity);
                                                //保存流程流转历史信息
                                                model.$ProcessInstTask.create(proc_inst_task_arr, function (err, docs) {
                                                    if(err){
                                                        cb({'success': false, 'code': '1010', 'msg': '保存流程信息出现异常'});
                                                    }else{
                                                        cb({'success': true, 'code': '0000', 'msg': '启动流程成功'});
                                                    }
                                                });
                                            }
                                        });
                                    }else{
                                        var processInstEntity = {};
                                        processInstEntity.proc_id = rs[0]._doc.proc_id;
                                        processInstEntity.proc_code = rs[0]._doc.proc_code;
                                        processInstEntity.proc_name = rs[0]._doc.proc_name;
                                        processInstEntity.proc_ver = rs[0]._doc.proc_ver;
                                        processInstEntity.proc_title = proc_title;
                                        processInstEntity.proc_cur_task = next_node.node_code;
                                        processInstEntity.proc_cur_task_name = next_node_info.name;
                                        processInstEntity.proc_start_user = proc_start_user;
                                        processInstEntity.proc_start_user_name = proc_start_user_name;
                                        processInstEntity.proc_start_time = new Date();
                                        processInstEntity.proc_cur_user = proc_assignee_id;
                                        processInstEntity.proc_cur_user_name = proc_assignee_name;
                                        processInstEntity.proc_cur_arrive_time = new Date();
                                        processInstEntity.proc_params = '';
                                        processInstEntity.proc_inst_status = 1;// 流程流转中

                                        //保存流程流转当前信息
                                        var proc_inst_arr = [];
                                        proc_inst_arr.push(processInstEntity);
                                        model.$ProcessInst.create(proc_inst_arr, function (err, docs) {
                                            if (err) {
                                                cb({'success': false, 'code': '1009', 'msg': '保存流程信息出现异常'});
                                            } else {
                                                var proc_inst_task_arr = [];
                                                //构造起点保存信息
                                                var processInstTaskEntity = {};
                                                processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                processInstTaskEntity.proc_inst_task_code = start_node_code;
                                                processInstTaskEntity.proc_inst_task_name = start_node_name;
                                                processInstTaskEntity.proc_inst_task_type = start_node_type;
                                                processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                processInstTaskEntity.proc_inst_task_status = 0;
                                                processInstTaskEntity.proc_inst_task_assignee = '';
                                                processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                processInstTaskEntity.proc_inst_task_params = '';
                                                processInstTaskEntity.proc_inst_task_claim = 0;
                                                processInstTaskEntity.proc_inst_task_sign = 0;
                                                processInstTaskEntity.proc_inst_task_sms = 0;
                                                processInstTaskEntity.proc_inst_task_remark = '';

                                                proc_inst_task_arr.push(processInstTaskEntity);
                                                //构造第一个人工节点的保存信息
                                                var processInstTaskEntity = {};
                                                processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                processInstTaskEntity.proc_inst_task_code = first_task_code;
                                                processInstTaskEntity.proc_inst_task_name = first_task_name;
                                                processInstTaskEntity.proc_inst_task_type = first_task_type;
                                                processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                processInstTaskEntity.proc_inst_task_status = 0;
                                                processInstTaskEntity.proc_inst_task_assignee = proc_start_user;
                                                processInstTaskEntity.proc_inst_task_assignee_name = proc_start_user_name;
                                                processInstTaskEntity.proc_inst_task_params = '';
                                                processInstTaskEntity.proc_inst_task_claim = 0;
                                                processInstTaskEntity.proc_inst_task_sign = 0;
                                                processInstTaskEntity.proc_inst_task_sms = 0;
                                                processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                proc_inst_task_arr.push(processInstTaskEntity);
                                                //构造第二个人工节点的保存信息
                                                var processInstTaskEntity = {};
                                                processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                processInstTaskEntity.proc_inst_task_complete_time = null;
                                                processInstTaskEntity.proc_inst_task_status = 1;
                                                processInstTaskEntity.proc_inst_task_assignee = proc_assignee_id;
                                                processInstTaskEntity.proc_inst_task_assignee_name = proc_assignee_name;
                                                processInstTaskEntity.proc_inst_task_params = '';
                                                processInstTaskEntity.proc_inst_task_claim = 0;
                                                processInstTaskEntity.proc_inst_task_sign = 0;
                                                processInstTaskEntity.proc_inst_task_sms = 0;
                                                processInstTaskEntity.proc_inst_task_remark = '';

                                                proc_inst_task_arr.push(processInstTaskEntity);
                                                //保存流程流转历史信息
                                                model.$ProcessInstTask.create(proc_inst_task_arr, function (err, docs) {
                                                    if (err) {
                                                        cb({'success': false, 'code': '1010', 'msg': '保存流程信息出现异常'});
                                                    } else {
                                                        cb({'success': true, 'code': '0000', 'msg': '启动流程成功'});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }else if(second_task_nodes_length > 1) {
                                    // 按决策路径,选择路径走向
                                    if (proc_route_code) {
                                        // 获取后续节点信息
                                        var next_node = getRouteNode(second_task_nodes, proc_route_code);
                                        var next_node_info = getNodeInfo(process_nodes, next_node.node_code);

                                        // 检查next_node是否是end节点
                                        if(next_node.node_type == 'end round'){
                                            var processInstEntity = {};
                                            processInstEntity.proc_id = rs[0]._doc.proc_id;
                                            processInstEntity.proc_code = rs[0]._doc.proc_code;
                                            processInstEntity.proc_name = rs[0]._doc.proc_name;
                                            processInstEntity.proc_ver = rs[0]._doc.proc_ver;
                                            processInstEntity.proc_title = proc_title;
                                            processInstEntity.proc_cur_task = next_node.node_code;
                                            processInstEntity.proc_cur_task_name = next_node_info.name;
                                            processInstEntity.proc_start_user = proc_start_user;
                                            processInstEntity.proc_start_user_name = proc_start_user_name;
                                            processInstEntity.proc_start_time = new Date();
                                            processInstEntity.proc_cur_user = '';
                                            processInstEntity.proc_cur_user_name = '';
                                            processInstEntity.proc_cur_arrive_time = new Date();
                                            processInstEntity.proc_params = '';
                                            processInstEntity.proc_inst_status = 0;// 流程结束

                                            //保存流程流转当前信息
                                            var proc_inst_arr = [];
                                            proc_inst_arr.push(processInstEntity);
                                            model.$ProcessInst.create(proc_inst_arr, function (err, docs) {
                                                if(err){
                                                    cb({'success': false, 'code': '1009', 'msg': '保存流程信息出现异常'});
                                                }else{
                                                    var proc_inst_task_arr = [];
                                                    //构造起点保存信息
                                                    var processInstTaskEntity = {};
                                                    processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                    processInstTaskEntity.proc_inst_task_code = start_node_code;
                                                    processInstTaskEntity.proc_inst_task_name = start_node_name;
                                                    processInstTaskEntity.proc_inst_task_type = start_node_type;
                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_status = 0;
                                                    processInstTaskEntity.proc_inst_task_assignee = '';
                                                    processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                    processInstTaskEntity.proc_inst_task_remark = '';

                                                    proc_inst_task_arr.push(processInstTaskEntity);
                                                    //构造第一个人工节点的保存信息
                                                    var processInstTaskEntity = {};
                                                    processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                    processInstTaskEntity.proc_inst_task_code = first_task_code;
                                                    processInstTaskEntity.proc_inst_task_name = first_task_name;
                                                    processInstTaskEntity.proc_inst_task_type = first_task_type;
                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_status = 0;
                                                    processInstTaskEntity.proc_inst_task_assignee = proc_start_user;
                                                    processInstTaskEntity.proc_inst_task_assignee_name = proc_start_user_name;
                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                    processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                    proc_inst_task_arr.push(processInstTaskEntity);
                                                    //构造终点的保存信息
                                                    var processInstTaskEntity = {};
                                                    processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                    processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                    processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                    processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_status = 0;
                                                    processInstTaskEntity.proc_inst_task_assignee = '';
                                                    processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                    processInstTaskEntity.proc_inst_task_remark = '';

                                                    proc_inst_task_arr.push(processInstTaskEntity);
                                                    //保存流程流转历史信息
                                                    model.$ProcessInstTask.create(proc_inst_task_arr, function (err, docs) {
                                                        if(err){
                                                            cb({'success': false, 'code': '1010', 'msg': '保存流程信息出现异常'});
                                                        }else{
                                                            cb({'success': true, 'code': '0000', 'msg': '启动流程成功'});
                                                        }
                                                    });
                                                }
                                            });
                                        }else {
                                            var processInstEntity = {};
                                            processInstEntity.proc_id = rs[0]._doc.proc_id;
                                            processInstEntity.proc_code = rs[0]._doc.proc_code;
                                            processInstEntity.proc_name = rs[0]._doc.proc_name;
                                            processInstEntity.proc_ver = rs[0]._doc.proc_ver;
                                            processInstEntity.proc_title = proc_title;
                                            processInstEntity.proc_cur_task = next_node.node_code;
                                            processInstEntity.proc_cur_task_name = next_node_info.name;
                                            processInstEntity.proc_start_user = proc_start_user;
                                            processInstEntity.proc_start_user_name = proc_start_user_name;
                                            processInstEntity.proc_start_time = new Date();
                                            processInstEntity.proc_cur_user = proc_assignee_id;
                                            processInstEntity.proc_cur_user_name = proc_assignee_name;
                                            processInstEntity.proc_cur_arrive_time = new Date();
                                            processInstEntity.proc_params = '';
                                            processInstEntity.proc_inst_status = 1;// 流程流转中

                                            //保存流程流转当前信息
                                            var proc_inst_arr = [];
                                            proc_inst_arr.push(processInstEntity);
                                            model.$ProcessInst.create(proc_inst_arr, function (err, docs) {
                                                if (err) {
                                                    cb({'success': false, 'code': '1009', 'msg': '保存流程信息出现异常'});
                                                } else {
                                                    var proc_inst_task_arr = [];
                                                    //构造起点保存信息
                                                    var processInstTaskEntity = {};
                                                    processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                    processInstTaskEntity.proc_inst_task_code = start_node_code;
                                                    processInstTaskEntity.proc_inst_task_name = start_node_name;
                                                    processInstTaskEntity.proc_inst_task_type = start_node_type;
                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_status = 0;
                                                    processInstTaskEntity.proc_inst_task_assignee = '';
                                                    processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                    processInstTaskEntity.proc_inst_task_remark = '';

                                                    proc_inst_task_arr.push(processInstTaskEntity);
                                                    //构造第一个人工节点的保存信息
                                                    var processInstTaskEntity = {};
                                                    processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                    processInstTaskEntity.proc_inst_task_code = first_task_code;
                                                    processInstTaskEntity.proc_inst_task_name = first_task_name;
                                                    processInstTaskEntity.proc_inst_task_type = first_task_type;
                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_status = 0;
                                                    processInstTaskEntity.proc_inst_task_assignee = proc_start_user;
                                                    processInstTaskEntity.proc_inst_task_assignee_name = proc_start_user_name;
                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                    processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                    proc_inst_task_arr.push(processInstTaskEntity);
                                                    //构造下一个节点的保存信息
                                                    var processInstTaskEntity = {};
                                                    processInstTaskEntity.proc_inst_id = docs[0]._doc._id;
                                                    processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                    processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                    processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                    processInstTaskEntity.proc_inst_task_complete_time = null;
                                                    processInstTaskEntity.proc_inst_task_status = 1;
                                                    processInstTaskEntity.proc_inst_task_assignee = proc_assignee_id;
                                                    processInstTaskEntity.proc_inst_task_assignee_name = proc_assignee_name;
                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                    processInstTaskEntity.proc_inst_task_remark = '';

                                                    proc_inst_task_arr.push(processInstTaskEntity);
                                                    //保存流程流转历史信息
                                                    model.$ProcessInstTask.create(proc_inst_task_arr, function (err, docs) {
                                                        if (err) {
                                                            cb({'success': false, 'code': '1010', 'msg': '保存流程信息出现异常'});
                                                        } else {
                                                            cb({'success': true, 'code': '0000', 'msg': '启动流程成功'});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }else {
                                        cb({'success': false, 'code': '1007', 'msg': '流程流转有误，因为：多个后续节点，未设置流转方向'});
                                    }
                                }else {
                                    cb({'success': false, 'code': '1008', 'msg': '流程定义信息有误，因为：无后续节点'});
                                }
                            }else{
                                cb({'success': false, 'code': '1006', 'msg': '流程定义信息有误，因为：多个发起节点'});
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 * 获取流程实例起点编码
 * @param process_nodes
 * @returns {string}
 */
function getStartNodeCode(process_nodes) {
    for(var key in process_nodes) {
        if(process_nodes[key].type == 'start round') {
            return key;
        }
    }
}

/**
 * 处理流程
 * @param proc_code               :  流程编码
 * @param proc_inst_id            :  流程流转信息ID
 * @param proc_inst_task_code     :  流程当前节点编码
 * @param proc_inst_task_remark   :  流程处理意见
 * @param proc_assignee_id        :  流程处理人ID
 * @param proc_assignee_name      :  流程处理人名
 * @param proc_next_assignee_id   :  流程下一处理人ID
 * @param proc_next_assignee_name :  流程下一处理人名
 * @param proc_route_code         :  决策路径
 * @param proc_params             :  参数
 * @param cb                      :  回调函数
 */
exports.completeUserTask = function(proc_code,
                                    proc_inst_id,
                                    proc_inst_task_code,
                                    proc_inst_task_remark,
                                    proc_assignee_id,
                                    proc_assignee_name,
                                    proc_next_assignee_id,
                                    proc_next_assignee_name,
                                    proc_route_code,
                                    proc_params,
                                    cb) {

    // 检查当前节点信息是否一致
    // 获取流程流转信息中的节点信息
    model.$ProcessInstTask.find({'proc_inst_id':proc_inst_id,
                                 'proc_inst_task_code':proc_inst_task_code,
                                 'proc_inst_task_status':1}).exec(function(err1,rs1){
        if(err1){
            cb({'success': false, 'code': '1001', 'msg': '获取流程流转当前信息时出现异常'});
        }else{
            if(rs1.length == 1){
                var currentTaskInfo = rs1[0]._doc;
                model.$ProcessInst.find({_id:proc_inst_id}).exec(function(err2,rs2){
                    if(err2){
                        cb({'success': false, 'code': '1003', 'msg': '获取流程流转当前信息时出现异常'});
                    }else{
                        model.$ProcessDefine.find({_id:rs2[0]._doc.proc_id,proc_status:1}).exec(function(err,rs) {
                            if (err) {
                                cb({'success': false, 'code': '1004', 'msg': '获取流程实例时出现异常'});
                            } else {
                                if (rs.length == 0) {
                                    cb({'success': false, 'code': '1005', 'msg': '未获取到流程实例'});
                                } else {
                                    var processChart = rs[0]._doc.proc_define;
                                    if (!processChart) {
                                        cb({'success': false, 'code': '1006', 'msg': '流程定义信息有误，因为：未绘制流程图例'});
                                    } else {
                                        var process_define_info = JSON.parse(rs[0]._doc.proc_define);
                                        // 获取定义中的nodes及lines
                                        var process_nodes = process_define_info['nodes'];
                                        var process_lines = process_define_info['lines'];
                                        // 判断定义中的nodes及lines是否为空
                                        if (isEmptyObject(process_nodes) || isEmptyObject(process_lines)) {
                                            cb({'success': false, 'code': '1007', 'msg': '流程定义信息有误，因为：未绘制流程节点或流程线'});
                                        } else {
                                            // 获取流程下一步流转信息
                                            var next_nodes = getSubNode(process_nodes, process_lines, proc_inst_task_code);
                                            var next_nodes_length = next_nodes.length;
                                            if(next_nodes_length == 1) {
                                                var next_node = next_nodes[0];
                                                var next_node_info = getNodeInfo(process_nodes, next_node.node_code);
                                                if(next_node.node_type == 'end round') {// 流程为开始->人工节点->结束

                                                    var processInstEntity = {};
                                                    processInstEntity.proc_cur_task = next_node.node_code;
                                                    processInstEntity.proc_cur_task_name = next_node_info.name;
                                                    processInstEntity.proc_cur_user = '';
                                                    processInstEntity.proc_cur_user_name = '';
                                                    processInstEntity.proc_cur_arrive_time = new Date();
                                                    processInstEntity.proc_inst_status = 0;// 流程结束
                                                    //更新流程当前状态
                                                    model.$ProcessInst.update({_id: proc_inst_id}, {$set: processInstEntity}, {}, function (error) {
                                                        if(error) {
                                                            cb({'success': false, 'code': '1008', 'msg': '更新流程信息时出现异常'});
                                                        } else {
                                                            var processInstTaskEntity = {};
                                                            processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                            processInstTaskEntity.proc_inst_task_status = 0;
                                                            processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                            //更新流程历史
                                                            model.$ProcessInstTask.update({_id: currentTaskInfo._id}, {$set: processInstTaskEntity}, {}, function (error){
                                                                if(error) {
                                                                    cb({'success': false, 'code': '1009', 'msg': '更新流程信息时出现异常'});
                                                                } else {
                                                                    //构造终点的保存信息
                                                                    var processInstTaskEntity = {};
                                                                    processInstTaskEntity.proc_inst_id = currentTaskInfo._id;
                                                                    processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                                    processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                                    processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                                    processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                                    processInstTaskEntity.proc_inst_task_status = 0;
                                                                    processInstTaskEntity.proc_inst_task_assignee = '';
                                                                    processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                                    processInstTaskEntity.proc_inst_task_remark = '';

                                                                    //保存终点信息
                                                                    model.$ProcessInstTask(processInstTaskEntity).save(function(err){
                                                                        if(error) {
                                                                            cb({'success': false, 'code': '1010', 'msg': '保存流程终点信息时出现异常。'});
                                                                        } else {
                                                                            cb({'success': true, 'code': '0000', 'msg': '流程处理成功'});
                                                                        }
                                                                    });

                                                                }
                                                            });
                                                        }
                                                    });
                                                }else{
                                                    var processInstEntity = {};
                                                    processInstEntity.proc_cur_task = next_node.node_code;
                                                    processInstEntity.proc_cur_task_name = next_node_info.name;
                                                    processInstEntity.proc_cur_user = proc_next_assignee_id;
                                                    processInstEntity.proc_cur_user_name = proc_next_assignee_name;
                                                    processInstEntity.proc_cur_arrive_time = new Date();
                                                    processInstEntity.proc_inst_status = 1;// 流程流转中
                                                    //更新流程当前状态
                                                    model.$ProcessInst.update({_id: proc_inst_id}, {$set: processInstEntity}, {}, function (error) {
                                                        if(error) {
                                                            cb({'success': false, 'code': '1008', 'msg': '更新流程信息时出现异常'});
                                                        } else {
                                                            var processInstTaskEntity = {};
                                                            processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                            processInstTaskEntity.proc_inst_task_status = 0;
                                                            processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                            //更新流程历史
                                                            model.$ProcessInstTask.update({_id: currentTaskInfo._id}, {$set: processInstTaskEntity}, {}, function (error){
                                                                if(error) {
                                                                    cb({'success': false, 'code': '1009', 'msg': '更新流程信息时出现异常'});
                                                                } else {
                                                                    //构造下一个节点的保存信息
                                                                    var processInstTaskEntity = {};
                                                                    processInstTaskEntity.proc_inst_id = currentTaskInfo._id;
                                                                    processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                                    processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                                    processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                                    processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                                    processInstTaskEntity.proc_inst_task_complete_time = null;
                                                                    processInstTaskEntity.proc_inst_task_status = 1;
                                                                    processInstTaskEntity.proc_inst_task_assignee = proc_next_assignee_id;
                                                                    processInstTaskEntity.proc_inst_task_assignee_name = proc_next_assignee_name;
                                                                    processInstTaskEntity.proc_inst_task_params = '';
                                                                    processInstTaskEntity.proc_inst_task_claim = 0;
                                                                    processInstTaskEntity.proc_inst_task_sign = 0;
                                                                    processInstTaskEntity.proc_inst_task_sms = 0;
                                                                    processInstTaskEntity.proc_inst_task_remark = '';

                                                                    //保存下一个节点的信息
                                                                    model.$ProcessInstTask(processInstTaskEntity).save(function(err){
                                                                        if(error) {
                                                                            cb({'success': false, 'code': '1010', 'msg': '保存流程节点信息时出现异常。'});
                                                                        } else {
                                                                            cb({'success': true, 'code': '0000', 'msg': '流程处理成功'});
                                                                        }
                                                                    });

                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            } else if(next_nodes_length > 1) {
                                                // 按选择路径走向
                                                if(proc_route_code) {
                                                    var next_node = getRouteNode(next_nodes, proc_route_code);
                                                    var next_node_info = getNodeInfo(process_nodes, next_node.node_code);

                                                    if(next_node.node_type == 'end round') {// 流程为开始->人工节点->结束
                                                        var processInstEntity = {};
                                                        processInstEntity.proc_cur_task = next_node.node_code;
                                                        processInstEntity.proc_cur_task_name = next_node_info.name;
                                                        processInstEntity.proc_cur_user = '';
                                                        processInstEntity.proc_cur_user_name = '';
                                                        processInstEntity.proc_cur_arrive_time = new Date();
                                                        processInstEntity.proc_inst_status = 0;// 流程结束
                                                        //更新流程当前状态
                                                        model.$ProcessInst.update({_id: proc_inst_id}, {$set: processInstEntity}, {}, function (error) {
                                                            if(error) {
                                                                cb({'success': false, 'code': '1008', 'msg': '更新流程信息时出现异常'});
                                                            } else {
                                                                var processInstTaskEntity = {};
                                                                processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                                processInstTaskEntity.proc_inst_task_status = 0;
                                                                processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                                //更新流程历史
                                                                model.$ProcessInstTask.update({_id: currentTaskInfo._id}, {$set: processInstTaskEntity}, {}, function (error){
                                                                    if(error) {
                                                                        cb({'success': false, 'code': '1009', 'msg': '更新流程信息时出现异常'});
                                                                    } else {
                                                                        //构造终点的保存信息
                                                                        var processInstTaskEntity = {};
                                                                        processInstTaskEntity.proc_inst_id = currentTaskInfo._id;
                                                                        processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                                        processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                                        processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                                        processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                                        processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                                        processInstTaskEntity.proc_inst_task_status = 0;
                                                                        processInstTaskEntity.proc_inst_task_assignee = '';
                                                                        processInstTaskEntity.proc_inst_task_assignee_name = '';
                                                                        processInstTaskEntity.proc_inst_task_params = '';
                                                                        processInstTaskEntity.proc_inst_task_claim = 0;
                                                                        processInstTaskEntity.proc_inst_task_sign = 0;
                                                                        processInstTaskEntity.proc_inst_task_sms = 0;
                                                                        processInstTaskEntity.proc_inst_task_remark = '';

                                                                        //保存终点信息
                                                                        model.$ProcessInstTask(processInstTaskEntity).save(function(err){
                                                                            if(error) {
                                                                                cb({'success': false, 'code': '1010', 'msg': '保存流程终点信息时出现异常。'});
                                                                            } else {
                                                                                cb({'success': true, 'code': '0000', 'msg': '流程处理成功'});
                                                                            }
                                                                        });

                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }else{
                                                        var processInstEntity = {};
                                                        processInstEntity.proc_cur_task = next_node.node_code;
                                                        processInstEntity.proc_cur_task_name = next_node_info.name;
                                                        processInstEntity.proc_cur_user = proc_next_assignee_id;
                                                        processInstEntity.proc_cur_user_name = proc_next_assignee_name;
                                                        processInstEntity.proc_cur_arrive_time = new Date();
                                                        processInstEntity.proc_inst_status = 1;// 流程流转中
                                                        //更新流程当前状态
                                                        model.$ProcessInst.update({_id: proc_inst_id}, {$set: processInstEntity}, {}, function (error) {
                                                            if(error) {
                                                                cb({'success': false, 'code': '1008', 'msg': '更新流程信息时出现异常'});
                                                            } else {
                                                                var processInstTaskEntity = {};
                                                                processInstTaskEntity.proc_inst_task_complete_time = new Date();
                                                                processInstTaskEntity.proc_inst_task_status = 0;
                                                                processInstTaskEntity.proc_inst_task_remark = proc_inst_task_remark;

                                                                //更新流程历史
                                                                model.$ProcessInstTask.update({_id: currentTaskInfo._id}, {$set: processInstTaskEntity}, {}, function (error){
                                                                    if(error) {
                                                                        cb({'success': false, 'code': '1009', 'msg': '更新流程信息时出现异常'});
                                                                    } else {
                                                                        //构造下一个节点的保存信息
                                                                        var processInstTaskEntity = {};
                                                                        processInstTaskEntity.proc_inst_id = currentTaskInfo._id;
                                                                        processInstTaskEntity.proc_inst_task_code = next_node.node_code;
                                                                        processInstTaskEntity.proc_inst_task_name = next_node_info.name;
                                                                        processInstTaskEntity.proc_inst_task_type = next_node_info.type;
                                                                        processInstTaskEntity.proc_inst_task_arrive_time = new Date();
                                                                        processInstTaskEntity.proc_inst_task_complete_time = null;
                                                                        processInstTaskEntity.proc_inst_task_status = 1;
                                                                        processInstTaskEntity.proc_inst_task_assignee = proc_next_assignee_id;
                                                                        processInstTaskEntity.proc_inst_task_assignee_name = proc_next_assignee_name;
                                                                        processInstTaskEntity.proc_inst_task_params = '';
                                                                        processInstTaskEntity.proc_inst_task_claim = 0;
                                                                        processInstTaskEntity.proc_inst_task_sign = 0;
                                                                        processInstTaskEntity.proc_inst_task_sms = 0;
                                                                        processInstTaskEntity.proc_inst_task_remark = '';

                                                                        //保存下一个节点的信息
                                                                        model.$ProcessInstTask(processInstTaskEntity).save(function(err){
                                                                            if(error) {
                                                                                cb({'success': false, 'code': '1010', 'msg': '保存流程节点信息时出现异常。'});
                                                                            } else {
                                                                                cb({'success': true, 'code': '0000', 'msg': '流程处理成功'});
                                                                            }
                                                                        });

                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    cb({'success': false, 'code': '1012', 'msg': '流程流转有误，因为：多个后续节点，未设置流转方向'});
                                                }
                                            } else {
                                                cb({'success': false, 'code': '1011', 'msg': '流程定义信息有误，因为：无后续节点'});
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            }else{
                cb({'success': false, 'code': '1002', 'msg': '未能找到流程实例'+proc_inst_id+'对应的流转信息'});
            }
        }
    });
}

/**
 * 根据流程节点编码，获取流程节点信息
 * @param process_nodes
 * @param node_code
 * @returns {*}
 */
function getNodeInfo(process_nodes, node_code) {
    return process_nodes[node_code];
}

/**
 * 根据流程节点编码，获取流程节点的后续连线及连线的目标节点数组
 * @param process_nodes
 * @param process_lines
 * @param node_code
 * @returns {Array}
 */
function getSubNode(process_nodes, process_lines, node_code) {
    var sub_line_node_array = [];
    // 获取连线
    for(var key in process_lines) {
        if(process_lines[key].from == node_code) {
            sub_line_node_array.push({
                line_code:key,
                node_code:process_lines[key].to,
                node_type:getNodeInfo(process_nodes, process_lines[key].to).type
            });
        }
    }
    return sub_line_node_array;
}

/**
 * 根据决策路径，获取走向节点
 * @param task_nodes
 * @param line_code
 * @returns {*}
 */
function getRouteNode(task_nodes, line_code) {
    for(var i =0; i < task_nodes.length; i++) {
        var task_node = task_nodes[i];
        if(task_node.line_code == line_code) {
            return task_node;
        }
    }
}

/**
 * 判断对象是否为空
 * @param o
 * @returns {boolean}
 */
function isEmptyObject(o) {
    for (var i in o)
        return false;
    return true;
}