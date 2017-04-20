/**
 * Created by zhaojing on 2016/10/10.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
mongoose.set("debug",true)
var Schema = mongoose.Schema;

//构造短信Schema对象
var commonSmsSchema = new Schema(
    {
        sms_phone : String,// 手机号
        sms_content : String,// 短信内容
        sms_send_time : Date,// 短信发送时间
        sms_msg : String,// 短信发送成功与否消息
    },
    {collection: "common_sms_info"}// mongodb集合名
);

// 短信model
var CommonCoreSms = mongoose.model('CommonCoreSms', commonSmsSchema);
exports.$ = CommonCoreSms;

