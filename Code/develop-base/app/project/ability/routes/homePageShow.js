/**
 * Created by 兰 on 2017-10-24.
 */

var express = require('express');
var router = express.Router();
var formidable=require("formidable");
var fs=require("fs");
var homePageShowService = require('../services/homePageShowService');
var utils = require('../../../common/core/utils/app_utils');



//首页展示查询的Controller
router.route('/getCarousel').get(function(req,res){
    var page = req.query.page;
    var length = req.query.rows;
    var showType=req.query.theShowType;
    homePageShowService.getCarouselDetail(page, length, showType,function(result){
        utils.respJsonData(res, result);
    });
});







module.exports = router;

