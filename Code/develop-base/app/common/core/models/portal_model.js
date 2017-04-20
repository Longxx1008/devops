// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();

var Schema = mongoose.Schema;

//构造portal模块module Schema对象
var commonPortalModuleSchema = new Schema(
    {
        "sys_id" : String,
        "module_code" : String,
        "module_title" : String,
        "module_url" : String,
        "module_height" : Number,
        "module_closable":{type:Number, default: 0},
        "module_cls":String,
        "module_body_cls":String,
        "module_icon_cls":String,
        "module_status" : Number,
        "module_remark" : String,
        "module_order" : Number,
        "module_roles" : [{type: String}],// 所拥有的角色,
        "module_is_public" : Number,
        "module_type" : String,
        "module_params" : String,
        "module_tools" : [{
            "icon_cls" : String,
            "icon_handler" : String
        }]
    },
    {collection: "common_portal_modules"}// mongodb集合名
);

var CommonPortalModuleSchema = mongoose.model('CommonPortalModuleSchema', commonPortalModuleSchema);
exports.$PortalModule = CommonPortalModuleSchema;

//构造portal模块page Schema对象
var commonPortalPageSchema = new Schema(
    {
        "sys_id" : String,
        "page_code" : String,
        "page_name":String,
        "page_bg_cls" : {type:String, default: 'normal'},
        "page_status" : Number,
        "page_remark" : String,
        "page_is_default" : Number,
        "page_is_customize" : Number,
        "page_layout" : {type:String, default: 'themes/portal_eui/layout'},
        "page_body" : {type:String, default: 'common/portal/template/tpl'},
        "page_layout_modules" : [{
                "col_index" : Number,
                "module_id" : {type: Schema.Types.ObjectId, ref: 'CommonPortalModuleSchema'}
        }],
        "page_layout_col_type" : String
    },
    {collection: "common_portal_pages"}// mongodb集合名
);

var CommonPortalPageSchema = mongoose.model('CommonPortalPageSchema', commonPortalPageSchema);
exports.$PortalPage = CommonPortalPageSchema;

//构造portal模块个人page Schema对象
var commonPortalPagePersonalSchema = new Schema(
    {
            "user_id": String,
            "page_id" : {type:Schema.Types.ObjectId, ref: 'CommonPortalPageSchema'},
            "page_layout_modules" : [{
                    "col_index" : Number,
                    "module_id" : {type: Schema.Types.ObjectId, ref: 'CommonPortalModuleSchema'}
            }]
    },
    {collection: "common_portal_pages_personal"}// mongodb集合名
);

var CommonPortalPagePersonalSchema = mongoose.model('CommonPortalPagePersonalSchema', commonPortalPagePersonalSchema);
exports.$PortalPagePersonal = CommonPortalPagePersonalSchema;