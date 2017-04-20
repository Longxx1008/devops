/**
 * Created by zhaojing on 2016/11/21.
 */
var config = require('../../../../config');
var scheduleModel = require('../models/schedule_model');
var pub_client = require('../server/mqtt_pub_client');

/**
 * 创建job并且发布mqtt消息(job用)
 * @param jobObj
 */
exports.createJobAndPubMqttMessage = function(jobObj,serviceObj,cb){
    //参数判断
    if(isEmptyObject(jobObj)){
        cb({'success': false, 'code': '1001', 'msg': '参数不能为空'});
    }else{
        if(!jobObj.schedule_name){
            cb({'success': false, 'code': '1002', 'msg': 'job名称不能为空'});
        }else{
            if(!jobObj.schedule_code){
                cb({'success': false, 'code': '1003', 'msg': 'job编码不能为空'});
            }else{
                if(!jobObj.schedule_cron){
                    cb({'success': false, 'code': '1004', 'msg': 'job执行时间不能为空'});
                }else{
                    if(!jobObj.schedule_js_path){
                        cb({'success': false, 'code': '1005', 'msg': 'job执行文件路径不能为空'});
                    }else{
                        if(!jobObj.schedule_js_fun){
                            cb({'success': false, 'code': '1006', 'msg': 'job执行文件方法不能为空'});
                        }else{
                            if(!jobObj.schedule_ip){
                                cb({'success': false, 'code': '1007', 'msg': 'job执行服务器地址不能为空'});
                            }else{
                                var flag = checkConfig();
                                if(flag.success){
                                    var scheduleEntity = {};
                                    scheduleEntity.schedule_name = jobObj.schedule_name;
                                    scheduleEntity.schedule_code = jobObj.schedule_code;
                                    scheduleEntity.schedule_cron = jobObj.schedule_cron;
                                    scheduleEntity.schedule_date = jobObj.schedule_date;
                                    scheduleEntity.schedule_js_path = jobObj.schedule_js_path;
                                    scheduleEntity.schedule_js_fun = jobObj.schedule_js_fun;
                                    scheduleEntity.schedule_ip = jobObj.schedule_ip;
                                    scheduleEntity.schedule_status = 1;
                                    scheduleEntity.schedule_create_time = new Date();
                                    scheduleEntity.schedule_creator = jobObj.schedule_creator;
                                    scheduleEntity.schedule_params = serviceObj;
                                    scheduleModel.$.create(scheduleEntity,function(error,rs){
                                        if(error) {
                                            cb({'success': false, 'code': '1008', 'msg': '发布消息启动job出现错误，因为：数据库保存任务信息出现异常'});
                                        } else {
                                            scheduleEntity.schedule_id = (rs._doc._id).toString();
                                            pub_client.publishOne(scheduleEntity,serviceObj);
                                            cb({'success': true, 'code': '0000', 'msg': '发布消息成功', 'jobId': scheduleEntity.schedule_id});
                                        }
                                    });
                                }else{
                                    cb(flag);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * 发布mqtt消息(job用)
 * @param jobObj
 */
exports.pubMqttMessage = function(jobObj,serviceObj,cb){
    //参数判断
    if(isEmptyObject(jobObj)){
        cb({'success': false, 'code': '1001', 'msg': '参数不能为空'});
    }else{
        if(jobObj.schedule_status == null || jobObj.schedule_status == undefined){
            cb({'success': false, 'code': '1002', 'msg': 'job状态不能为空'});
        }else{
            if(jobObj.schedule_status == 1){
                if(!jobObj.schedule_id){
                    cb({'success': false, 'code': '1003', 'msg': 'job的id不能为空'});
                }else{
                    if(!jobObj.schedule_name){
                        cb({'success': false, 'code': '1004', 'msg': 'job名称不能为空'});
                    }else{
                        if(!jobObj.schedule_code){
                            cb({'success': false, 'code': '1005', 'msg': 'job编码不能为空'});
                        }else{
                            if(!jobObj.schedule_cron){
                                cb({'success': false, 'code': '1006', 'msg': 'job执行时间不能为空'});
                            }else{
                                if(!jobObj.schedule_js_path){
                                    cb({'success': false, 'code': '1007', 'msg': 'job执行文件路径不能为空'});
                                }else{
                                    if(!jobObj.schedule_js_fun){
                                        cb({'success': false, 'code': '1008', 'msg': 'job执行文件方法不能为空'});
                                    }else{
                                        if(!jobObj.schedule_ip){
                                            cb({'success': false, 'code': '1009', 'msg': 'job执行服务器地址不能为空'});
                                        }else{
                                            var flag = checkConfig();
                                            if(flag.success){
                                                var scheduleEntity = {
                                                    schedule_status : 1
                                                }
                                                scheduleModel.$.update({_id:jobObj.schedule_id},{$set: scheduleEntity},{},function(err){
                                                    if(err){
                                                        cb({'success': false, 'code': '1010', 'msg': '更新job数据库出现异常'});
                                                    }else{
                                                        pub_client.publishOne(jobObj,serviceObj);
                                                        cb({'success': true, 'code': '0000', 'msg': '发布消息成功'});
                                                    }
                                                });
                                            }else{
                                                cb(flag);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }else if(jobObj.schedule_status == 0){
                if(!jobObj.schedule_id){
                    cb({'success': false, 'code': '1011', 'msg': 'job的id不能为空'});
                }else{
                    if(!jobObj.schedule_ip){
                        cb({'success': false, 'code': '1012', 'msg': 'job执行服务器地址不能为空'});
                    }else{
                        var flag = checkConfig();
                        if(flag.success){
                            var scheduleEntity = {
                                schedule_status : 0
                            }
                            scheduleModel.$.update({_id:jobObj.schedule_id},{$set: scheduleEntity},{},function(err){
                                if(err){
                                    cb({'success': false, 'code': '1013', 'msg': '更新job数据库出现异常'});
                                }else{
                                    pub_client.publishOne(jobObj,serviceObj);
                                    cb({'success': true, 'code': '0000', 'msg': '发布消息成功'});
                                }
                            });
                        }else{
                            cb(flag);
                        }
                    }
                }
            }
        }
    }
}

/**
 * 检查配置
 * @returns {*}
 */
function checkConfig(){
    if(!config.mqtt.is_use){
        return {'success': false, 'code': '2001', 'msg': 'mqtt服务未开启'};
    }
    if(!config.mqtt.server.is_load){
        return {'success': false, 'code': '2002', 'msg': 'mqtt发布客户端未开启'};
    }
    return {'success': true, 'code': '0000', 'msg': '检查配置项通过'};
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


