/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();
var formidable=require("formidable");
var fs=require("fs");

var appmarketDetailService = require('../services/appmarketDetailService');
var utils = require('../../../common/core/utils/app_utils');

router.route('/:id')
    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            appmarketDetailService.getDetailByImageCode(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', 'ID不能为空。', null, null);
        }
    })

module.exports = router;