/**
 * Created by zhaojing on 2016/9/18.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;

//构造任务调度的Schema对象
var commonScheduleSchema = new Schema(
    {
        schedule_name : String,// 任务名
        schedule_code : String,// 任务编码
        schedule_cron : String,// 任务表达式
        schedule_date : [],// 任务具体执行日期
        schedule_js_path : String,// 执行任务的js文件路径
        schedule_js_fun : String,// 执行任务的js方法
        schedule_ip : [],// 执行任务的服务器ip地址
        schedule_status : Number,//状态
        schedule_create_time : Date,// 任务创建时间
        schedule_creator : String,// 任务创建人
        schedule_params : {}// 附加参数
    },
    {collection: "common_schedule"}// mongodb集合名
);

// 任务调度model
var CommonCoreSchedule = mongoose.model('common_schedule', commonScheduleSchema);
exports.$ = CommonCoreSchedule;

//构造任务调度日志的Schema对象
var commonScheduleLogSchema = new Schema(
    {
        schedule_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreSchedule'}, // 任务调度ID
        schedule_ip : String,// 运行服务器的ip地址
        schedule_start_time : Date,// 任务调度的启动时间
        schedule_stop_time : Date,// 任务调度的停止时间
        schedule_status : Number,// 任务调度的当前状态
        schedule_create_time : Date,// 任务日志创建时间
    },
    {collection: "common_schedule_log"}// mongodb集合名
);

// 任务调度日志model
var CommonCoreScheduleLog = mongoose.model('common_schedule_log', commonScheduleLogSchema);
exports.$ScheduleLog = CommonCoreScheduleLog;
