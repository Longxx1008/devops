/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();

var appdetailService = require('../services/appdetailService');
var utils = require('../../../common/core/utils/app_utils');

//获取应用详情
router.route('/query').get(function(req,res){
    var appid=req.query.appid;
    if(!appid){
        utils.respMsg(res, false, '1000', '应用ID不能为空', null, null);
        return;
    }
    appdetailService.getAppdetails(appid,function(result){
        utils.respJsonData(res, result);
    });
});
//获取应用详情微服务
router.route('/microservice').get(function(req,res){
    var appid=req.query.appid;
    if(!appid){
        utils.respMsg(res, false, '1000', '应用ID不能为空', null, null);
        return;
    }
    appdetailService.getMicroServices(appid,function(result){
        utils.respJsonData(res, result);
    });
});


module.exports = router;