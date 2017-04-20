/**
 * Created by ChenJun on 2016/3/30.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();

var Schema    = mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var commonParamSchema = new Schema(
    {
            param_name: String,// 参数名
            param_val: String,// 参数值
            param_desc: String,// 参数描述
            param_status: Number,// 参数状态（1：启用；0：禁用）
            param_catalogid: String,// 参数类别ID
            param_sysid: String// 参数所属系统id
    },
    {collection: "common_param_info"}//mongodb集合名
);

// model
var CommonParam = mongoose.model('CommonParam', commonParamSchema);
exports.$CommonParam = CommonParam;

var commonParamCatalogSchema = new Schema(
    {
        catalog_name : String, // 类别名称
        catalog_pid : String, // 父ID
        catalog_remark : String, // 类别备注
        catalog_status :  Number,// 参数状态（1：启用；0：禁用）
        catalog_sysid: String// 参数所属系统id
    },
    {collection: "common_param_catalog_info"}//mongodb集合名
);

// 菜单操作model
var CommonParamCataLog = mongoose.model('CommonParamCataLog', commonParamCatalogSchema);
exports.$CommonParamCataLog = CommonParamCataLog;


