/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var greyenvironmtneService = require('../services/grayenvironmentmanageservice');
var utils = require('../../../common/core/utils/app_utils');


//获取平台信息 /grayenvironmentmanage/platform/info
router.route("/platform/info").get(function(req,res){
    greyenvironmtneService.getPlatfrom().then(function(rs){
        utils.respJsonData(res,rs)
    })
});

//获取灰度部署信息
router.route("/deploy/info").get(function(req,res){
    var gitlabProjectId=req.query.gitlabProjectId;
    //console.log("gitlabProjectIdgitlabProjectIdgitlabProjectId"+gitlabProjectId);
    greyenvironmtneService.getDeploy(gitlabProjectId,function(rs){
        utils.respJsonData(res,rs)
    })
});

//启动灰度部署
router.route("/start").get(function(req,res){
    var instance=req.query.instance;
    var imageName=req.query.imageName;
    var projectCode=req.query.projectCode;
    console.log("ssss"+instance+imageName+projectCode);
    greyenvironmtneService.start(instance,imageName,projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});



/***************运维中心-环境发布-获取项目健康情况*****************/
router.route("/environment/project").get(function(req,res){
   greyenvironmtneService.getProjectSituation().then(function(rs){
       utils.respJsonData(res,rs);
       console.log(res+'=============='+rs);
   })
})
/***********************运维中心-正式环境发布-获取项目情况***************************************/

router.route("/formaldeploy/info").get(function(req,res){
    var page=req.query.page;
    var length=req.query.rows;
    var conditionMap = {};
    greyenvironmtneService.getFormalDeploy(page, length, conditionMap,function(rs){
        utils.respJsonData(res,rs)
    })
})
module.exports = router;