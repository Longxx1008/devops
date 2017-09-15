/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var colonyDetailService = require('../services/colonyDetailService');
var utils = require('../../../common/core/utils/app_utils');

router.route('/:id').post(function(req,res){
    // 调用查询
    colonyDetailService.getResourceByConoly(function(results){
        utils.respJsonData(res, results);
    });
});

router.route('/getHostInfo').get(function(req,res){
    // 调用查询
    colonyDetailService.getHostInfo(function(results){
        utils.respJsonData(res, results);
    });
});

module.exports = router;