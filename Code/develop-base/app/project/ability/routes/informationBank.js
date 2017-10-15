/**
 * Created by 兰 on 2017-09-26.
 */

var express = require('express');
var router = express.Router();
var formidable=require("formidable");
var fs=require("fs");
var informationBankService = require('../services/informationBankService');
var utils = require('../../../common/core/utils/app_utils');



// 发布人/标题/分类 查询的Controller
router.route('/develop/info/pageListSearchByName').get(function(req,res){

    var page = req.query.page;
    var length = req.query.rows;
    var information_title=req.query.infoName;
    var information_type=req.query.typeStr;
    var conditionMap = {};
    conditionMap.information_title=information_title;
    conditionMap.information_type=information_type;
    informationBankService.pageListSearch(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

// router.route('/develop/info/getAllCount').get(function(req,res){
//     var information_type=req.query.typeStr;
//     informationBankService.searchAllCount(function(result){
//         utils.respJsonData(res, result);
//     });
// });

router.route('/develop/info/pageList').get(function(req,res){

    var page = req.query.page;
    var length = req.query.rows;

    var conditionMap = {};

    informationBankService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});



//首页展示查询的Controller
router.route('/develop/info/pageListDemo').get(function(req,res){

    var page = req.query.page;
    var length = req.query.rows;
    informationBankService.pageListDemo(page, length, null,function(result){
        utils.respJsonData(res, result);
    });
});

//文章详情Controller
router.route('/develop/info/getDetailById').get(function(req,res){
    var conditionMap = {};
    conditionMap.id=req.query.id;
    informationBankService.getDetailMsgById(0, 10, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
    informationBankService.addCount(conditionMap.id);
});








module.exports = router;