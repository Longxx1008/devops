/**
 * Created by 兰 on 2017-09-19.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
var Schema = mongoose.Schema;

var commonScheduleSchema = new Schema(
    {
        schedule_name : String, //事项名称
        schedule_content : String, //事项内容
        schedule_creator : {type: Schema.Types.ObjectId, ref: 'CommonCoreUser'}, //事项发布人
        schedule_executor : String, //事项执行人
        schedule_create_time : Date, //发布时间
        schedule_complete_time : Date,  //截止时间
        schedule_grade :String  //紧急程度
    },
    {collection: "common_schedule_info"}//mongodb集合名
);

// 代办事项model
var commonSchedule = mongoose.model('CommonCoreSchedule', commonScheduleSchema);
exports.$CommonCoreSchedule = commonSchedule;
