/**
 * Created by zhaojing on 2016/9/7.
 */
var model = require('../models/process_model');
var utils = require('../../core/utils/app_utils');

/**
 * 获取流程监控信息列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getProcessMonitorList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, cb);
};

/**
 * 获取流程监控的流程图信息
 * @param proc_inst_id
 * @param cb
 */
exports.getProcessInfo = function(proc_inst_id, cb){
    var result = {};
    model.$ProcessInst.find({'_id':proc_inst_id}).exec(function(err1,rs1){
        if(err1){
            cb({'success': false, 'code': '1001', 'msg': '获取流程流转当前信息时出现异常'});
        }else{
            result.processInstInfo = rs1[0]._doc;
            model.$ProcessDefine.find({'_id':rs1[0]._doc.proc_id}).exec(function(err2,rs2){
                if(err2){
                    cb({'success': false, 'code': '1002', 'msg': '获取流程定义信息时出现异常'});
                }else{
                    result.processChart = rs2[0]._doc.proc_define;//获取流程图
                    model.$ProcessInstTask.find({'proc_inst_id':proc_inst_id}).exec(function(err3,rs3){
                        if(err3){
                            cb({'success': false, 'code': '1003', 'msg': '获取流程历史信息时出现异常'});
                        }else{
                            var processInstTasks = [];
                            for(var i=0;i<rs3.length;i++){
                                processInstTasks.push(rs3[i]._doc);
                            }
                            result.processInstTasks = processInstTasks;
                            cb({'success': true, 'code': '0000', 'result': result});
                        }
                    });
                }
            });
        }
    });
}
