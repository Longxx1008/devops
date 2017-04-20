/**
 * Created by zhaojing on 2016/6/28.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
var Schema = mongoose.Schema;

var commonNoticeSchema = new Schema(
    {
            notice_title : String,// 公告标题
            notice_content : String,// 公告内容
            notice_type : String,// 公告类型
            notice_issuer : {type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},// 公告发布人
            notice_auditor : {type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},// 公告审核人
            notice_status : String,// 公告状态
            notice_date : Date,// 公告创建日期
            notice_up_time:Date//置顶日期，取置顶日期最大的显示
    },
    {collection: "common_notice_info"}//mongodb集合名
);

// 系统公告model
var commonNotice = mongoose.model('CommonCoreNotice', commonNoticeSchema);
exports.$CommonCoreNotice = commonNotice;