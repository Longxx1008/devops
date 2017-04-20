/**
 * Created by zhaojing on 2016/8/4.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
mongoose.set("debug",true)
var Schema = mongoose.Schema;

//构造流程基本属性Schema对象
var commonProcessBaseSchema = new Schema(
    {
        proc_code : String,// 流程编码
        proc_name : String,// 流程名
        proc_latest_ver : Number,// 流程最后版本号
        proc_create_time : Date,// 流程创建时间
        proc_creator : String,// 流程创建人
        proc_status : String//状态
    },
    {collection: "common_bpm_proc_base"}// mongodb集合名
);

// 流程基本属性model
var CommonCoreProcessBase = mongoose.model('CommonCoreProcessBase', commonProcessBaseSchema);
exports.$ProcessBase = CommonCoreProcessBase;

//构造流程实例Schema对象
var commonProcessDefineSchema = new Schema(
    {
        proc_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessBase'}, // 流程实例ID
        proc_code : String,// 流程编码
        proc_name : String,// 流程名
        proc_ver : Number,// 流程版本号
        proc_define : String,// 流程定义内容
        proc_create_time : Date,// 流程创建时间
        proc_creator : String,// 流程创建人
        proc_status : String//状态
    },
    {collection: "common_bpm_proc_define"}// mongodb集合名
);

// 流程实例model
exports.$ProcessDefine = mongoose.model('CommonCoreProcessDefine', commonProcessDefineSchema);

//构造流程节点Schema对象
var commonProcessItemSchema = new Schema(
    {
        proc_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessBase'}, // 流程基本属性ID
        proc_code : String,// 流程编码
        proc_ver : Number,// 流程版本号
        proc_define_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessDefine'},// 流程实例ID
        item_code : String,// 节点编码
        item_type : String,// 节点类型
        item_el : String,// 节点表达式
        item_sms_warn : Number,// 是否短信提醒
        item_sign : String,// 是否会签
        item_assignee_role : String, // 参与角色
        item_assignee_ref_task : String,// 参照人
        item_assignee_ref_type : String,// 参照人类别
        item_assignee_user : String,// 参与人
        item_show_text : String// 显示内容
    },
    {collection: "common_bpm_proc_item_cfg"}// mongodb集合名
);

// 流程节点model
exports.$ProcessItem = mongoose.model('CommonCoreProcessItem', commonProcessItemSchema);

//构造流程流转当前信息Schema对象
var commonProcessInstSchema = new Schema(
    {
        proc_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessDefine'}, // 流程实例ID
        proc_code : String,// 流程编码
        proc_name : String,// 流程名
        proc_ver : Number,// 流程版本号
        proc_title : String,//流程标题
        proc_cur_task : String,// 流程当前节点编码
        proc_cur_task_name : String,// 流程当前节点名称
        proc_cur_user : {type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},//当前流程处理人ID
        proc_cur_user_name : String,//当前流程处理人名
        proc_cur_arrive_time : Date,//当前流程到达时间
        proc_start_user : {type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},// 流程发起人ID
        proc_start_user_name : String,// 流程发起人名
        proc_start_time : Date,// 流程发起时间
        proc_params : String,// 流转参数
        proc_inst_status : Number// 流程流转状态
    },
    {collection: "common_bpm_proc_inst"}// mongodb集合名
);

// 流程流转当前信息model
exports.$ProcessInst = mongoose.model('CommonCoreProcessInst', commonProcessInstSchema);

//构造流程流转历史信息Schema对象
var commonProcessInstTaskSchema = new Schema(
    {
        proc_inst_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
        proc_inst_task_code : String,// 流程当前节点编码
        proc_inst_task_name : String,// 流程当前节点名称
        proc_inst_task_type : String,// 流程当前节点类型
        proc_inst_task_arrive_time : Date,// 流程到达时间
        proc_inst_task_complete_time : Date,// 流程完成时间
        proc_inst_task_status : Number,// 流程当前状态
        proc_inst_task_assignee : {type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},// 流程处理人ID
        proc_inst_task_assignee_name : String,// 流程处理人名
        proc_inst_task_params : String,// 流程参数
        proc_inst_task_claim : Number,// 流程会签
        proc_inst_task_sign : Number,// 流程签收
        proc_inst_task_sms : Number,// 流程是否短信提醒
        proc_inst_task_remark : String// 流程处理意见
    },
    {collection: "common_bpm_proc_inst_task"}// mongodb集合名
);

// 流程流转历史信息model
exports.$ProcessInstTask = mongoose.model('CommonCoreProcessInstTask', commonProcessInstTaskSchema);
