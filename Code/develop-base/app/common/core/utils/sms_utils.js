/**
 * Created by zhaojing on 2016/9/28.
 */
var soap = require('soap');
var config = require('../../../../config');
var smsModel = require('../models/sms_model');

/**
 * 发送短信
 * @param phone        电话号码
 * @param msgcontent   短信内容
 * @param callback     回调函数
 */
exports.sendMessage = function(phone,msgcontent,callback){
    var debug = config.sms.debug;
    if(debug){
        var url = config.sms.url;
        var xml = '<?xml version="1.0" encoding="GBK"?>'
                + '<xml>'
                    + '<message>'
                        + '<OneRecord>'
                            + '<desttermid>'+ phone +'</desttermid>'                                  //电话号码
                            + '<username>'+config.sms.username+'</username>'                          //分配的用户名
                            + '<password>'+config.sms.password+'</password>'                          //分配的密码
                            + '<licence>'+config.sms.licence+'</licence>'                             //分配的序列号
                            + '<msgcontent><![CDATA['+ msgcontent +']]></msgcontent>'                 //短信正文
                            + '<systeminfo><![CDATA['+ config.sms.systeminfo +']]></systeminfo>'      //所属系统
                        + '</OneRecord>'
                    + '</message>'
                + '</xml>';

        soap.createClient(url, function(err, client) {
            client.setEndpoint("http://10.195.175.117:8091/newSmsWebService/services/SMSService.SMSServiceHttpSoap11Endpoint/");

            client.SMSService.SMSServiceHttpSoap11Endpoint.SmsSendMQ(xml,function(error, result, raw, soapHeader){
                var rs = parseInt(result.return);
                var sms;
                switch (rs)
                {
                    case 0:
                        sms = {'success':true, 'msg':"短信发送成功"};
                        break;
                    case 1:
                        sms = {'success':false, 'msg':"用户名未找到"};
                        break;
                    case 2:
                        sms = {'success':false, 'msg':"密码不匹配"};
                        break;
                    case 3:
                        sms = {'success':false, 'msg':"xml解析出错"};
                        break;
                    case 4:
                        sms = {'success':false, 'msg':"短信超量"};
                        break;
                    case 5:
                        sms = {'success':false, 'msg':"licence过期"};
                        break;
                    case 6:
                        sms = {'success':false, 'msg':"licence不正确"};
                        break;
                    case 7:
                        sms = {'success':false, 'msg':"xml参数缺失"};
                        break;
                    case 10:
                        sms = {'success':false, 'msg':"调用异常"};
                        break;
                }
                smsModel.$({sms_phone:phone,sms_content:msgcontent,sms_send_time:new Date(),sms_msg:sms.msg}).save(function(error){
                    callback(sms);
                });
            });
        });
    }else{
        callback({'success':true, 'msg':"测试短信发送成功"})
    }
}