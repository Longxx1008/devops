/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();

var qualityService = require('../services/qualityService');
var utils = require('../../../common/core/utils/app_utils');

//获取质量状况
router.route('/query').get(function(req,res){
    var microserviceid=req.query.microserviceid;
    if(!microserviceid){
        utils.respMsg(res, false, '1000', '微服务ID不能为空', null, null);
        return;
    }
    qualityService.getQuality(microserviceid,function(result){
        console.log(result);
        utils.respJsonData(res, result);
    });
});


module.exports = router;