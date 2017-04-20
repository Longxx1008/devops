/**
 * Created by zhaojing on 2016/3/30.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
mongoose.set("debug",true)
var Schema = mongoose.Schema;

//构造字典Schema对象
var commonDictSchema = new Schema(
    {
        dict_code : String,// 字典编码
        dict_name : String,// 字典名
        dict_pid : String,// 字典父节点
        dict_status : Number,// 字典状态
        dict_remark : String// 字典描述
    },
    {collection: "common_dict_info"}// mongodb集合名
);

// 字典model
var CommonCoreDict = mongoose.model('CommonCoreDict', commonDictSchema);
exports.$ = CommonCoreDict;

//构造字典属性Schema对象
var commonDictAttrSchema = new Schema(
    {
        dict_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreDict'}, // 字典ID
        field_code : String,// 字段编码
        field_name : String,// 字段名
        field_value : String,// 字段值
        field_status : Number,// 字段状态
        field_remark : String,// 字段描述
        field_parent_id : String, // 字典父节点ID
        field_parent_value : String, // 字典父节点值
        field_checked : Number, // 默认选中(1:是；0:否)
        field_order : Number// 字典序号
    },
    {collection: "common_dict_attr_info"}// mongodb集合名
);

// 字典属性model
exports.$DictAttr = mongoose.model('CommonCoreDictAttr', commonDictAttrSchema);

