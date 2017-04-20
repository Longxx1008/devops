/**
 * Created by zhaojing on 2016/9/7.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var processMonitorService = require('../../bpm/services/process_monitor_service');

router.route('/')

    // -------------------------------query查询流程监控信息列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var filterParam1 = req.query.filterParam1;
        var filterParam2 = req.query.filterParam2;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        if(filterParam1){
            conditionMap.proc_inst_status = parseInt(filterParam1);
        }
        if(filterParam2){
            conditionMap['$or'] = [{'proc_title':new RegExp(filterParam2)},{'proc_code':new RegExp(filterParam2)},{'proc_name':new RegExp(filterParam2)}];
        }
        // 调用分页
        processMonitorService.getProcessMonitorList(page, length, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/getProcessInfo')

    // -------------------------------获取流程监控的流程图信息-------------------------------
    .get(function(req,res){
        var proc_inst_id = req.query.proc_inst_id;
        processMonitorService.getProcessInfo(proc_inst_id, function(rs){
            utils.respJsonData(res, rs);
        });
    });

module.exports = router;