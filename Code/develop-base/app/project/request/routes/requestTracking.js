/**
 * Created by 兰 on 2017-09-26.
 */

var express = require('express');
var router = express.Router();
// var formidable=require("formidable");
// var fs=require("fs");
var requestTrackingService = require('../services/requestTrackingService');
var utils = require('../../../common/core/utils/app_utils');





router.route('/pageList').get(function(req,res){

    var page = req.query.page;
    var length = req.query.rows;
    var statusType=req.query.statusType;
    var appName=req.query.appName;
    var appUrl=req.query.appUrl;
    //console.log("appurl"+appUrl);
    var conditionMap = {};

    requestTrackingService.pageList(page, length, statusType,appName,appUrl,conditionMap,function(result){

        utils.respJsonData(res, result);
    });
});



router.route('/pageListByStatus').get(function(req,res){

    var page = req.query.page;
    var length = req.query.rows;


    var conditionMap = {};

    requestTrackingService.pageList(page, length, conditionMap,function(result){

        utils.respJsonData(res, result);
    });
});




router.route('/groupData').get(function(req,res){
    var conditionMap = {};
    var page=0;
    var size=10
    var appname=req.query.appname;
    var appurl=req.query.appurl;
    console.log("!!@@"+appurl);
    requestTrackingService.groupData(page, size,appname,appurl,conditionMap,function(result){

        utils.respJsonData(res, result);
    });
});









//
// //文章详情Controller
// router.route('/develop/info/getDetailById').get(function(req,res){
//     var conditionMap = {};
//     conditionMap.id=req.query.id;
//     requestTrackingService.getDetailMsgById(0, 10, conditionMap,function(result){
//         utils.respJsonData(res, result);
//     });
// });








module.exports = router;