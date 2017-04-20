/**
 * Created by zhaojing on 2016/9/19.
 */
var config = require('../../../../config');
var model = require('../models/schedule_model');
var schedule_util = require('../utils/schedule_util');
var app_utils = require('../../core/utils/app_utils');

exports.init = function() {
    var mqtt  = require('mqtt');

    var server_host = config.mqtt.sub_client.server_host;
    var server_port = config.mqtt.sub_client.server_port;
    var client_ip = config.mqtt.sub_client.client_ip;

    var sub_client  = mqtt.connect('mqtt://'+server_host+':'+server_port,{
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clientId:'sub_'+client_ip+'_'+app_utils.getUUID()
    });

    sub_client.on('connect', function () {
        console.log('connect to mqttserver is ok');

        sub_client.subscribe('job',{qos:1},function(){
            console.log('subscribe is OK');
        });

        model.$.find({schedule_ip:{'$in':[client_ip]},schedule_status:1}).exec(function(err,rs) {
            if(err){
                console.error('获取任务调度信息出现异常');
            }else {
                if (rs.length > 0) {
                    var schedules = [];
                    for(var i=0;i<rs.length;i++){
                        if(rs[i]._doc.schedule_date != undefined && rs[i]._doc.schedule_date != null && rs[i]._doc.schedule_date[0] != '' && rs[i]._doc.schedule_date.length > 0){
                            var today = formatDate(new Date());
                            for(var j=0;j<rs[i]._doc.schedule_date.length;j++){
                                if(today == rs[i]._doc.schedule_date[j]){
                                    var o = {
                                        schedule_id:(rs[i]._doc._id).toString(),
                                        schedule_name:rs[i]._doc.schedule_name,
                                        schedule_code:rs[i]._doc.schedule_code,
                                        schedule_cron:rs[i]._doc.schedule_cron,
                                        schedule_date:rs[i]._doc.schedule_date,
                                        schedule_js_path:rs[i]._doc.schedule_js_path,
                                        schedule_js_fun:rs[i]._doc.schedule_js_fun,
                                        schedule_ip:rs[i]._doc.schedule_ip,
                                        schedule_params: rs[i]._doc.schedule_params,
                                        schedule_run_ip:client_ip
                                    }
                                    schedules.push(o);
                                }
                            }
                        }else{
                            var o = {
                                schedule_id:(rs[i]._doc._id).toString(),
                                schedule_name:rs[i]._doc.schedule_name,
                                schedule_code:rs[i]._doc.schedule_code,
                                schedule_cron:rs[i]._doc.schedule_cron,
                                schedule_date:rs[i]._doc.schedule_date,
                                schedule_js_path:rs[i]._doc.schedule_js_path,
                                schedule_js_fun:rs[i]._doc.schedule_js_fun,
                                schedule_ip:rs[i]._doc.schedule_ip,
                                schedule_params: rs[i]._doc.schedule_params,
                                schedule_run_ip:client_ip
                            }
                            schedules.push(o);
                        }
                    }
                    schedule_util.initJobs(schedules);
                }
            }
        });
    });

    sub_client.on('message', function (topic, message){
        console.log("=============================订阅客户端收到mqtt消息=============================");
        console.log(JSON.parse(message));
        console.log("=======================================END========================================");
        var msg = JSON.parse(message);
        var jobObj = msg.jobObj;
        var serviceObj = msg.serviceObj;
        if(jobObj.schedule_ip.indexOf(client_ip) > -1){
            if(jobObj.schedule_status == 1){
                if(jobObj.schedule_date != undefined && jobObj.schedule_date != null && jobObj.schedule_date[0] != '' && jobObj.schedule_date.length > 0) {
                    var today = formatDate(new Date());
                    for (var j = 0; j < jobObj.schedule_date.length; j++) {
                        if (today == jobObj.schedule_date[j]) {
                            var schedule = {
                                schedule_id: jobObj.schedule_id,
                                schedule_name: jobObj.schedule_name,
                                schedule_code: jobObj.schedule_code,
                                schedule_cron: jobObj.schedule_cron,
                                schedule_date: jobObj.schedule_date,
                                schedule_js_path: jobObj.schedule_js_path,
                                schedule_js_fun: jobObj.schedule_js_fun,
                                schedule_ip: jobObj.schedule_ip,
                                schedule_params: serviceObj,
                                schedule_run_ip:client_ip
                            }
                            schedule_util.addJob(schedule);
                        }
                    }
                }else{
                    var schedule = {
                        schedule_id: jobObj.schedule_id,
                        schedule_name: jobObj.schedule_name,
                        schedule_code: jobObj.schedule_code,
                        schedule_cron: jobObj.schedule_cron,
                        schedule_date: jobObj.schedule_date,
                        schedule_js_path: jobObj.schedule_js_path,
                        schedule_js_fun: jobObj.schedule_js_fun,
                        schedule_ip: jobObj.schedule_ip,
                        schedule_params: serviceObj,
                        schedule_run_ip:client_ip
                    }
                    schedule_util.addJob(schedule);
                }
            }else if(jobObj.schedule_status == 0){
                var schedule = {
                    schedule_id: jobObj.schedule_id,
                    schedule_name: jobObj.schedule_name,
                    schedule_code: jobObj.schedule_code,
                    schedule_cron: jobObj.schedule_cron,
                    schedule_date: jobObj.schedule_date,
                    schedule_js_path: jobObj.schedule_js_path,
                    schedule_js_fun: jobObj.schedule_js_fun,
                    schedule_ip: jobObj.schedule_ip,
                    schedule_params: serviceObj,
                    schedule_run_ip:client_ip
                }
                schedule_util.cancelJob(schedule);
            }
        }
    });
}

function formatDate(date){
    var format = 'yyyyMMdd';
    var o = {
        //month
        "M+" : date.getMonth() + 1,
        //day
        "d+" : date.getDate(),
        //hour
        "h+" : date.getHours(),
        //minute
        "m+" : date.getMinutes(),
        //second
        "s+" : date.getSeconds(),
        //quarter
        "q+" : Math.floor((date.getMonth() + 3) / 3),
        //millisecond
        "s" : date.getMilliseconds()
    };
    if(/(y+)/.test(format)){
        format = format.replace(RegExp.$1,(date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for(var k in o){
        if(new RegExp("(" + k + ")").test(format)){
            format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}