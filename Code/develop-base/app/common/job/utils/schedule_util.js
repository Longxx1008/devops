/**
 * Created by zhaojing on 2016/9/20.
 */
var schedule = require("node-schedule");
var model = require('../models/schedule_model');

exports.initJobs = function (schedules) {
    var array = [];
    for(var i=0;i<schedules.length;i++){
        if(!schedule.scheduledJobs[schedules[i].id]) {
            array.push(schedules[i]);
            var o = {
                schedule_id: schedules[i].schedule_id,
                schedule_name: schedules[i].schedule_name,
                schedule_code:schedules[i].schedule_code,
                schedule_date:schedules[i].schedule_date,
                schedule_cron: schedules[i].schedule_cron,
                schedule_js_path: schedules[i].schedule_js_path,
                schedule_js_fun: schedules[i].schedule_js_fun,
                schedule_ip: schedules[i].schedule_ip
            };
            (function (o) {
                try{
                    var targetFile = require("../../../" + o.schedule_js_path);
                    schedule.scheduleJob(o.schedule_id, o.schedule_cron, targetFile[o.schedule_js_fun].bind(null, o, schedules[i].schedule_params));
                }catch(e){
                    console.log(e);
                }
            })(o);
        }
    }
    for(var i=0;i<array.length;i++){
        if(schedule.scheduledJobs[array[i].schedule_id]){
            //构造任务日志保存参数
            var scheduleLogEntity = {};
            scheduleLogEntity.schedule_id = array[i].schedule_id;
            scheduleLogEntity.schedule_ip = array[i].schedule_run_ip;
            scheduleLogEntity.schedule_start_time = new Date();
            scheduleLogEntity.schedule_status = 1;
            scheduleLogEntity.schedule_create_time = new Date();
            model.$ScheduleLog(scheduleLogEntity).save(function(error){
                if(error) {
                    console.error('save scheduleLog is error');
                }
            });
        }
    }
}

exports.addJob = function(scheduleInfo){
    var o = {
        schedule_id: scheduleInfo.schedule_id,
        schedule_name: scheduleInfo.schedule_name,
        schedule_code:scheduleInfo.schedule_code,
        schedule_cron: scheduleInfo.schedule_cron,
        schedule_date: scheduleInfo.schedule_date,
        schedule_js_path: scheduleInfo.schedule_js_path,
        schedule_js_fun: scheduleInfo.schedule_js_fun,
        schedule_ip: scheduleInfo.schedule_ip
    };
    if(!schedule.scheduledJobs[scheduleInfo.schedule_id]){
        (function (o) {
            try{
                var targetFile = require("../../../" + o.schedule_js_path);
                schedule.scheduleJob(o.schedule_id, o.schedule_cron, targetFile[o.schedule_js_fun].bind(null, o, scheduleInfo.schedule_params));
            }catch(e){
                console.log(e);
            }
        })(o);

        if(schedule.scheduledJobs[scheduleInfo.schedule_id]){
            //构造任务日志保存参数
            var scheduleLogEntity = {};
            scheduleLogEntity.schedule_id = scheduleInfo.schedule_id;
            scheduleLogEntity.schedule_ip = scheduleInfo.schedule_run_ip;
            scheduleLogEntity.schedule_start_time = new Date();
            scheduleLogEntity.schedule_status = 1;
            scheduleLogEntity.schedule_create_time = new Date();
            model.$ScheduleLog(scheduleLogEntity).save(function(error){
                if(error) {
                    console.error('save scheduleLog is error');
                }
            });
        }
    }
}

exports.cancelJob = function(scheduleInfo){
    if(schedule.scheduledJobs[scheduleInfo.schedule_id]){
        schedule.cancelJob(scheduleInfo.schedule_id);

        if(!schedule.scheduledJobs[scheduleInfo.schedule_id]){
            //构造任务日志保存参数
            var scheduleLogEntity = {};
            scheduleLogEntity.schedule_id = scheduleInfo.schedule_id;
            scheduleLogEntity.schedule_ip = scheduleInfo.schedule_run_ip;
            scheduleLogEntity.schedule_stop_time = new Date();
            scheduleLogEntity.schedule_status = 0;
            scheduleLogEntity.schedule_create_time = new Date();
            model.$ScheduleLog(scheduleLogEntity).save(function(error){
                if(error) {
                    console.error('save scheduleLog is error');
                }
            });
        }
    }
}

exports.getAllJob = function(){
    return schedule.scheduledJobs;
}