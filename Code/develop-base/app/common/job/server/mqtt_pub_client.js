/**
 * Created by zhaojing on 2016/9/19.
 */
var config = require('../../../../config');
var model = require('../models/schedule_model');
var app_utils = require('../../core/utils/app_utils')
var pub_client;

exports.init = function() {
    var mqtt  = require('mqtt');

    var server_host = config.mqtt.pub_client.server_host;
    var server_port = config.mqtt.pub_client.server_port;
    var client_ip = config.mqtt.pub_client.client_ip+'_'+app_utils.getUUID();

    pub_client  = mqtt.connect('mqtt://'+server_host+':'+server_port,{
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clientId:'pub_'+client_ip
    });

    pub_client.on('connect', function () {
        console.log('connect to mqttserver is ok');
        model.$.find().exec(function(err,rs) {
            if(err){
                console.error('获取任务调度信息出现异常');
            }else{
                if(rs.length > 0){
                    for(var i=0;i<rs.length;i++){
                        var jobObj = {
                            schedule_id:(rs[i]._doc._id).toString(),
                            schedule_name:rs[i]._doc.schedule_name,
                            schedule_code:rs[i]._doc.schedule_code,
                            schedule_cron:rs[i]._doc.schedule_cron,
                            schedule_date:rs[i]._doc.schedule_date,
                            schedule_js_path:rs[i]._doc.schedule_js_path,
                            schedule_js_fun:rs[i]._doc.schedule_js_fun,
                            schedule_ip:rs[i]._doc.schedule_ip,
                            schedule_status:rs[i]._doc.schedule_status
                        }
                        var message = {
                            jobObj : jobObj,
                            serviceObj : rs[i]._doc.schedule_params
                        }
                        pub_client.publish('job', JSON.stringify(message), {qos:1,retain: true});
                    }
                }
            }
        });
    });
}

/**
 * 发布消息
 * @param msg  Json字符串
 */
exports.publishOne = function(jobObj,serviceObj){
    var message = {
        jobObj : jobObj,
        serviceObj : serviceObj
    }
    pub_client.publish('job', JSON.stringify(message), {qos:1,retain: true});
}
