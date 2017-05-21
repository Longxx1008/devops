/**
 * Created by yaluo on 2017/5/21.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var alertService = require('../services/alertService');
var utils = require('../../../common/core/utils/app_utils');

//分页查询项目数据列表
router.route('/alert').get(function(req,res){
    console.log("收到来自grafana的告警信息...");
    var title = req.body.title;
    var ruleId = req.body.ruleId;
    var ruleName = req.body.ruleName;
    var ruleUrl = req.body.ruleUrl;
    var state = req.body.state;
    var imageUrl = req.body.imageUrl;
    var message = req.body.message;
    //
    var appId = message.substring(0,message.indexOf(","));
    var params = [];
    params.push(appid);
    params.push("1");// 1 grafana 告警 0 应用监控告警
    params.push(title);
    params.push(ruleId);
    params.push(ruleName);
    params.push(ruleUrl);
    params.push(state);
    params.push(imageUrl);
    params.push(message);
    params.push("1");//1 有效 0 无效

    alertService.save(params,function(result){
        utils.respJsonData(res, result);
    });
});
module.exports = router;
