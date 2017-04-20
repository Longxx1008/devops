/**
 * Created by ShiHukui on 2016/2/29.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();

var Schema    = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var commonMenuSchema = new Schema(
    {
            menu_code: String,// 菜单编码
            menu_name: String,// 菜单名称
            menu_nav: String,// 菜单导航
            menu_remark: String,// 菜单备注
            menu_url: String,// 菜单访问地址
            menu_cls: String,// 菜单样式
            menu_level: Number,// 菜单层级
            menu_type: Number,// 菜单类型（1：框架内置；2：业务自有）
            menu_order: Number,// 菜单序号
            menu_status: Number,// 菜单状态（1：启用；0：禁用）
            menu_pid: String,// 菜单父节点id
            menu_hidden:{type: Number, default: 0},// 菜单是否隐藏（0:显示；1：隐藏）
            menu_use_sys_layout:{type: Number, default: 1},// 菜单是是否沿用系统布局（1：是；0：否）
            menu_target:{type: String, default: '_self'},// 页面目标
            menu_sysid: String// 菜单所属系统id
    },
    {collection: "common_menu_info"}//mongodb集合名
);

// model
var CommonCoreRoleMenu = mongoose.model('CommonCoreRoleMenu', commonMenuSchema);
exports.$CommonCoreRoleMenu = CommonCoreRoleMenu;

var commonMenuOptSchema = new Schema(
    {
        "menu_id" : String, // 所属菜单
        "opt_code" : String, // 操作编码
        "opt_name" : String, // 操作名称
        "opt_url" : String, // 操作执行url
        "opt_method" : String, // 操作执行http method
        "opt_status" : Number, // 操作状态
        "opt_remark" : String, // 操作备注
        "opt_order" : Number // 操作排序号
    },
    {collection: "common_menu_opt_info"}//mongodb集合名
);

// 菜单操作model
var CommonCoreMenuOpt = mongoose.model('CommonCoreMenuOpt', commonMenuOptSchema);
exports.$CommonCoreMenuOpt = CommonCoreMenuOpt;

var commonRoleMenuOptSchema = new Schema(
    {
        "role_id" : String, // 角色ID
        "menu_id" : {type: Schema.Types.ObjectId, ref: 'CommonCoreRoleMenu'}, // 菜单ID
        "menu_opts" : [{type: Schema.Types.ObjectId, ref: 'CommonCoreMenuOpt'}] // 菜单中执行的操作
    },
    {collection: "common_role_menu_opt"}//mongodb集合名
);

// 角色拥有权限（菜单）model
exports.$ = mongoose.model('CommonCoreRoleMenuOpt', commonRoleMenuOptSchema);

