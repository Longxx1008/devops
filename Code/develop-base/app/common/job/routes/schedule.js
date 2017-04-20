/**
 * Created by zhaojing on 2016/9/18.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var scheduleService = require('../services/schedule_service');
var scheduleUtil = require('../utils/schedule_util')

router.route('/')

    // -------------------------------query查询任务列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var filterParam1 = req.query.filterParam1;
        var filterParam2 = req.query.filterParam2;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        if(filterParam1){
            conditionMap.schedule_status = filterParam1;
        }
        if(filterParam2){
            conditionMap['$or'] = [{'schedule_name':new RegExp(filterParam2)},{'schedule_code':new RegExp(filterParam2)},{'schedule_js_fun':new RegExp(filterParam2)}];
        }
        // 调用分页
        scheduleService.getScheduleList(page, length, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------create添加任务属性-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var schedule_name = req.body.schedule_name;//任务名
        var schedule_code = req.body.schedule_code;//任务编码
        var schedule_cron = req.body.schedule_cron;//任务表达式
        var schedule_date = req.body.schedule_date;//任务具体执行日期
        schedule_date = schedule_date.replace(/\s/ig,'');
        schedule_date = schedule_date.replace('/\r\n/g','');
        var schedule_js_path = req.body.schedule_js_path;//执行任务的js文件路径
        var schedule_js_fun = req.body.schedule_js_fun;//执行任务的js方法
        var schedule_ip = req.body.schedule_ip;//执行任务的服务器ip地址

        // 验证任务名是否为空
        if(!schedule_name) {
            utils.respMsg(res, false, '2001', '任务名不能为空。', null, null);
            return;
        }
        // 验证任务编码是否为空
        if(!schedule_code) {
            utils.respMsg(res, false, '2002', '任务编码不能为空。', null, null);
            return;
        }
        // 验证任务表达式是否为空
        if(!schedule_cron) {
            utils.respMsg(res, false, '2003', '任务表达式不能为空。', null, null);
            return;
        }
        // 验证js文件路径是否为空
        if(!schedule_js_path) {
            utils.respMsg(res, false, '2004', 'js文件路径不能为空。', null, null);
            return;
        }
        // 验证js方法是否为空
        if(!schedule_js_fun) {
            utils.respMsg(res, false, '2005', 'js方法名不能为空。', null, null);
            return;
        }
        // 验证服务器ip地址是否为空
        if(!schedule_ip) {
            utils.respMsg(res, false, '2006', '服务器ip地址不能为空。', null, null);
            return;
        }
        //构造任务保存参数
        var scheduleEntity = {};
        scheduleEntity.schedule_name = schedule_name;
        scheduleEntity.schedule_code = schedule_code;
        scheduleEntity.schedule_cron = schedule_cron;
        scheduleEntity.schedule_date = schedule_date != ''?schedule_date.split(";"):'';
        scheduleEntity.schedule_js_path = schedule_js_path;
        scheduleEntity.schedule_js_fun = schedule_js_fun;
        scheduleEntity.schedule_ip = schedule_ip.split(";");
        scheduleEntity.schedule_status = 0;
        scheduleEntity.schedule_create_time = new Date();
        scheduleEntity.schedule_creator = req.session.current_user.user_name;
        // 调用业务层保存方法
        scheduleService.saveSchedule(scheduleEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/:id')
    // -------------------------------update修改任务-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//任务id
        var schedule_name = req.body.schedule_name;//任务名
        var schedule_code = req.body.schedule_code;//任务编码
        var schedule_cron = req.body.schedule_cron;//任务表达式
        var schedule_date = req.body.schedule_date;//任务具体执行日期
        schedule_date = schedule_date.replace(/\s/ig,'');
        schedule_date = schedule_date.replace('/\r\n/g','');
        var schedule_js_path = req.body.schedule_js_path;//执行任务的js文件路径
        var schedule_js_fun = req.body.schedule_js_fun;//执行任务的js方法
        var schedule_ip = req.body.schedule_ip;//执行任务的服务器ip地址

        // 验证任务名是否为空
        if(!schedule_name) {
            utils.respMsg(res, false, '2001', '任务名不能为空。', null, null);
            return;
        }
        // 验证任务编码是否为空
        if(!schedule_code) {
            utils.respMsg(res, false, '2002', '任务编码不能为空。', null, null);
            return;
        }
        // 验证任务表达式是否为空
        if(!schedule_cron) {
            utils.respMsg(res, false, '2003', '任务表达式不能为空。', null, null);
            return;
        }
        // 验证js文件路径是否为空
        if(!schedule_js_path) {
            utils.respMsg(res, false, '2004', 'js文件路径不能为空。', null, null);
            return;
        }
        // 验证js方法是否为空
        if(!schedule_js_fun) {
            utils.respMsg(res, false, '2005', 'js方法名不能为空。', null, null);
            return;
        }
        // 验证服务器ip地址是否为空
        if(!schedule_ip) {
            utils.respMsg(res, false, '2006', '服务器ip地址不能为空。', null, null);
            return;
        }
        //构造任务保存参数
        var scheduleEntity = {};
        scheduleEntity.schedule_name = schedule_name;
        scheduleEntity.schedule_code = schedule_code;
        scheduleEntity.schedule_cron = schedule_cron;
        scheduleEntity.schedule_date = schedule_date != ''?schedule_date.split(";"):'';
        scheduleEntity.schedule_js_path = schedule_js_path;
        scheduleEntity.schedule_js_fun = schedule_js_fun;
        scheduleEntity.schedule_ip = schedule_ip.split(';');
        scheduleEntity.schedule_status = 0;
        scheduleEntity.schedule_create_time = new Date();
        scheduleEntity.schedule_creator = req.session.current_user.user_name;
        // 调用修改方法
        scheduleService.updateSchedule(id, scheduleEntity, function(result) {
            utils.respJsonData(res, result);
        });
    });

router.route('/startOrStop/:id')
    // -------------------------------启动或停用任务-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//任务id
        var schedule_status = req.body.schedule_status;//任务状态
        var jobInfo = req.body.jobInfo;
        var scheduleEntity = {};
        scheduleEntity.schedule_status = schedule_status;
        // 调用修改方法
        scheduleService.updateSchedule(id, scheduleEntity, function(result) {
            if(result.success){
                scheduleService.startOrStop(JSON.parse(jobInfo), schedule_status);
            }
            utils.respJsonData(res,result);
        });
    });

router.route('/log/')
    // -------------------------------query查询任务列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var schedule_id = req.query.schedule_id;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        conditionMap.schedule_id = schedule_id;
        // 调用分页
        scheduleService.getScheduleLogList(page, length, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    })

router.route('/look/')
    // -------------------------------query查询任务列表-------------------------------
    .get(function(req,res){
        utils.respJsonData(res, scheduleUtil.getAllJob());
    })

module.exports = router;