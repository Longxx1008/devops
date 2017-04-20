/**
 * Created by ChenJun on 2016/7/26.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();

var Schema    = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var commonReportSchema = new Schema(
    {
            report_name: String,// 报表名
            report_addr: String,// 报表存放地址
            report_desc: String,// 报表描述
            creator: String,//创建人
            report_catalogid: String,// 报表类别ID
            createDt: Date,// 创建时间
            report_db:String,//连接数据库
            report_sysid: String// 参数所属系统id
    },
    {collection: "common_report_info"}//mongodb集合名
);

// model
var CommonReport = mongoose.model('CommonReport', commonReportSchema);
exports.$CommonReport = CommonReport;

var commonReportCatalogSchema = new Schema(
    {
        catalog_name : String, // 类别名称
        catalog_pid : String, // 父ID
        catalog_remark : String, // 类别备注
        catalog_status :  Number,// 参数状态（1：启用；0：禁用）
        catalog_sysid: String// 参数所属系统id
    },
    {collection: "common_report_catalog_info"}//mongodb集合名
);

// 类别model
var CommonReportCataLog = mongoose.model('CommonReportCataLog', commonReportCatalogSchema);
exports.$CommonReportCataLog = CommonReportCataLog;

var commonReportRoleSchema = new Schema(
    {
        report_id : String, // 报表ID
        role_id : String // 角色ID
    },
    {collection: "common_report_role_info"}//mongodb集合名
);

// 菜单操作model
var CommonReportRole = mongoose.model('CommonReportRole', commonReportRoleSchema);
exports.$CommonReportRole = CommonReportRole;


