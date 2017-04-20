// 引入mongoose工具类
var mongoUtils  = require('../mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
mongoose.set("debug",true)
var Schema = mongoose.Schema;

//构造app接口定义Schema对象
var commonAppApiDefineSchema = new Schema(
    {
        api_type:String,
        api_code:String,
        api_name:String,
        api_auth_access:{type:Number,default:0},// '0:无需登录访问，1:需登录访问'
        api_logging:{type:Number,default:0},// '0:不记录日志，1:记录日志'
        api_is_demo:Number,// '0:正式接口，1:模拟接口'
        api_demo_result:String,// 模拟接口时返回的数据
        api_service_name:String,
        api_service_method:String,
        api_remark:String,// 接口备注
        api_status:Number,// 0:禁用；1:启用
        api_repeat_access:{type:Number,default:1},// 1:允许重复访问；0：不允许重复访问
        api_expdt_set:{type:Number,default:0},// '0:永久有效；1:时间段有效'
        api_expdt_start:Date,
        api_expdt_end:Date,
        api_cache_enable:{type:Number,default:0},// '0：不启用缓存；1：启用缓存；'
        api_cache_type:Number,// '0:公共缓存；1私有缓存；'
        api_cache_key:String,// '缓存key'
        api_cache_expire:Number,// '过期时间'
        api_params:[
                {
                        "param_name" : String,// 参数名
                        "param_type" : String,// 参数类型
                        "param_order": Number,// 参数序号
                        "param_value": String,// 参数值
                        "param_remark":String // 参数描述
                }
        ]

    },
    {collection: "common_app_api_define"}// mongodb集合名
);


commonAppApiDefineSchema.virtual('my_order').get(function () {
        return parseInt(100 * Math.random());
});

// 字典model
var CommonAppApiDefine = mongoose.model('CommonAppApiDefine', commonAppApiDefineSchema);
exports.$ = CommonAppApiDefine;

