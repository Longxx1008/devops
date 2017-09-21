/**
 * Created by 兰 on 2017-09-19.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
var Schema = mongoose.Schema;

var commonScheduleSchema = new Schema(
    {
        schedule_name : String,// 任务名称
        schedule_code : String,// 任务编号
        schedule_cron : String,//
        schedule_js_path : String,
        schedule_js_fun : String,//
        schedule_ip : String,//
        schedule_status : Number,//
        schedule_create_time:Date,//
        schedule_creator:String,
        __v:Number,
        schedule_date:Date
    },
    {collection: "common_schedule"}//mongodb集合名
);

// 代办事项model
var commonSchedule = mongoose.model('CommonCoreSchedule', commonScheduleSchema);
exports.$CommonCoreSchedule = commonSchedule;
