/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();
var formidable=require("formidable");
var fs=require("fs");

var appmarketService = require('../services/appmarketService');
var utils = require('../../../common/core/utils/app_utils');

//获取推荐应用
router.route('/getRecommend').get(function(req,res){
    appmarketService.getRecommend(function(result){
        utils.respJsonData(res, result);
    });
});


/**
 * 获取热门应用
 */
router.route('/getHot').get(function(req,res){
    appmarketService.getHot(function(result){
        utils.respJsonData(res, result);
    });
});




module.exports = router;