/**
 * Created by ShiHukui on 2016/2/29.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();

var Schema    = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var commonOrgSchema = new Schema(
    {
        org_code : String,// 机构编号
        org_name : String,// 机构名
        org_fullname : String,// 机构全名
        org_order : Number,// 排序号
        org_type : String,// 机构类型
        org_pid : String,// 机构父节点
        org_status : Number,// 机构状态
        org_remark : String// 机构描述
    },
    {collection: "common_org_info"}//mongodb集合名
);

// 机构model
var CommonCoreOrg = mongoose.model('CommonCoreOrg', commonOrgSchema);
exports.$CommonCoreOrg = CommonCoreOrg;

var commonOrgAttachAttrSchema = new Schema(
    {
        org_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreOrg'},// 所在部门
        start_time:Date,
        end_time:Date,
        attr_items:[{type:String}],
        status:Number
    },
    {collection: "common_org_attach_attr"}//mongodb集合名
);

// 机构附加属性model
var CommonCoreOrgAttachAttr = mongoose.model('CommonCoreOrgAttachAttr', commonOrgAttachAttrSchema);
exports.$CommonCoreOrgAttachAttr = CommonCoreOrgAttachAttr;

var commonSysSchema = new Schema(
    {
        "sys_code" : String,
        "sys_name" : String,
        "sys_url" : String,
        "sys_status" : Number,
        "sys_remark" : String,
        "sys_main_url" : String,
        "sys_theme_layout" : String
    },
    {collection: "common_system_info"}//mongodb集合名
);

// 系统model
var CommonCoreSys = mongoose.model('CommonCoreSys', commonSysSchema);
exports.$CommonCoreSys = CommonCoreSys;

var commonRoleSchema = new Schema(
    {
        "role_code" : String,
        "role_name" : String,
        "role_status" : Number,
        "sys_id" : String,
        "role_order" : Number,
        "role_remark" : String
    },
    {collection: "common_role_info"}//mongodb集合名
);

// 角色model
var CommonCoreRole = mongoose.model('CommonCoreRole', commonRoleSchema);
exports.$CommonCoreRole = CommonCoreRole;

var commonUserSchema = new Schema(
    {
        login_account : String,// 登录账号
        login_password : String,// 登录密码
        user_no : String,// 用户工号
        user_name : String,// 用户姓名
        user_photo : String,// 用户头像/照片
        user_gender : Number,// 用户性别
        user_phone : String,// 用户手机
        user_tel : String,// 用户联系电话
        user_email : String,// 用户邮箱
        user_status : Number,// 用户状态
        user_org : {type: Schema.Types.ObjectId, ref: 'CommonCoreOrg'},// 所在部门
        user_sys : {type: Schema.Types.ObjectId, ref: 'CommonCoreSys'},// 所属系统
        user_roles : [{type: Schema.Types.ObjectId, ref: 'CommonCoreRole'}],// 所拥有的角色
        theme_name : String,// 使用主题
        theme_skin : String// 使用皮肤
    },
    {collection: "common_user_info"}//mongodb集合名
);

// 账号model
exports.$ = mongoose.model('CommonCoreUser', commonUserSchema);

/**
 * 用户登录错误日志
 */
var commonUserLoginErrorLogSchema = new Schema(
    {
            login_account : {type:String, index:true},// 登录账号
            login_password : String,// 登录密码
            login_date : {type:String, index:true},// 登录日期
            login_time:Date// 登录时间
    },
    {collection: "common_user_login_error_log"}//mongodb集合名
);

// 账号model
exports.$CommonUserLoginErrorLog = mongoose.model('commonUserLoginErrorLog', commonUserLoginErrorLogSchema);

