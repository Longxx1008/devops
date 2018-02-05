/**
 * Created by szx on 2018/2/1.
 */
var express = require('express');
var router = express.Router();
var healthDetailService = require('../services/healthDetailServices');
var utils = require('../../../common/core/utils/app_utils');

router.route('/')
    .post(function(req,res){
        var id=req.body.id;
        var conditionMap={};
        conditionMap.id=id;
        healthDetailService.getHealthDetail(conditionMap, function (result) {

            console.log("check id",result);
            utils.respJsonData(res,result);
        });
    });


module.exports = router;
